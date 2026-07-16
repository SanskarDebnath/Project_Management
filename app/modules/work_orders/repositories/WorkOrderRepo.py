from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from modules.work_orders.models.WorkOrderTable import (WorkOrderTable)

class WorkorderRepo:
    @staticmethod
    def get_by_id(db:Session, work_order_id: int) -> WorkOrderTable | None:
        return db.get(WorkOrderTable, work_order_id)
    
    @staticmethod
    def get_by_uuid(db: Session, work_order_uuid: UUID) -> WorkOrderTable | None:
        query = select(WorkOrderTable).where(WorkOrderTable.work_order_uuid == work_order_uuid)
        return db.scalar(query)
    
    @staticmethod
    def get_by_number (db:Session, work_order_number: str) -> WorkOrderTable | None:
        query = select(WorkOrderTable).where(WorkOrderTable.work_order_number == work_order_number)
        return db.scalar(query)
    
    @staticmethod
    def create(db:Session, work_order: WorkOrderTable) -> WorkOrderTable:
        try:
            db.add(work_order)
            db.commit()
            db.refresh(work_order)

            return work_order
        except SQLAlchemyError: 
            db.rollback()
            raise

    @staticmethod
    def save_pdf(db:Session, work_order: WorkOrderTable) -> WorkOrderTable:
        try:
            db.add(work_order)
            db.commit()
            db.refresh(work_order)

            return work_order
        
        except SQLAlchemyError:
            db.rollback()
            raise