from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class DepartmentDTO(BaseModel):
    did : int
    dname : str
    dbudget: Decimal
    
