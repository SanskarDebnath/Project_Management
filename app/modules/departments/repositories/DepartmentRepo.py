from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, select
from modules.departments.models.DepartmentTables import DBDepartment
from modules.departments.schemas.DepartmentSchema import DepartmentDTO, DepartmentUpdateDTO

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
    
    @staticmethod
    def get_department_by_id(db:Session, department_id: int) -> DBDepartment | None:
        departments = db.get(DBDepartment, department_id)
        return departments
    
    @staticmethod
    def update_department(db:Session, department_data: DepartmentUpdateDTO) -> DBDepartment | None:
        department = db.get(DBDepartment, department_data.did)

        if department is None:
            return None
        
        new_name = department_data.dname
        if new_name is not None:
            department.department_name = new_name.strip()


        new_budget = department_data.dbudget

        if new_budget is not None:
            department.department_budget = new_budget

        try:
            db.commit()
            db.refresh(department)
            return department
        except SQLAlchemyError:
            db.rollback()
            raise

    @staticmethod
    def get_department_by_name(
            db: Session, department_name: str) -> DBDepartment | None:
            query = select(DBDepartment).where(func.lower(DBDepartment.department_name) == department_name.lower())
            return db.scalar(query)