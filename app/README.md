# 📘 EduWatch Backend – Smart AI Classroom System

## 🔹 Overview

The EduWatch Backend is a production-ready PostgreSQL-based attendance and timetable management system designed to integrate with the AI-powered Teacher Detection Module.

This backend handles:

- Teacher schedule validation
- Real-time period detection
- Substitution handling
- Attendance logging
- Wrong teacher detection
- REST API endpoints for dashboard integration

It ensures that attendance is marked **only after teacher identity verification and confirmation period validation**.

---

# 🏗 Architecture Overview
# 📘 EduWatch Backend – Smart AI Classroom System

## 🔹 Overview

The EduWatch Backend is a production-ready PostgreSQL-based attendance and timetable management system designed to integrate with the AI-powered Teacher Detection Module.

This backend handles:

- Teacher schedule validation
- Real-time period detection
- Substitution handling
- Attendance logging
- Wrong teacher detection
- REST API endpoints for dashboard integration

It ensures that attendance is marked **only after teacher identity verification and confirmation period validation**.

---

# 🏗 Architecture Overview
AI Module (Face Recognition)
↓
Attendance Engine
↓
PostgreSQL Database
↓
REST API (FastAPI)
↓
Admin Dashboard (Future)


---

# 📂 Backend Folder Structure

```
backend/
│
├── database/
│ ├── migrations/
│ ├── seeds/
│ ├── functions/
│ ├── views/
│ └── schema.sql
│
├── core/
│ ├── db_connection.py
│ ├── period_service.py
│ ├── decision_engine.py
│ ├── lock_manager.py
│ └── attendance_engine.py
│
├── api/
│ ├── app.py
│ └── routes.py
│
└── requirements.txt
```

---

# 🗄 Database Design

## The backend uses PostgreSQL with the following core tables:

tables:
- teachers
- subjects
- classes
- timetable
- teacher_substitution
- attendance_log

Views:
- view_today_schedule
- view_live_current_period
- view_attendance_summary
- view_wrong_teacher_logs
- view_monthly_teacher_report

Functions:
- get_current_period()
- check_substitution()
- mark_attendance()

---

# 🛠 Installation Guide

## 1️⃣ Install PostgreSQL

Download and install PostgreSQL:

https://www.postgresql.org/download/

Create database:

```bash
psql -U postgres
CREATE DATABASE eduwatch;
\q
```

# 📦 Backend Requirements
```bash 
psycopg2-binary==2.9.9
fastapi==0.111.0
uvicorn==0.30.1
python-dotenv==1.0.1
```

# 🗄 Database Initialization

## Navigate to:

```bash
backend/database/
```

## Run schema:

```bash
psql -U postgres -d eduwatch -f schema.sql
```

## This will:

- Create tables
- Insert seed data
- Create functions
- Create views

# 🚀 Running the Backend API

## Navigate to:

```bash 
backend/
```

## Run:

```bah
uvicorn api.app:app --reload
```

## Open in browser:

```bash
http://127.0.0.1:8000/docs
```

##  Swagger API documentation will be available.