from sqlalchemy.orm import Session
from sqlalchemy import or_
from modules.departments.models.DepartmentTables import DBDepartment
from modules.departments.schemas.DepartmentSchema import DepartmentDTO

class DepartmentRepo:
    @staticmethod
    def add_department(db:Session, department_data : DepartmentDTO) -> DBDepartment:
        new_department = DBDepartment(
            department_id = department_data.did,
            department_name = department_data.dname,
            department_budget = department_data.dbudget)

        db.add(new_department)
        db.commit()
        db.refresh(new_department)
        return new_department