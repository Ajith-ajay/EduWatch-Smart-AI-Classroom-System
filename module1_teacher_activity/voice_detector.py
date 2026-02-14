import sounddevice as sd
import numpy as np
from config import VOICE_THRESHOLD

def detect_voice():

    duration = 0.8
    fs = 48000

    audio = sd.rec(int(duration * fs),
                   samplerate=fs,
                   channels=1,
                   dtype='float32',
                   device=9)  # Adjust device index as needed

    sd.wait()

    volume = np.linalg.norm(audio)

    print("Volume:", volume)

    if volume > VOICE_THRESHOLD:
        print(f"Voice detected with volume: {volume:.2f}")
        return True
    else:
        return False
