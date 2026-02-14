# EduWatch 🎓  
### AI-Powered Smart Classroom Monitoring & Multilingual Content Intelligence

EduWatch is an AI-driven smart education system designed to enhance classroom monitoring, content accessibility, and learning analytics. The project integrates artificial intelligence techniques such as speech recognition, computer vision, and voice processing to support intelligent classroom environments. In its initial phase, EduWatch focuses on AI-based video/audio processing for educational content, with future extensions for live classroom monitoring and analytics.

---

## 📌 Project Motivation
With the rapid digital transformation in education, there is a growing need for intelligent systems that can monitor, analyze, and enhance classroom experiences. EduWatch aims to bridge this gap by combining AI technologies to make education smarter, more inclusive, and globally accessible while preserving cultural and linguistic identity.

---

## 🎯 Objectives
- Build an AI-based system for smart classroom and educational content analysis  
- Enable automated processing of recorded educational videos  
- Support multilingual audio processing and intelligent voice handling  
- Lay the foundation for live classroom monitoring in future phases  
- Provide a scalable and modular architecture suitable for real-world deployment  

---

## 🧠 Core Features (Planned & Implemented)

### Phase 1 – Initial Development (Current Phase)
- Repository setup with version control
- Project architecture design
- Audio extraction from video lectures
- Speech-to-text using AI models
- Basic AI pipeline for content processing

### Phase 2 – Advanced AI Processing
- Multilingual translation
- Voice synthesis / voice cloning
- Improved audio quality and synchronization
- Emotion-aware speech generation

### Phase 3 – Smart Classroom Expansion
- Face recognition for attendance
- Behavior and engagement analysis
- Real-time classroom monitoring
- Admin dashboard for analytics

---

## 🏗️ Project Architecture (High-Level)

```bash
EduWatch
│
├── frontend/ # Web interface (React / Vue)
├── backend/ # API services (FastAPI / Flask)
├── ai/ # AI modules (Whisper, TTS, CV)
│ ├── audio/
│ ├── video/
│ └── models/
├── docs/ # Documentation & reports
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

### Programming Languages
- Python
- JavaScript

### AI / ML Technologies
- Speech Recognition (ASR)
- Natural Language Processing (NLP)
- Text-to-Speech (TTS)
- Computer Vision (planned)

### Frameworks & Tools
- Python (FastAPI / Flask)
- VS Code
- Git & Github
- FFmpeg (Media processing)

---

## 👥 Team Details
- **Project Name:** EduWatch  
- **Project Type:** College Mini Project  
- **Team Size:** 3 Members  
- **Team lead:** Aashik Basha A
- **Team co-Lead:** Akash A
- **Team member:** Ajith G
- **Version Control:** Github (Private Repository)  

---

## 🔁 Development Workflow
- Private repository during development
- Feature-based branching strategy
- Each member works on a separate branch
- Pull requests used for merging into development branch
- Repository will be made public after project completion

---

## 🚀 How to Run (Phase 1 – Local Setup)

```bash
# Clone repository
git clone https://github.com/Ajith-ajay/EduWatch-Smart-AI-Classroom-System.git

# Navigate to project
cd EduWatch-Smart-AI-Classroom-System

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # Linux/Mac os: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python backend/app.py
```

## Best prefer the Conda Environmrnt for best for the ML Training

```bash
conda create --name eduwatch python=3.10

conda activate eduwatch

pip install -r requirements.txt
```

## To activate the conda and use it in anywhere (any terminal)

    - open anaconda prompt and run the command

```bash
conda init powershell      
```