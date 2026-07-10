
import datetime

from sqlalchemy import UUID, Column, DateTime, Integer, Numeric, String
from core.database import Base
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime

import uuid as py_uuid

class DBDepartmentBase(Base):
    __abstract__ = True
    department_uuid = Column(
        UUID(as_uuid=True),
        default=py_uuid.uuid4,
        unique=True,
        nullable=False
    )


class DBDepartment(DBDepartmentBase):
    __tablename__ = "departments"
    __table_args__ = {"schema" : "departments"}

    department_id = Column (Integer, 
                            primary_key=True, 
                            autoincrement= True,
                            index=True)
    
    department_name = Column(String(150),
                              index = True)
    
    department_budget = Column(Numeric(15,2),
                               nullable = False,
                               default=0)

    department_created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )