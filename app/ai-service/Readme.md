# EduWatch AI Service

The AI Service processes classroom video/audio signals and produces teaching-activity insights and teacher-recognition results. It then sends attendance decisions to the backend API.

## Features

- Person and teacher detection
- Teacher identity recognition (ArcFace/face-recognition workflows)
- Gesture and head-pose aware activity scoring
- Voice-activity integration for teaching score
- Periodic attendance push to backend (`/mark-attendance`)

## Folder Structure

```text
ai-service/
├── app/
│   ├── main.py                   # Runtime entry point
│   ├── api/                      # AI API layer (if used)
│   ├── client/                   # Backend API client
│   ├── core/                     # Core app logic/config
│   ├── models/                   # Data models
│   ├── services/                 # Detection/recognition services
│   ├── utils/                    # Utility modules
│   └── yolov8n.pt                # Local model weights
├── person recognition/           # Teacher embedding/encoding scripts
├── test/                         # Test and prototyping files
├── weights/                      # Model files
├── requirements.txt
└── Readme.md
```

## Prerequisites

- Python 3.10+ recommended
- Camera device or test video source
- Backend API running on `http://127.0.0.1:8000` or update API URL in client

## Installation

From repository root:

```bash
cd app/ai-service
python -m venv .venv
```

Windows PowerShell:

```bash
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Configuration

- Video source is configured in `app/utils/config.py` via `CAMERA_INDEX`.
- Backend endpoint is configured in `app/client/backend_client.py` via `API_URL`.

Default behavior:

- Uses test video from `data/test/video/teaching.mp4`.
- Sends attendance every 5 seconds.

## Run Commands

From repository root:

```bash
cd app/ai-service/app
python main.py
```

## Run The backend ai service (fast API)

```bash
cd app/ai-service/app
uvicorn api.app:app --reload
```

Stop execution: press `q` in the OpenCV window.

## Utility Commands

Teacher encoding scripts:

```bash
cd app/ai-service/person recognition
python encode_teachers.py
python encode_teachers_id_based.py
python encode_teachers_ArcFace.py
```

Quick test:

```bash
cd app/ai-service/person recognition
python test.py
```

## Integration Notes

- Ensure backend API endpoint and port are correct before running AI service.
- If your backend runs on a different host/port, update `API_URL` in `app/client/backend_client.py`.
- For webcam input, set `CAMERA_INDEX = 0` in `app/utils/config.py`.

## Troubleshooting

- If camera/video fails: verify path/device index and permissions.
- If backend call fails: confirm backend is running and endpoint is reachable.
- If model errors occur: verify weight files and Python dependencies are installed.