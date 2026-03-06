# EduWatch Modules Documentation

This `app/` directory contains all major runtime modules of EduWatch.

## Modules

- `ai-service`: Python-based teacher activity detection and recognition pipeline
- `api`: NestJS backend with Prisma + custom SQL integration
- `web`: Next.js dashboard/client frontend
- `app`: Flutter cross-platform client app
- `database`: SQL schema, migrations, seeds, functions, and views

## Recommended Startup Order

1. Start PostgreSQL.
2. Initialize database from `app/database`.
3. Start backend API (`app/api`) on `http://localhost:5000`.
4. Start web frontend (`app/web`) on `http://localhost:3000`.
5. Start AI service (`app/ai-service/app/main.py`) which posts attendance to backend.
6. Start Flutter app (`app/app`) if needed.

## Run All Modules (Multi-Terminal)

Use separate terminals from repo root (`EduWatch-Smart-AI-Classroom-System`):

```bash
# Terminal 1 - API
cd app/api
npm install
npm run db:full-setup
npm run start:dev
```

```bash
# Terminal 2 - Web
cd app/web
npm install
npm run dev
```

```bash
# Terminal 3 - AI Service
cd app/ai-service
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd app
python main.py
```

Important: AI service backend URL is configured in `app/ai-service/app/client/backend_client.py`. If your API runs on `http://localhost:5000`, update `API_URL` accordingly before starting AI service.

```bash
# Terminal 4 - Flutter App (optional)
cd app/app
flutter pub get
flutter run
```

## Module Documentation

- AI service docs: `app/ai-service/Readme.md`
- API docs: `app/api/README.md`
- Web docs: `app/web/README.md`
- Flutter docs: `app/app/README.md`
- Database docs: `app/database/README.md`