from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from modules.projects.models.ProjectTable import (
    OfficerTable,
    ProjectMemberTable,
    ProjectTable,
)

from modules.projects.repositories.ProjectRepo import (
    ProjectRepo,
)

from modules.projects.schemas.ProjectSchema import (
    OfficerCreateDTO,
    ProjectCreateDTO,
    ProjectMemberCreateDTO,
)

class ProjectService:

    @staticmethod
    def create_officer(db:Session, officer_data: OfficerCreateDTO) -> OfficerTable:
        department = ProjectRepo.get_department_by_id(db, officer_data.department_id)

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="department does not exist"
            )
        existing_officer = ProjectRepo.get_officer_by_id(db, officer_data.officer_id)

        if existing_officer is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Officer ID allready exists"
            )
        
        if officer_data.officer_email is not None:
            existing_email = ProjectRepo.get_officer_by_email(db, str(officer_data.officer_email))

        if existing_email is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Officer Email allready exist"
            )
        
        try:
            return ProjectRepo.create_officer(
                db,
                officer_data
            )

        except IntegrityError as exception:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Officer could not be created because "
                    "a database constraint was violated"
                )
            ) from exception

        except SQLAlchemyError as exception:
            raise HTTPException(
                status_code=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail="Unable to create officer"
            ) from exception
        
    @staticmethod
    def create_project(db:Session, project_data: ProjectCreateDTO) -> ProjectTable:
        department = ProjectRepo.get_department_by_id(db, project_data.department_id)
        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department does not exist"
            )
        
        officer = ProjectRepo.get_officer_by_id(db, project_data.officer_id)
        if officer is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected Officer does not belong to the selected department"
            )
        
        existing_project = ProjectRepo.get_project_by_name(db, project_data.project_name)

        if existing_project is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=("A project with this name already exists"))
        
        try:
            return ProjectRepo.create_project(db,project_data)
        except IntegrityError as exception:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=("Project could not be created because a db constraint was violated")
            ) from exception
        except SQLAlchemyError as exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to create Project"
            ) from exception

    @staticmethod
    def create_project_member(db: Session, member_data: ProjectMemberCreateDTO) -> ProjectMemberTable:
        project = ProjectRepo.get_project_by_id(db, member_data.project_id)
        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project does not exist"
            )
        assigning_officer = ProjectRepo.get_officer_by_id(db, member_data.assigned_by_id)
        
        if assigning_officer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="An inactive officer cannot assign project members"
            )
        if (assigning_officer.department_id!=project.department_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The officer can't assign members to a project from another department"
            )
        existing_member = ProjectRepo.get_project_member(db, member_data.project_id, member_data.developer_id)
        if existing_member is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This developer is allready assigned to the project"
            )
        try:
            return ProjectRepo.create_project_member(db, member_data)
        except IntegrityError as exception:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Project Member could not be created because a DB constraints was violated"
            ) from exception
        except SQLAlchemyError as exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to assign project member"
            ) from exception