from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from modules.departments.repositories.DepartmentRepo import DepartmentRepo
from modules.departments.schemas.DepartmentSchema import DepartmentDTO
from modules.departments.models.DepartmentTables import DBDepartment

class DepartmentService:
    @staticmethod
    def add_department(db:Session, department_data: DepartmentDTO) -> DBDepartment:
        return DepartmentRepo.add_department(db, department_data)