# Folder Structure of the Project

## Core Structure

```bash
ai-teacher-monitoring/
│
├── apps/
│   ├── web-admin/        → Next.js (Admin dashboard)
│   ├── mobile-app/       → Flutter app
│   ├── api/              → NestJS (Main SaaS backend)
│   └── ai-service/       → FastAPI (AI engine)
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── terraform/ (optional later)
│
├── docs/
├── docker-compose.yml
└── README.md
```

```bash
ai-teacher-monitoring/
│
├── apps/
│   ├── frontend/            → Next.js app
│   ├── api/                 → NestJS SaaS backend
│   └── ai-service/          → FastAPI + OpenCV + YOLO
│
├── packages/                → Shared logic (optional later)
│
├── infrastructure/          → Docker, deployment configs
│
├── docs/
│
├── .env.example
├── docker-compose.yml
└── README.md
```
## nestjs Api Structure

```bash
apps/api/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── schools/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── timetable/
│   │   ├── attendance/
│   │   ├── analytics/
│   │   └── ai-integration/  ← talks to FastAPI
│
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── interceptors/
│
│   ├── database/
│   │   ├── prisma/ or typeorm/
│   │   └── migrations/
│
│   └── utils/
│
├── test/
├── package.json
└── tsconfig.json
```

## AI Services 

```bash
apps/ai-service/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   └── routes.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── logging.py
│   │
│   ├── models/
│   │   ├── yolo_model.py
│   │   └── inference.py
│   │
│   ├── services/
│   │   ├── detection_service.py
│   │   ├── attendance_service.py
│   │   └── validation_service.py
│   │
│   ├── schemas/
│   │   ├── request.py
│   │   └── response.py
│   │
│   └── utils/
│
├── weights/
│   └── yolov8n.pt
│
├── tests/
├── requirements.txt
└── Dockerfile
```