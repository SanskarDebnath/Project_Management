from fastapi import (APIRouter, Depends, status)
from sqlalchemy.orm import Session
from core.database.database import get_db
from modules.projects.services.ProjectService import(
    OfficerCreateDTO,
    ProjectCreateDTO,
    ProjectMemberCreateDTO
)
from modules.projects.services.ProjectService import ProjectService

router = APIRouter(prefix="/v1/projects", tags=["Projects APIS"])


@router.post("/create-officer", summary="create officer", description=("create a new officer and connect the officer to an existing department."),status_code=status.HTTP_201_CREATED)
def create_officer(officer_data: OfficerCreateDTO, db:Session=Depends(get_db)):
    new_officer=ProjectService.create_officer(db, officer_data)
    return {"message" : "Officer created successfully",
            "data" : {
                "officer_name" : new_officer.officer_name,
                "officer_status" : new_officer.officer_status,
                "officer_created_at" : new_officer.officer_created_at
            }}

@router.post("/create-project", summary="Create Project", description=("Create a Project for an existing department and assign an active officer."), status_code=status.HTTP_201_CREATED)
def create_project(project_data: ProjectCreateDTO, db: Session = Depends(get_db)):
    new_project = ProjectService.create_project(db, project_data)
    return {
        "message" : "Project Created Successfully",
        "data" : {
            "project_name" : new_project.project_name,
            "department_id" : new_project.department_id,
            "officer_id" : new_project.officer_id,
            "project_start_date" : new_project.project_start_date
        }
    }

@router.post("/assign-project-member", summary="Assign new Project Members", description=("Assign one developer to an existing project"), status_code=status.HTTP_201_CREATED)
def assign_project_member(member_data: ProjectMemberCreateDTO, db: Session = Depends(get_db)):
    new_member = ProjectService.create_project_member(db, member_data)
    return {
        "message" : ("Developer Assigned to a project successfully"),
        "data" : {
            "projrct_id" : new_member.project_id,
            "assigned_by" : new_member.assigned_by_officer
        }
        }

    