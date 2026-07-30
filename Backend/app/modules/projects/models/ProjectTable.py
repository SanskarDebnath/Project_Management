from __future__ import annotations

import enum
import uuid as py_uuid

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
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

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from core.database.database import Base


class ProjectStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class OfficerTable(Base):
    __tablename__ = "officer_details"

    __table_args__ = (
        CheckConstraint(
            "char_length(trim(officer_id)) >= 2",
            name="ck_officer_id_min_length",
        ),
        CheckConstraint(
            "char_length(trim(officer_name)) >= 2",
            name="ck_officer_name_min_length",
        ),
        CheckConstraint(
            "department_id > 0",
            name="ck_officer_department_id_positive",
        ),
        {"schema": "projects"},
    )

    officer_id: Mapped[str] = mapped_column(
        String(150),
        primary_key=True,
    )

    officer_uuid: Mapped[py_uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        default=py_uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )

    department_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "departments.departments.department_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    officer_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    officer_designation: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    officer_email: Mapped[str | None] = mapped_column(
        String(254),
        nullable=True,
        unique=True,
        index=True,
    )

    officer_status: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    officer_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    officer_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    projects: Mapped[list["ProjectTable"]] = relationship(
        back_populates="officer",
    )

    assignments_created: Mapped[list["ProjectMemberTable"]] = relationship(
        back_populates="assigned_by_officer",
        foreign_keys="ProjectMemberTable.assigned_by_id",
    )


class ProjectTable(Base):
    __tablename__ = "projects"

    __table_args__ = (
        CheckConstraint(
            "char_length(trim(project_name)) >= 2",
            name="ck_project_name_min_length",
        ),
        CheckConstraint(
            "project_budget >= 0",
            name="ck_project_budget_non_negative",
        ),
        CheckConstraint(
            "department_id > 0",
            name="ck_project_department_id_positive",
        ),
        CheckConstraint(
            """
            project_expected_end_date IS NULL
            OR project_start_date IS NULL
            OR project_expected_end_date >= project_start_date
            """,
            name="ck_project_end_after_start",
        ),
        {"schema": "projects"},
    )

    project_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    project_uuid: Mapped[py_uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        default=py_uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )

    project_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )

    project_budget: Mapped[Decimal] = mapped_column(
        Numeric(15, 2),
        default=Decimal("0.00"),
        nullable=False,
    )

    project_status: Mapped[ProjectStatus] = mapped_column(
        SAEnum(
            ProjectStatus,
            name="project_status_values",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
        ),
        default=ProjectStatus.PLANNED,
        nullable=False,
        index=True,
    )

    department_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "departments.departments.department_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    project_start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    project_expected_end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    project_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    officer_id: Mapped[str] = mapped_column(
        String(150),
        ForeignKey(
            "projects.officer_details.officer_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    project_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    project_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    officer: Mapped["OfficerTable"] = relationship(
        back_populates="projects",
    )

    members: Mapped[list["ProjectMemberTable"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class ProjectMemberTable(Base):
    __tablename__ = "project_members"

    __table_args__ = (
        UniqueConstraint(
            "project_id",
            "developer_id",
            name="uq_project_member_project_developer",
        ),
        CheckConstraint(
            "project_id > 0",
            name="ck_project_member_project_id_positive",
        ),
        CheckConstraint(
            "developer_id > 0",
            name="ck_project_member_developer_id_positive",
        ),
        {"schema": "projects"},
    )

    member_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    member_uuid: Mapped[py_uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        default=py_uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )

    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "projects.projects.project_id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    developer_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    assigned_by_id: Mapped[str] = mapped_column(
        String(150),
        ForeignKey(
            "projects.officer_details.officer_id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    member_status: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    removed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    project: Mapped["ProjectTable"] = relationship(
        back_populates="members",
    )

    assigned_by_officer: Mapped["OfficerTable"] = relationship(
        back_populates="assignments_created",
        foreign_keys=[assigned_by_id],
    )