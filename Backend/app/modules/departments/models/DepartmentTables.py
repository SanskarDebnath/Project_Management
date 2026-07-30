
import datetime
from decimal import Decimal

from sqlalchemy import UUID, Column, DateTime, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
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

    department_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )
    
    department_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        index=True
    )
    
    department_budget: Mapped[Decimal] = mapped_column(
        Numeric(15, 2),
        nullable=False,
        default=Decimal("0.00")
    )

    department_created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
