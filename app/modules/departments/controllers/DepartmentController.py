from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, status
from core.database import get_db
from modules.departments.services.DepartmentService import DepartmentService
from modules.departments.schemas.DepartmentSchema import DepartmentDTO

router = APIRouter(prefix="/v1/department")

@router.post("/add-department", tags=["Add-department"], status_code = status.HTTP_201_CREATED)
def create_department(department_data : DepartmentDTO, db: Session = Depends(get_db)):
    new_department = DepartmentService.add_department(db, department_data)
    return {"message" : "Department Added Successfully"}