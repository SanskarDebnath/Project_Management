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
# Note: Since the DB setup/schemas will be developed in later tasks,
# these imports/metadata bindings are commented out for now to ensure main.py runs.
# from app.core.database.database import Base, engine
# from app.modules.departments.models import DBDepartment
# from app.modules.sessions.models import DBSession
# from app.modules.users.models import DBUser
# Base.metadata.create_all(bind=engine)
from modules.departments.controllers.DepartmentController import router as departmentrouter
from modules.projects.controllers.ProjectController import router as projectrouter


app = FastAPI(
    title="PM-SYS/BE — Project & Budget Tracking System",
    description="Enterprise-grade project management and budget tracking backend",
    version="2.0.0",
    docs_url="/apis",
    redoc_url="/api/redoc",
    openapi_url="/api/v1/openapi.json",
)



0
app.include_router(departmentrouter)
app.include_router(projectrouter)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Auto-binding controllers / routers (equivalent to Spring Boot Component Scan)
def register_controllers(app: FastAPI):
    # Dynamic controller scanner will scan through all module directories
    # looking for router bindings. Currently placeholder structure is present.
    pass

register_controllers(app)

# # ──────────────────────────────────────────────
# # Health Check
# # ──────────────────────────────────────────────
# @app.get("/health", tags=["Health"])
# async def health_check():
#     """Basic health-check endpoint — confirms the API is alive."""
#     return {"status": "ok", "service": "pm-sys-backend", "version": "2.0.0"}

