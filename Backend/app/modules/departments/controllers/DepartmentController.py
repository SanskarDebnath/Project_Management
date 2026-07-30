from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.database import get_db
from modules.departments.services.DepartmentService import DepartmentService
from modules.departments.schemas.DepartmentSchema import (
    DepartmentDTO,
    DepartmentIdDTO,
    DepartmentResponseDTO,
    DepartmentUpdateDTO,
)

router = APIRouter(prefix="/v1/department", tags =["Departments"])

@router.post("/add-department", status_code = status.HTTP_201_CREATED)
def create_department(department_data : DepartmentDTO, db: Session = Depends(get_db)):
    new_department = DepartmentService.add_department(db, department_data)
    return {"message" : "Department Added Successfully"}

@router.post("/view-department", response_model = DepartmentResponseDTO, status_code=status.HTTP_200_OK)
def view_department(
    department_data: DepartmentIdDTO, db: Session = Depends(get_db)):
    department = DepartmentService.get_department_by_id(db, department_data.did)

    return department

@router.post("/edit-department", response_model=DepartmentResponseDTO, status_code=status.HTTP_200_OK)
def edit_department(department_data: DepartmentUpdateDTO, db: Session = Depends(get_db)):
    updated_department = DepartmentService.update_department(db, department_data)
    return updated_department
