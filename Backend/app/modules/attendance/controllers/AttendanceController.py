from fastapi import APIRouter, status

router = APIRouter(prefix="/v1/attendance", tags=["Attendance"])

@router.get("/my-logs", status_code=status.HTTP_200_OK)
@router.get("/list", status_code=status.HTTP_200_OK)
def get_attendance_logs():
    return [
        {"id": "ATT-001", "date": "2026-07-31", "checkInTime": "09:00 AM", "status": "PRESENT", "notes": "Logged in from Office Head Office"},
        {"id": "ATT-002", "date": "2026-07-30", "checkInTime": "09:12 AM", "checkOutTime": "06:30 PM", "status": "PRESENT"},
        {"id": "ATT-003", "date": "2026-07-29", "checkInTime": "08:55 AM", "checkOutTime": "06:05 PM", "status": "WORK_FROM_HOME"},
        {"id": "ATT-004", "date": "2026-07-28", "checkInTime": "09:05 AM", "checkOutTime": "06:00 PM", "status": "PRESENT"},
    ]

@router.post("/check-in", status_code=status.HTTP_200_OK)
def check_in():
    return {"message": "Check-in recorded successfully", "status": "PRESENT"}

@router.post("/check-out", status_code=status.HTTP_200_OK)
def check_out():
    return {"message": "Check-out recorded successfully"}
