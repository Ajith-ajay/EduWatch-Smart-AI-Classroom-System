# This script extracts audio from a video file, converts it to a uniform format (mono, 16kHz),
# and applies voice activity detection (VAD) and feature extraction (MFCC, energy, zero crossing rate).
# It uses the moviepy library for audio extraction and librosa for feature extraction.

from moviepy import VideoFileClip
import os
import sys
import torchaudio
from scipy.signal import find_peaks

def extract_audio(video_path, output_audio_path):
    """
    Extracts audio from a video file and saves it as an audio file.
    
    :param video_path: Path to the input video file.
    :param output_audio_path: Path to save the extracted audio file.
    """
    try:
        # Validate input file
        if not os.path.isfile(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        # Load video
        print(f"Loading video: {video_path}")
        video_clip = VideoFileClip(video_path)

        # Check if video has audio
        if video_clip.audio is None:
            raise ValueError("The video file has no audio track.")

        # Extract and save audio
        print(f"Extracting audio to: {output_audio_path}")
        video_clip.audio.write_audiofile(output_audio_path)

        print("Audio extraction completed successfully.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close resources
        try:
            video_clip.close()
        except:
            pass

def load_audio(file_path):
    """
    Loads an audio file.
    
    :param file_path: Path to the audio file.
    :return: Tensor containing the audio data, and the sample rate of the audio file.
    """
    try:
        # Validate audio file
        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")

        # Load audio file
        print(f"Loading audio file: {file_path}")
        audio_tensor, sample_rate = torchaudio.load(file_path)

        print("Audio file loaded successfully.")
        return audio_tensor, sample_rate

    except Exception as e:
        print(f"Error: {e}")
        return None, None

def extract_features(audio_tensor, sample_rate):
    """
    Extracts features from audio data.
    
    :param audio_tensor: Tensor containing the audio data.
    :param sample_rate: Sample rate of the audio data.
    :return: Extracted features.
    """
    try:
        # Convert stereo to mono by averaging the two channels
        if audio_tensor.size(0) == 2:
            audio_tensor = audio_tensor.mean(dim=0, keepdim=True)

        # Apply Short Time Fourier Transform (STFT)
        _, _, Zxx = torchaudio.transforms.stft(audio_tensor, n_fft=1024, hop_length=512, win_length=1024)

        # Convert to decibels
        db_transform = torchaudio.transforms.AmplitudeToDB()
        features = db_transform(Zxx)

        print("Features extracted successfully.")
        return features

    except Exception as e:
        print(f"Error: {e}")
        return None

def apply_vad(audio_tensor, sample_rate, threshold=0.6):
    """
    Applies Voice Activity Detection (VAD) to the audio data.
    
    :param audio_tensor: Tensor containing the audio data.
    :param sample_rate: Sample rate of the audio data.
    :param threshold: Energy threshold for VAD.
    :return: Tensor containing the VAD-applied audio data.
    """
    try:
        # Convert audio to mono if stereo
        if audio_tensor.size(0) == 2:
            audio_tensor = audio_tensor.mean(dim=0)

        # Compute short-time energy
        frame_size = int(sample_rate * 0.02)  # 20 ms frame size
        hop_size = int(sample_rate * 0.01)    # 10 ms hop size
        energy = torchaudio.compliance.kaldi.energy(audio_tensor, frame_size=frame_size, hop_size=hop_size)

        # Find peaks in energy envelope
        peaks, _ = find_peaks(energy.numpy(), height=threshold)

        # Create a mask for the audio frames
        mask = torch.zeros(energy.size(0), dtype=torch.bool)
        mask[peaks] = True

        # Apply the mask to the audio tensor
        vad_audio = audio_tensor[mask]

        print("VAD applied successfully.")
        return vad_audio

    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    # Example usage
    if len(sys.argv) != 3:
        print("Usage: python extract_audio.py <input_video> <output_audio>")
        print("Example: python extract_audio.py sample.mp4 output.mp3")
        sys.exit(1)

    input_video = sys.argv[1]
    output_audio = sys.argv[2]

    extract_audio(input_video, output_audio)

# python audio.py test1.mp4 output_audio.mp3
# python audio.py ../../data/test/video/test1.mp4 ../../data/test/audio/output_audio.mp3