from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from modules.departments.models.DepartmentTables import DBDepartment

from modules.projects.models.ProjectTable import (
    OfficerTable,
    ProjectMemberTable,
    ProjectTable,
)

from modules.projects.schemas.ProjectSchema import (
    OfficerCreateDTO,
    ProjectCreateDTO,
    ProjectMemberCreateDTO,
)


class ProjectRepo:

    @staticmethod
    def create_officer(db: Session, officer_data: OfficerCreateDTO) -> OfficerTable:
        new_officer = OfficerTable(
            officer_id = officer_data.officer_id,
            department_id = officer_data.department_id,
            officer_name = officer_data.officer_name,
            officer_designation = (
                officer_data.officer_designation
            ),
            officer_email = (
                str(officer_data.officer_email)
                if officer_data.officer_email is not None
                else None
            ),
            officer_status = officer_data.officer_status,
        )

        try:
            db.add(new_officer)
            db.commit()
            db.refresh(new_officer)

            return new_officer
        
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def get_officer_by_id(
        db: Session,
        officer_id: str
    ) -> OfficerTable | None:
        return db.get(OfficerTable, officer_id)

    @staticmethod
    def get_officer_by_email(
        db: Session,
        officer_email: str
    ) -> OfficerTable | None:
        query = select (OfficerTable).where(func.lower(OfficerTable.officer_email) == officer_email.lower())
        return db.scalar(query)
    


    @staticmethod
    def create_project(db: Session, project_data: ProjectCreateDTO) -> ProjectTable:
        new_project = ProjectTable(
            project_name=project_data.project_name,
            project_budget=project_data.project_budget,
            project_status = project_data.project_status,
            department_id = project_data.department_id,
            officer_id = project_data.officer_id,
            project_start_date=(
                project_data.project_start_date
            ),
            project_expected_end_date=(
                project_data.project_expected_end_date
            ),
            project_description=(
                project_data.project_description
            ),
        )

        try:
            db.add(new_project)
            db.commit()
            db.refresh(new_project)

            return new_project
        
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def get_project_by_id(db: Session, project_id: int) -> ProjectTable | None:
        return db.get(ProjectTable, project_id)
    
    @staticmethod
    def get_project_by_name(
        db: Session,
        project_name: str
    ) -> ProjectTable | None:

        query = select(ProjectTable).where(
            func.lower(ProjectTable.project_name)
            == project_name.lower()
        )

        return db.scalar(query)
    
    @staticmethod
    def create_project_member(db: Session, member_data: ProjectMemberCreateDTO) -> ProjectMemberTable:
        new_member = ProjectMemberTable(
            project_id = member_data.project_id,
            developer_id = member_data.developer_id,
            assigned_by_id=member_data.assigned_by_id,
            member_status=True
        )

        try:
            db.add(new_member)
            db.commit()
            db.refresh(new_member)

            return new_member
        
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def get_project_member(
        db: Session,
        project_id: int,
        developer_id: int
    ) -> ProjectMemberTable | None:
        query = select(ProjectMemberTable).where(ProjectMemberTable.project_id == project_id, ProjectMemberTable.developer_id == developer_id)
        return db.scalar(query)
    

    @staticmethod
    def get_department_by_id(db: Session, department_id: int) -> DBDepartment | None:
        return db.get(DBDepartment, department_id)
    



#========================================================================================
    @staticmethod
    def get_project_details(db: Session, project_id: int | None = None, project_uuid: UUID | None = None) -> ProjectTable | None:
        if project_id is not None:
            return db.get(ProjectTable, project_id)
        
        if project_uuid is not None:
            query = select(ProjectTable).where(ProjectTable.project_uuid == project_uuid)
            return db.scalar(query)
        
        return None