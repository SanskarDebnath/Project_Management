import base64
import hashlib

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from modules.projects.repositories.ProjectRepo import ProjectRepo

from modules.work_orders.models.WorkOrderTable import (
    WorkOrderStatus,
    WorkOrderTable,
)

from modules.work_orders.repositories import WorkOrderRepo
from modules.work_orders.repositories.WorkOrderRepo import (
    WorkorderRepo,
)

from modules.work_orders.schemas.WorkOrderSchema import (
    WorkOrderCreateDTO,
    WorkOrderLookupDTO,
)

from modules.work_orders.services.WorkOrderPdfService import (
    WorkOrderPdfService,
)

from modules.work_orders.models.WorkOrderTable import (
    WorkOrderTable,
    WorkOrderStatus
)


class WorkOrderService:

    @staticmethod
    def create_work_order(
        db: Session,
        data: WorkOrderCreateDTO,
    ) -> WorkOrderTable:

        existing = WorkOrderRepo.get_by_number(
            db,
            data.work_order_number,
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Work-order number already exists",
            )

        project = ProjectRepo.get_project_by_id(
            db,
            data.project_id,
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project does not exist",
            )

        officer = ProjectRepo.get_officer_by_id(
            db,
            data.officer_id,
        )

        if officer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Officer does not exist",
            )

        if not officer.officer_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive officer cannot issue work orders",
            )

        if project.department_id != data.department_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project does not belong to the department",
            )

        if officer.department_id != data.department_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Officer does not belong to the department",
            )

        # Replace these with actual repository lookups.
        department_name = f"Department {data.department_id}"
        developer_name = f"Developer {data.developer_id}"

        work_order = WorkOrderTable(
            work_order_number=data.work_order_number,
            project_id=data.project_id,
            department_id=data.department_id,
            developer_id=data.developer_id,
            officer_id=data.officer_id,
            tier=data.tier,
            monthly_salary=data.monthly_salary,
            work_order_start_date=data.work_order_start_date,
            work_order_end_date=data.work_order_end_date,
            work_order_description=data.work_order_description,
            project_name_snapshot=project.project_name,
            department_name_snapshot=department_name,
            developer_name_snapshot=developer_name,
            officer_name_snapshot=officer.officer_name,
            work_order_status=WorkOrderStatus.DRAFT,
        )

        try:
            created = WorkOrderRepo.create(
                db,
                work_order,
            )

            unsigned_pdf = (
                WorkOrderPdfService.generate_pdf(
                    created
                )
            )

            created.unsigned_pdf_base64 = (
                base64.b64encode(
                    unsigned_pdf
                ).decode("utf-8")
            )

            created.work_order_status = (
                WorkOrderStatus.PENDING_SIGNATURE
            )

            return WorkOrderRepo.save_pdf(
                db,
                created,
            )

        except SQLAlchemyError as exception:
            raise HTTPException(
                status_code=500,
                detail="Unable to create work order",
            ) from exception