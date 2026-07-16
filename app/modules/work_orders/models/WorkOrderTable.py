from __future__ import annotations
import enum
import uuid as py_uuid

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from core.database.database import Base

class WorkOrderStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    GENERATED = "GENERATED"
    PENDING_SIGNATURE = "PENDING_SIGNATURE"
    SIGNED = "SIGNED"
    CANCELLED = "CANCELLED"

class WorkOrderTable(Base):
    __tablename__ = "work_orders"
    __table_args__ = (
        UniqueConstraint(
            "Work_order_number",
            name="uq_work_order_number",
        ),
        CheckConstraint(
            "monthly_salary >= 0",
            name = "ck_work_order_salary_non_negetive",
        ),
        CheckConstraint(
            """

            """,
            name = "ck_work_order_end_after_start",
        ),
        CheckConstraint(
            "tier >= 1",
            name="ck_work_order_tier_positive"
        ),
        {"schema" : "work_orders"},
    )

    work_order_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    work_order_uuid: Mapped[py_uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        default=py_uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )
    work_order_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )
    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "projects.projects.project_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )
    department_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "depsrtmrnts.departments.department_id",
            ondelete="RESTRICT"
        ),
        nullable=False,
        index=True,
    )
    developer_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )
    officer_id: Mapped[str] = mapped_column(
        String(150),
        ForeignKey(
            "projects.officer_details.officer_id",
             ondelete = "RESTRICT",
        ),
       nullable=False,
       index=True,
    )
    tier: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )
    monthly_salary: Mapped[Decimal] = mapped_column(
        Numeric(15,2),
        nullable=False,
    )
    work_order_start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
    work_order_end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
    number_of_months: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    work_order_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    project_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    department_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    developer_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    officer_name_snapshot: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    work_order_status: Mapped[WorkOrderStatus] = mapped_column(
        SAEnum(
            WorkOrderStatus,
            name="Work_Order_Status_values",
            native_enum = False,
            create_constraint = True,
            validate_strings = True,
        ),
        default=WorkOrderStatus.DRAFT,
        nullable=False,
        index=True,
    )
    unsigned_pdf_base64 : Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    signed_pdf_base64: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    signed_pdf_sha256: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
    )

    signed_by_officer_id: Mapped[str | None] = mapped_column(
        String(150),
        ForeignKey(
            "projects.officer_details.officer_id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    signed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    work_order_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    work_order_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )