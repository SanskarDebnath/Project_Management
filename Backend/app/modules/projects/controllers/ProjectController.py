from fastapi import (APIRouter, Depends, status)
from sqlalchemy.orm import Session
from core.database.database import get_db
from modules.projects.schemas.ProjectSchema import ProjectReponseDTO
from modules.projects.services.ProjectService import(
    OfficerCreateDTO,
    ProjectCreateDTO,
    ProjectLookupDTO,
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

    
@router.post("/view-project-details", summary="View Project Details", description=("Retreive the complete project information"), response_model=ProjectReponseDTO, status_code=status.HTTP_200_OK)
def view_project_details(lookup_data: ProjectLookupDTO, db: Session = Depends(get_db)):
    project = ProjectService.get_project_details(db, lookup_data)
    return project

@router.get("/list", summary="List All Projects", status_code=status.HTTP_200_OK)
@router.get("/all", summary="List All Projects", status_code=status.HTTP_200_OK)
def list_projects(db: Session = Depends(get_db)):
    projects = ProjectService.get_all_projects(db)
    officers = ProjectService.get_all_officers(db)
    departments = db.query(DBDepartment).all() if db else []

    officer_map = {o.officer_id: o.officer_name for o in officers}
    dept_map = {d.department_id: d.department_name for d in departments}

    return [
        {
            "project_id": p.project_id,
            "project_uuid": str(p.project_uuid),
            "project_name": p.project_name,
            "project_budget": float(p.project_budget) if p.project_budget else 0.0,
            "project_status": p.project_status,
            "department_id": p.department_id,
            "department_name": dept_map.get(p.department_id, f"Department #{p.department_id}"),
            "officer_id": p.officer_id,
            "officer_name": officer_map.get(p.officer_id, f"Officer {p.officer_id}"),
            "project_start_date": str(p.project_start_date) if p.project_start_date else None,
            "project_expected_end_date": str(p.project_expected_end_date) if p.project_expected_end_date else None,
            "project_description": p.project_description,
        }
        for p in projects
    ]


@router.get("/officers", summary="List All Officers", status_code=status.HTTP_200_OK)
def list_officers(db: Session = Depends(get_db)):
    officers = ProjectService.get_all_officers(db)
    return [
        {
            "officer_id": o.officer_id,
            "officer_name": o.officer_name,
            "department_id": o.department_id,
            "officer_designation": o.officer_designation,
            "officer_email": o.officer_email,
            "officer_status": o.officer_status,
        }
        for o in officers
    ]