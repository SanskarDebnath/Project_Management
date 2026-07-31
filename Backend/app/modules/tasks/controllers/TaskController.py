from fastapi import APIRouter, status

router = APIRouter(prefix="/v1/tasks", tags=["Tasks"])

@router.get("/my-tasks", status_code=status.HTTP_200_OK)
@router.get("/list", status_code=status.HTTP_200_OK)
def get_my_tasks():
    return [
        {
            "id": "TSK-101",
            "title": "Implement AES-256 API Payload Encryption Layer",
            "description": "Secure native fetch requests with client-side AES-256 encryption & dynamic captcha.",
            "projectId": 1,
            "projectName": "State E-Governance Highway Expansion",
            "priority": "HIGH",
            "status": "COMPLETED",
            "dueDate": "2026-08-05",
            "estimatedHours": 16,
            "loggedHours": 16,
        },
        {
            "id": "TSK-102",
            "title": "Build Dual-Application Monorepo Structure",
            "description": "Set up Vite monorepo with employee and management applications.",
            "projectId": 1,
            "projectName": "State E-Governance Highway Expansion",
            "priority": "URGENT",
            "status": "IN_PROGRESS",
            "dueDate": "2026-08-01",
            "estimatedHours": 24,
            "loggedHours": 18,
        },
        {
            "id": "TSK-103",
            "title": "Optimize Database Query Indexes for Work Orders",
            "description": "Add composite indexes on work_order_id and project_id in PostgreSQL.",
            "projectId": 2,
            "projectName": "Smart City Water Distribution Infrastructure",
            "priority": "MEDIUM",
            "status": "TODO",
            "dueDate": "2026-08-10",
            "estimatedHours": 12,
            "loggedHours": 0,
        },
    ]
