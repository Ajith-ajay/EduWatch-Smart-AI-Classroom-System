import sounddevice as sd
import numpy as np
import webrtcvad
import collections
import threading

SAMPLE_RATE = 16000
FRAME_DURATION = 30  # ms
VAD_MODE = 3

class VoiceDetector:

    def __init__(self):

        self.vad = webrtcvad.Vad(VAD_MODE)
        self.frame_size = int(SAMPLE_RATE * FRAME_DURATION / 1000)

        self.audio_buffer = collections.deque(maxlen=100)
        self.speech_buffer = collections.deque(maxlen=50)

        self.lock = threading.Lock()
        self.running = True

        self.stream = sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=1,
            dtype='int16',
            callback=self.audio_callback,
            blocksize=self.frame_size
        )

        self.stream.start()

    def audio_callback(self, indata, frames, time, status):

        if status:
            return

        frame = indata.flatten()

        if len(frame) != self.frame_size:
            return

        is_speech = self.vad.is_speech(frame.tobytes(), SAMPLE_RATE)

        with self.lock:
            self.speech_buffer.append(1 if is_speech else 0)

    def detect_voice(self):

        with self.lock:
            if len(self.speech_buffer) == 0:
                return False

            speech_ratio = sum(self.speech_buffer) / len(self.speech_buffer)

        # speaking continuously if > 40% recent frames are speech
        return speech_ratio > 0.4

    def stop(self):
        self.running = False
        self.stream.stop()
        self.stream.close()