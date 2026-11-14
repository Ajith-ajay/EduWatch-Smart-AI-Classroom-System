import os
from collections import deque
import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier
    import joblib
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    import logging
    logging.warning("scikit-learn is not installed. Please run: pip install scikit-learn joblib")

class MLClassifierEngine:
    """
    A Local Machine Learning Engine that replaces manual heuristics with a trained Random Forest model.
    It executes instantly without API calls, making it ideal for 30+ FPS processing.
    """
    def __init__(self, model_path="teaching_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.is_trained = False
        
        if SKLEARN_AVAILABLE:
            if os.path.exists(self.model_path):
                try:
                    self.model = joblib.load(self.model_path)
                    self.is_trained = True
                except Exception as e:
                    print(f"Could not load ML model: {e}")
            
            if not self.is_trained:
                # Initialize an untrained model if none exists
                # Classes: 0 = Inactive, 1 = Likely Teaching, 2 = Teaching Active
                self.model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
                
        # Smoothing buffers
        self.speech_buffer = deque(maxlen=15)
        self.gesture_buffer = deque(maxlen=15)
        self.person_buffer = deque(maxlen=15)

        # Map text states to numeric values for ML input
        self.head_state_map = {
            "LOOKING_AT_CLASS": 1.0,
            "LOOKING_SIDE": 0.8,
            "LOOKING_DOWN": 0.3,
            "UNKNOWN": 0.5
        }
        self.head_pose_buffer = deque(maxlen=15)

    def _extract_features(self):
        """Averages the last N frames to create stable features for the model"""
        gesture_score = sum(self.gesture_buffer) / max(1, len(self.gesture_buffer))
        speech_score = sum(self.speech_buffer) / max(1, len(self.speech_buffer))
        person_score = sum(self.person_buffer) / max(1, len(self.person_buffer))
        head_score = sum(self.head_pose_buffer) / max(1, len(self.head_pose_buffer))
        
        # Returns a 2D array as expected by scikit-learn
        return np.array([[gesture_score, speech_score, person_score, head_score]])

    def update(self, teacher, gesture, speech, person, facing_forward, head_state):
        # 1. Update buffers
        self.gesture_buffer.append(int(gesture))
        self.speech_buffer.append(int(speech))
        self.person_buffer.append(int(person))
        
        h_score = self.head_state_map.get(head_state, 0.5)
        self.head_pose_buffer.append(h_score)
        
        # 2. Check if we have a trained model
        if not SKLEARN_AVAILABLE or not self.is_trained:
            # Simple fallback formula if you haven't trained it yet
            teaching_score = (speech + gesture) * 0.5 * person
            return teaching_score, "WAITING_FOR_MODEL_TRAINING", (128, 128, 128)

        # 3. Predict instantly
        features = self._extract_features()
        
        try:
            # Predict class label (0, 1, or 2)
            prediction = self.model.predict(features)[0]
            # Predict probabilities for each class
            probabilities = self.model.predict_proba(features)[0]
            
            # Use the probability of the "Teaching Active" class as the confidence score
            teaching_score = probabilities[-1] 
            
            if prediction == 2:
                status = "TEACHING ACTIVE"
                color = (0, 255, 0)
            elif prediction == 1:
                status = "LIKELY TEACHING"
                color = (0, 255, 255)
            else:
                status = "INACTIVE"
                color = (0, 0, 255)
                
            return float(teaching_score), status, color
            
        except Exception as e:
            return 0.0, f"ML_ERROR: {e}", (0,0,255)

    def train_model(self, X_train, y_train):
        """
        Utility function to train the model with your recorded dataset.
        Call this in a separate script once you have collected data.
        
        X_train: List of feature arrays [gesture_score, speech_score, person_score, head_score]
        y_train: List of labels (0=Inactive, 1=Likely, 2=Active)
        """
        if SKLEARN_AVAILABLE:
            self.model.fit(X_train, y_train)
            self.is_trained = True
            joblib.dump(self.model, self.model_path)
            print(f"Model successfully trained and saved to {self.model_path}")
