import base64
import binascii

from fastapi import (APIRouter, Depends, HTTPException, Response, status)
from sqlalchemy.orm import Session
from core.database.database import get_db
from modules.work_orders.schemas.WorkOrderSchema import *
from modules.work_orders.services.WorkOrderService import WorkOrderService


router = APIRouter(prefix="/v1/work-orders",
                   tags=["Work Orders"]
)

@router.post("/create", response_model=WorkOrderResponseDTO, status_code=status.HTTP_201_CREATED)
def create_work_order(
    data: WorkOrderCreateDTO,
    db: Session = Depends(get_db)):
    return WorkOrderService.create_work_order(db, data)

@router.post(
    "/details",
    response_model=WorkOrderResponseDTO,
)
def get_work_order_details(
    lookup: WorkOrderLookupDTO,
    db: Session = Depends(get_db),
):
    return WorkOrderService.get_work_order(
        db,
        lookup,
    )

@router.get(
    "/list",
    response_model=list[WorkOrderResponseDTO],
)
@router.get(
    "/all",
    response_model=list[WorkOrderResponseDTO],
)
@router.get(
    "/my-orders",
    response_model=list[WorkOrderResponseDTO],
)
def list_work_orders(
    db: Session = Depends(get_db),
):
    return WorkOrderService.get_all_work_orders(db)




class WorkOrderSignRequest(BaseModel):
    lookup: WorkOrderLookupDTO
    signing_officer_id: str
    certificate_path: str | None = None
    certificate_password: str | None = None


@router.post(
    "/sign",
    response_model=WorkOrderResponseDTO,
)
def sign_work_order(
    request: WorkOrderSignRequest,
    db: Session = Depends(get_db),
):
    return WorkOrderService.sign_work_order(
        db=db,
        lookup=request.lookup,
        signing_officer_id=request.signing_officer_id,
        certificate_path=request.certificate_path,
        certificate_password=request.certificate_password,
    )


@router.get(
    "/{work_order_id}/pdf",
    response_class=Response,
    responses={
        200: {
            "content": {
                "application/pdf": {}
            },
            "description": "Signed work-order PDF",
        }
    },
)
def get_work_order_pdf(
    work_order_id: int,
    db: Session = Depends(get_db),
):
    work_order = WorkOrderService.get_work_order(
        db,
        WorkOrderLookupDTO(
            work_order_id=work_order_id
        ),
    )

    pdf_base64 = (
        work_order.signed_pdf_base64
        or work_order.unsigned_pdf_base64
    )

    if pdf_base64 is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF has not been generated",
        )

    try:
        pdf_bytes = base64.b64decode(
            pdf_base64,
            validate=True,
        )

    except (ValueError, binascii.Error) as exception:
        raise HTTPException(
            status_code=500,
            detail="Stored PDF data is invalid",
        ) from exception

    file_name = (
        f"{work_order.work_order_number}.pdf"
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'inline; filename="{file_name}"'
            )
        },
    )