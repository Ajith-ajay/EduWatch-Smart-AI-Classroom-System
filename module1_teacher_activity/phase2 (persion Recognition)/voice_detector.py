import sounddevice as sd
import numpy as np
import webrtcvad
import collections

# WebRTC works only at these sample rates
SAMPLE_RATE = 16000

# Frame duration must be 10, 20, or 30 ms
FRAME_DURATION = 30  # ms

# Aggressiveness mode:kf
# 0 = least aggressive
# 3 = most aggressive (recommended for classroom)
VAD_MODE = 3

# Continuous speech frames required to confirm teaching
SPEECH_FRAME_THRESHOLD = 8


class VoiceDetector:

    def __init__(self):

        self.vad = webrtcvad.Vad(VAD_MODE)

        self.frame_size = int(SAMPLE_RATE * FRAME_DURATION / 1000)

        self.speech_buffer = collections.deque(maxlen=20)


    def record_audio(self, duration=1.5):

        audio = sd.rec(int(duration * SAMPLE_RATE),
                       samplerate=SAMPLE_RATE,
                       channels=1,
                       dtype='int16')

        sd.wait()

        return audio.flatten()


    def detect_voice(self):

        audio = self.record_audio()

        speech_frames = 0
        total_frames = 0

        for i in range(0, len(audio), self.frame_size):

            frame = audio[i:i+self.frame_size]

            if len(frame) != self.frame_size:
                continue

            frame_bytes = frame.tobytes()

            is_speech = self.vad.is_speech(frame_bytes, SAMPLE_RATE)

            total_frames += 1

            if is_speech:
                speech_frames += 1

        speech_ratio = speech_frames / total_frames if total_frames > 0 else 0

        print(f"Speech frames: {speech_frames}/{total_frames}  Ratio: {speech_ratio:.2f}")

        # Confirm teaching speech only if continuous speech exists
        if speech_frames >= SPEECH_FRAME_THRESHOLD:

            print("Teaching speech detected")

            return True

        else:

            return False
