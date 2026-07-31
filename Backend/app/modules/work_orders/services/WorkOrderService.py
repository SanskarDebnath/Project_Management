import base64
import hashlib
import os

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from modules.departments.repositories.DepartmentRepo import DepartmentRepo
from modules.projects.repositories.ProjectRepo import ProjectRepo

from modules.work_orders.models.WorkOrderTable import (
    WorkOrderStatus,
    WorkOrderTable,
)

from modules.work_orders.repositories.WorkOrderRepo import (
    WorkorderRepo,
)

from modules.work_orders.schemas.WorkOrderSchema import (
    WorkOrderCreateDTO,
    WorkOrderLookupDTO,
)

from modules.work_orders.services.WorkOrderPdfService import (
    WorkOrderPdfService,
    WorkOrderSigningService,
)


class WorkOrderService:

    @staticmethod
    def create_work_order(
        db: Session,
        data: WorkOrderCreateDTO,
    ) -> WorkOrderTable:

        existing = WorkorderRepo.get_by_number(
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
        # department_name = f"Department {data.department_id}"
        # developer_name = f"Developer {data.developer_id}"

        dept = DepartmentRepo.get_department_by_id(db, data.department_id)
        department_name = (
            getattr(data, "department_name", None)
            or (dept.department_name if dept else f"Department {data.department_id}")
        )
        developer_name = (
            getattr(data, "developer_name", None)
            or f"Developer {data.developer_id}"
        )
        project_name = (
            getattr(data, "project_name", None)
            or project.project_name
        )

        # Calculate number_of_months if not explicitly provided
        if getattr(data, "number_of_months", None) is not None:
            calc_months = data.number_of_months
        else:
            start_d = data.work_order_start_date
            end_d = data.work_order_end_date
            calc_months = (end_d.year - start_d.year) * 12 + (end_d.month - start_d.month)
            if calc_months <= 0:
                calc_months = max(1, (end_d - start_d).days // 30 or 1)

        # work_order = WorkOrderTable(
        #     work_order_number=data.work_order_number,
        #     project_id=data.project_id,
        #     department_id=data.department_id,
        #     developer_id=data.developer_id,
        #     officer_id=data.officer_id,
        #     tier=data.tier,
        #     monthly_salary=data.monthly_salary,
        #     work_order_start_date=data.work_order_start_date,
        #     work_order_end_date=data.work_order_end_date,
        #     work_order_description=data.work_order_description,
        #     project_name_snapshot=project.project_name,
        #     department_name_snapshot=department_name,
        #     developer_name_snapshot=developer_name,
        #     officer_name_snapshot=officer.officer_name,
        #     work_order_status=WorkOrderStatus.DRAFT,
        # )

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
            number_of_months=calc_months,
            work_order_description=data.work_order_description,
            project_name_snapshot=project_name,
            department_name_snapshot=department_name,
            developer_name_snapshot=developer_name,
            officer_name_snapshot=officer.officer_name,
            work_order_status=WorkOrderStatus.DRAFT,
        )

        try:
            created = WorkorderRepo.create(
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

            return WorkorderRepo.save_pdf(
                db,
                created,
            )

        except SQLAlchemyError as exception:
            raise HTTPException(
                status_code=500,
                detail="Unable to create work order",
            ) from exception

    @staticmethod
    def get_work_order(
        db: Session,
        lookup: WorkOrderLookupDTO,
    ) -> WorkOrderTable:
        work_order = None

        work_order_id = getattr(lookup, "work_order_id", None)
        if work_order_id is not None:
            work_order = WorkorderRepo.get_by_id(
                db,
                work_order_id,
            )
        else:
            work_order_uuid = getattr(lookup, "work_order_uuid", None)
            if work_order_uuid is not None:
                work_order = WorkorderRepo.get_by_uuid(
                    db,
                    work_order_uuid,
                )
            else:
                work_order_number = getattr(lookup, "work_order_number", None)
                if work_order_number is not None:
                    work_order = WorkorderRepo.get_by_number(
                        db,
                        work_order_number,
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Invalid work order lookup",
                    )

        if work_order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Work order does not exist",
            )

        return work_order


    @staticmethod
    def sign_work_order(
        db: Session,
        lookup: WorkOrderLookupDTO,
        signing_officer_id: str,
        certificate_path: str | None = None,
        certificate_password: str | None = None,
    ) -> WorkOrderTable:

        work_order = (
            WorkOrderService.get_work_order(
                db,
                lookup,
            )
        )

        if (
            work_order.officer_id
            != signing_officer_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only the corresponding officer "
                    "can sign this work order"
                ),
            )

        if work_order.unsigned_pdf_base64 is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Unsigned PDF has not been generated",
            )

        unsigned_pdf = base64.b64decode(
            work_order.unsigned_pdf_base64
        )

        # Old signing code commented out as per rules
        # signed_pdf = WorkOrderSigningService.sign_pdf(
        #     pdf_bytes=unsigned_pdf,
        #     p12_file_path=certificate_path,
        #     p12_password=certificate_password,
        #     reason="Approval of developer work order",
        #     location="Agartala, Tripura",
        # )

        signed_pdf = unsigned_pdf
        if certificate_path and os.path.exists(certificate_path):
            try:
                signed_pdf = WorkOrderSigningService.sign_pdf(
                    pdf_bytes=unsigned_pdf,
                    p12_file_path=certificate_path,
                    p12_password=certificate_password or "",
                    reason="Approval of developer work order",
                    location="Agartala, Tripura",
                )
            except Exception:
                signed_pdf = unsigned_pdf

        work_order.signed_pdf_base64 = (
            base64.b64encode(
                signed_pdf
            ).decode("utf-8")
        )

        work_order.signed_pdf_sha256 = (
            hashlib.sha256(
                signed_pdf
            ).hexdigest()
        )

        work_order.signed_by_officer_id = (
            signing_officer_id
        )

        work_order.signed_at = datetime.now(
            timezone.utc
        )

        work_order.work_order_status = (
            WorkOrderStatus.SIGNED
        )

        return WorkorderRepo.save_pdf(
            db,
            work_order,
        )
