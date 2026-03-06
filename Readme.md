# EduWatch

AI-powered smart classroom system with teacher recognition, timetable-aware attendance validation, backend APIs, and web/mobile clients.

## Overview

EduWatch combines computer vision, voice/activity signals, and academic scheduling logic to make classroom monitoring and attendance more reliable.

Current platform includes:

- AI service for teacher detection and activity scoring
- Backend API for auth, timetable, classes, substitution, and logs
- Next.js web dashboard/client
- Flutter app module
- PostgreSQL schema with SQL functions/views

## Repository Structure

```text
EduWatch-Smart-AI-Classroom-System/
├── app/
│   ├── ai-service/      # Python AI runtime + teacher recognition scripts
│   ├── api/             # NestJS backend + Prisma
│   ├── web/             # Next.js frontend
│   ├── app/             # Flutter client
│   ├── database/        # SQL schema, migrations, seeds, functions, views
│   └── README.md        # Module-level orchestration guide
├── data/                # Test media inputs
├── docs/                # Project documents
├── experiments/         # AI and prototype experiments
├── requirements.txt
└── Readme.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.10+
- PostgreSQL 14+
- Flutter SDK (for mobile/desktop module)

## Quick Start (End-to-End)

From repository root in separate terminals.

### 1. Database Setup

```bash
cd app/database
psql -U postgres
CREATE DATABASE eduwatch;
\q
psql -U postgres -d eduwatch -f schema.sql
```

### 2. Start API (Terminal 1)

```bash
cd app/api
copy .env.example .env
npm install
npm run db:full-setup
npm run start:dev
```

Default API URL: `http://localhost:5000`

### 3. Start Web (Terminal 2)

```bash
cd app/web
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

Default Web URL: `http://localhost:3000`

### 4. Start AI Service (Terminal 3)

```bash
cd app/ai-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
cd app
python main.py
```

Important: update `app/ai-service/app/client/backend_client.py` `API_URL` to match your backend endpoint.

### 5. Start Flutter App (Optional, Terminal 4)

```bash
cd app/app
flutter pub get
flutter run
```

## Conda Setup (Optional for AI Workloads)

```bash
conda create --name eduwatch python=3.10
conda activate eduwatch
pip install -r app/ai-service/requirements.txt
```

Enable conda in PowerShell:

```bash
conda init powershell
```

## Testing and Quality Commands

API module:

```bash
cd app/api
npm run test
npm run test:e2e
npm run test:cov
npm run lint
```

Web module:

```bash
cd app/web
npm run lint
npm run build
```

Flutter module:

```bash
cd app/app
flutter analyze
flutter test
```

## Module Documentation

- `app/README.md`
- `app/ai-service/Readme.md`
- `app/api/README.md`
- `app/web/README.md`
- `app/app/README.md`
- `app/database/README.md`