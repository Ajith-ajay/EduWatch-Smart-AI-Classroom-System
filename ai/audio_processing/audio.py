from moviepy import VideoFileClip
import os
import sys

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