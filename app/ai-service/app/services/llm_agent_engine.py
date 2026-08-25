import threading
import time
from collections import deque
import logging

try:
    import google.generativeai as genai
except ImportError:
    logging.warning("google.generativeai not installed. Please run: pip install google-generativeai")

class LLMAgentEngine:
    """
    An AI Agent Engine that aggregates classroom data over a time window
    and asynchronously calls an LLM (e.g., Gemini) to decide if teaching is active.
    This prevents blocking the real-time video stream.
    """
    def __init__(self, api_key=None, check_interval=5.0):
        # Buffers to store last N frames of data
        self.speech_buffer = deque(maxlen=30)
        self.gesture_buffer = deque(maxlen=30)
        self.person_buffer = deque(maxlen=30)
        self.head_pose_buffer = deque(maxlen=30)
        
        # How often to call the LLM (in seconds)
        self.check_interval = check_interval
        self.last_check_time = time.time()
        
        # Caching the last known status so the video doesn't freeze waiting for the API
        self.current_status = "INITIALIZING AGENT..."
        self.current_score = 0.0
        self.current_color = (255, 255, 255)
        
        # LLM Initialization
        self.api_key = api_key
        self.model = None
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # You could also use gemini-1.5-flash for faster responses
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            logging.warning("No API key provided for LLMAgentEngine.")
            
        self.lock = threading.Lock()
        
    def _call_llm_agent(self, speech_score, gesture_score, person_score, head_pose_mode):
        if not self.model:
            return "API_KEY_MISSING", 0.0
            
        prompt = f"""
        You are a smart classroom AI assistant.
        Determine if the teacher is currently actively teaching based on the following 5-second summary data:
        - Speech detected: {speech_score*100:.1f}% of the time
        - Gestures detected: {gesture_score*100:.1f}% of the time
        - Person present in frame: {person_score*100:.1f}% of the time
        - Most common head pose: {head_pose_mode}
        
        Respond with exactly ONE of the following states, followed by a comma, followed by a confidence score between 0.00 and 1.00.
        States: TEACHING ACTIVE, LIKELY TEACHING, INACTIVE
        Example response: TEACHING ACTIVE, 0.85
        """
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            parts = text.split(',')
            
            if len(parts) >= 2:
                status = parts[0].strip().upper()
                score = float(parts[1].strip())
                return status, score
                
            return "INVALID_RESPONSE", 0.5
        except Exception as e:
            logging.error(f"LLM Agent API Error: {e}")
            return "API_ERROR", 0.0

    def _async_decide(self, speech_score, gesture_score, person_score, head_pose_mode):
        """Background thread worker to fetch decision without freezing OpenCV"""
        status, score = self._call_llm_agent(speech_score, gesture_score, person_score, head_pose_mode)
        
        color = (0, 0, 255) # Red for Inactive/Error
        if "TEACHING ACTIVE" in status:
            color = (0, 255, 0)
        elif "LIKELY" in status:
            color = (0, 255, 255)
            
        # Update thread-safe state
        with self.lock:
            self.current_status = status
            self.current_score = score
            self.current_color = color

    def update(self, teacher, gesture, speech, person, facing_forward, head_state):
        # 1. Store current frame data
        self.gesture_buffer.append(int(gesture))
        self.speech_buffer.append(int(speech))
        self.person_buffer.append(int(person))
        self.head_pose_buffer.append(head_state)
        
        now = time.time()
        
        # 2. Check if it's time to ask the agent again
        if now - self.last_check_time >= self.check_interval:
            self.last_check_time = now
            
            # Calculate averages over the buffer
            gesture_score = sum(self.gesture_buffer) / len(self.gesture_buffer) if self.gesture_buffer else 0.0
            speech_score = sum(self.speech_buffer) / len(self.speech_buffer) if self.speech_buffer else 0.0
            person_score = sum(self.person_buffer) / len(self.person_buffer) if self.person_buffer else 0.0
            
            # Find the most common head pose in the buffer
            head_pose_mode = "UNKNOWN"
            if self.head_pose_buffer:
                head_pose_mode = max(set(self.head_pose_buffer), key=self.head_pose_buffer.count)
                
            # Launch background thread to prevent lag
            threading.Thread(
                target=self._async_decide,
                args=(speech_score, gesture_score, person_score, head_pose_mode),
                daemon=True
            ).start()
            
        # 3. Always return the latest computed state instantly
        with self.lock:
            return self.current_score, self.current_status, self.current_color
