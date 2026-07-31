"""
PM-SYS/BE — Project & Budget Tracking System
=============================================
FastAPI Application Entrypoint

Tech Stack:
    - FastAPI (ASGI framework)
    - PostgreSQL + SQLAlchemy 2.0 (async ORM)
    - Alembic (schema migrations)
    - Redis + Celery (background tasks)
    - Docker (containerization)

Architecture:
    Each module holds: config, controllers, models, repositories, schemas, services
    (one direction of dependency — nothing skips a layer, nothing calls upward)

Doc Reference: PM-SYS/BE · REV 2.0 · DRAWN BY S. DEBNATH · JUL 2026
"""

import importlib
import pkgutil
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
# Note: Base and metadata bindings enabled below for DB startup initialization
from core.database.database import Base, engine, SessionLocal
from modules.departments.models.DepartmentTables import DBDepartment
from modules.projects.models.ProjectTable import OfficerTable, ProjectTable, ProjectMemberTable, ProjectStatus
from modules.work_orders.models.WorkOrderTable import WorkOrderTable, WorkOrderStatus

from modules.departments.controllers.DepartmentController import router as departmentrouter
from modules.projects.controllers.ProjectController import router as projectrouter
from modules.work_orders.controllers.WorkOrderController import router as worouter
from modules.tasks.controllers.TaskController import router as taskrouter
from modules.attendance.controllers.AttendanceController import router as attendancerouter


app = FastAPI(
    title="PM-SYS/BE — Project & Budget Tracking System",
    description="Enterprise-grade project management and budget tracking backend",
    version="2.0.0",
    docs_url="/apis",
    redoc_url="/api/redoc",
    openapi_url="/api/v1/openapi.json",
)

app.include_router(departmentrouter)
app.include_router(projectrouter)
app.include_router(worouter)
app.include_router(taskrouter)
app.include_router(attendancerouter)


# CORS configuration - Allow all origins for seamless multi-app development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def startup_db_seed():
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            # Seed departments if empty
            if db.query(DBDepartment).count() == 0:
                dept1 = DBDepartment(department_id=1, department_name="Department of Public Works & Infrastructure", department_budget=15000000.00)
                dept2 = DBDepartment(department_id=2, department_name="Department of Transportation & Transit", department_budget=8500000.00)
                dept3 = DBDepartment(department_id=3, department_name="Department of Digital Governance & IT", department_budget=12000000.00)
                db.add_all([dept1, dept2, dept3])
                db.commit()

            # Seed officers if empty
            if db.query(OfficerTable).count() == 0:
                off1 = OfficerTable(officer_id="OFF-101", department_id=1, officer_name="Rajesh Kumar", officer_designation="Chief Executive Officer", officer_email="rajesh.kumar@gov.in", officer_status=True)
                off2 = OfficerTable(officer_id="OFF-102", department_id=2, officer_name="Anita Sharma", officer_designation="Director of Infrastructure", officer_email="anita.sharma@gov.in", officer_status=True)
                off3 = OfficerTable(officer_id="OFF-103", department_id=3, officer_name="Vikram Singh", officer_designation="Head of Technology", officer_email="vikram.singh@gov.in", officer_status=True)
                db.add_all([off1, off2, off3])
                db.commit()

            # Seed projects if empty
            if db.query(ProjectTable).count() == 0:
                proj1 = ProjectTable(
                    project_id=101,
                    project_name="Smart City Traffic Surveillance Network",
                    project_budget=4500000.00,
                    project_status=ProjectStatus.IN_PROGRESS,
                    department_id=2,
                    officer_id="OFF-102",
                    project_description="Deployment of AI traffic management & automated toll collection system."
                )
                proj2 = ProjectTable(
                    project_id=102,
                    project_name="Enterprise Cloud Migration & Data Center Revamp",
                    project_budget=3200000.00,
                    project_status=ProjectStatus.IN_PROGRESS,
                    department_id=3,
                    officer_id="OFF-103",
                    project_description="Migrating state infrastructure to hybrid cloud environment."
                )
                proj3 = ProjectTable(
                    project_id=103,
                    project_name="Metropolitan Bridge Infrastructure Overhaul",
                    project_budget=6800000.00,
                    project_status=ProjectStatus.PLANNED,
                    department_id=1,
                    officer_id="OFF-101",
                    project_description="Structural reinforcement and sensor installation for city bridges."
                )
                db.add_all([proj1, proj2, proj3])
                db.commit()
        finally:
            db.close()
    except Exception as err:
        print(f"[Backend Startup Warning] DB auto-seed skipped: {err}")

# Auto-binding controllers / routers (equivalent to Spring Boot Component Scan)
def register_controllers(app: FastAPI):
    pass

register_controllers(app)

# ──────────────────────────────────────────────
# Health Check Endpoints
# ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
@app.get("/v1/health", tags=["Health"])
async def health_check():
    """Basic health-check endpoint — confirms the API is alive."""
    return {"status": "ok", "service": "pm-sys-backend", "version": "2.0.0"}


