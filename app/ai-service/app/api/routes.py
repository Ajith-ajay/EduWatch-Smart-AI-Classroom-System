from fastapi import APIRouter
from pydantic import BaseModel
from core.attendance_engine import process_attendance
from core.period_service import get_current_period
from core.db_connection import fetch_query

router = APIRouter()

@router.get("/current-period")
def current_period():
    return get_current_period()

@router.get("/attendance-summary")
def attendance_summary():
    return fetch_query("SELECT * FROM view_attendance_summary;")

@router.get("/wrong-teacher-logs")
def wrong_teacher():
    return fetch_query("SELECT * FROM view_wrong_teacher_logs;")

class AttendanceRequest(BaseModel):
    detected_teacher_id: int | None
    confidence_score: float

@router.post("/mark-attendance")
def mark_attendance(request: AttendanceRequest):

    process_attendance(
        detected_teacher_id=request.detected_teacher_id,
        confidence_score=request.confidence_score
    )

    return {"status": "processed"}