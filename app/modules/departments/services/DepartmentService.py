from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from modules.departments.repositories.DepartmentRepo import DepartmentRepo
from modules.departments.schemas.DepartmentSchema import DepartmentDTO, DepartmentUpdateDTO
from modules.departments.models.DepartmentTables import DBDepartment

class DepartmentService:
   
   
   
    @staticmethod
    def add_department(db:Session, department_data: DepartmentDTO) -> DBDepartment:
        return DepartmentRepo.add_department(db, department_data)
    



    @staticmethod
    def get_department_by_id(db:Session, department_id: int) -> DBDepartment:
        department = DepartmentRepo.get_department_by_id(db, department_id)
        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Department Not Found"
            )
        return department
    


    @staticmethod
    def update_department(
        db: Session,
        department_data: DepartmentUpdateDTO,
    ) -> DBDepartment:
        if department_data.dname is None and department_data.dbudget is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide department name or department budget to update",
            )

        if department_data.dname is not None:
            new_name = department_data.dname.strip()

            if len(new_name) < 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department name must contain at least 2 characters",
                )

            existing_dpt_name = DepartmentRepo.get_department_by_name(db, new_name)

            if (
                existing_dpt_name is not None
                and existing_dpt_name.department_id != department_data.did
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A department with this name already exists",
                )

        updated_department = DepartmentRepo.update_department(db, department_data)

        if updated_department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

        return updated_department