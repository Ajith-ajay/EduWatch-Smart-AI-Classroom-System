# Understanding the AI Teaching Engines

Welcome! This guide will explain how the two new AI logic files (`llm_agent_engine.py` and `ml_classifier_engine.py`) work. 

In a smart classroom system, the camera is constantly watching the teacher (many times per second). We have small AI models detecting *parts* of what is happening (e.g., "Is a hand raised?", "Is there a voice?", "Where is the head pointing?"). 

However, we need a **"Brain"** (an Engine) that looks at all these small clues and makes the final decision: **"Is the teacher actively teaching right now?"**

Here is a beginner-friendly breakdown of the two new "Brains" you can use to replace the old manual logic.

---

## 1. The Buffered LLM Agent (`llm_agent_engine.py`)

**What it is:**  
This engine uses a Large Language Model (LLM) like Google Gemini. It literally "reads" a text summary of what is happening in the classroom and replies with a decision, just like asking ChatGPT a question.

### How it works (The Flow):
1. **Collecting Data (The Buffer):** The camera runs very fast (e.g., 30 frames per second). Asking an LLM for every single frame would be too slow and very expensive. So, this engine uses a "Buffer" (a temporary memory) to collect data for 5 seconds.
2. **Summarizing:** After 5 seconds, it averages out the data. It figures out: *"In the last 5 seconds, there was speech 80% of the time, gestures 20% of the time, and the head was mostly looking sideways."*
3. **The Background Thread:** Because the internet is slow, waiting for the LLM to reply would "freeze" your video video stream. To prevent this, the engine sends the question to the LLM in the **background** (using something called a `Thread`).
4. **The Decision:** The LLM reads the summary prompt, thinks about it, and replies back with `TEACHING ACTIVE`, `LIKELY TEACHING`, or `INACTIVE`.
5. **Updating the Screen:** The engine remembers this decision and shows it on your video screen for the next 5 seconds, while it secretly collects a new batch of data to ask the LLM again.

### How to use it:
1. Open your terminal and run: `pip install google-generativeai`
2. Open your `main.py` file.
3. At the top, add: `from services.llm_agent_engine import LLMAgentEngine`
4. Find where `TeachingActivityEngine()` is created and replace it with:
   `teaching_activity_engine = LLMAgentEngine(api_key="YOUR_GEMINI_API_KEY_HERE", check_interval=5.0)`

---

## 2. The Local ML Classifier (`ml_classifier_engine.py`)

**What it is:**  
This engine uses a classic Machine Learning algorithm (called a Random Forest). Instead of talking to the internet, it relies on a small math-based model saved directly on your computer. 

### How it works (The Flow):
1. **The Math Brain:** Unlike the LLM which reads English, this engine only understands numbers. It takes all the current clues (speech, gesture, person) and converts them into a list of numbers.
2. **Instant Prediction:** Because the math model is tiny and saved locally on your computer, it doesn't need to use the internet. It can look at the numbers and shout out the answer (`TEACHING ACTIVE` or `INACTIVE`) **instantly** for every single frame.
3. **Smoothing the Video:** To make sure the text on the screen doesn't flicker wildly, it still averages the last few frames together before making its prediction.
4. **Needs Training:** Because this model learns by example, it starts off "empty". You have to train it first by giving it examples of what "Teaching" looks like vs what "Not Teaching" looks like. Once trained, it saves its brain to a file called `teaching_model.pkl`.

### How to use it:
1. Open your terminal and run: `pip install scikit-learn joblib`
2. Open your `main.py` file.
3. At the top, add: `from services.ml_classifier_engine import MLClassifierEngine`
4. Find where `TeachingActivityEngine()` is created and replace it with:
   `teaching_activity_engine = MLClassifierEngine(model_path="teaching_model.pkl")`

> **Important Note:** You will need to train this model first! Until it is trained and the `teaching_model.pkl` file is created, it will use a simple fallback math formula to guess the status.

---

### Which one should I choose?

* **Choose the LLM Agent** if you want a really smart, human-like logic system and don't mind a 5-second delay in status updates. (Great for testing and prototyping!)
* **Choose the Local ML Classifier** if you want the system to be blazing fast, work completely offline, and you are willing to spend some time training it with data. (Great for a final, production-ready project!)
