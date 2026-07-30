from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from decimal import Decimal

from uuid import UUID

class DepartmentDTO(BaseModel):
    did : int
    dname : str
    dbudget: Decimal
    
class DepartmentIdDTO(BaseModel):
    did: int = Field(
        gt=0,
        description = "Department ID must be greater then zero"
    )

class DepartmentUpdateDTO(BaseModel):
        did: int = Field(gt=0, description = "Department ID must be greater then zero")
        dname: str | None = Field(default=None,min_length=2,max_length=150)
        dbudget:Decimal | None = Field(default=None, ge=0)

class DepartmentResponseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    department_id: int
    department_uuid: UUID
    department_name: str
    department_budget: Decimal
    department_created_at: datetime
