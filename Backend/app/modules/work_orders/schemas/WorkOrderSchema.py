from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)
from modules.work_orders.models.WorkOrderTable import (WorkOrderStatus)

class WorkOrderCreateDTO(BaseModel):
    work_order_number: str = Field(
        min_length=2,
        max_length=100,
    )

    project_id: int = Field(gt=0)
    department_id: int = Field(gt=0)
    developer_id: int = Field(gt=0)

    officer_id: str = Field(
        min_length=2,
        max_length=150,
    )

    tier: int = Field(
        ge=1,
        le=10,
    )
    
    monthly_salary: Decimal = Field(
        gt=0,
        max_digits=15,
        decimal_places=2,
    )

    work_order_start_date: date
    work_order_end_date: date

    work_order_description: str | None = Field(
        default=None,
        max_length=5000,
    )

    @field_validator(
        "work_order_number",
        "officer_id",
        "work_order_description",
        mode="before",
    )

    @classmethod
    def clean_strings(
        cls,
        value: object,
    ) -> object: 
        if isinstance (value, str):
            cleaned_value = value.strip()
            return cleaned_value or None
        
        return value
    
    @model_validator(mode="after")
    def validate_dates(self) -> "WorkOrderCreateDTO":
        if (self.work_order_end_date < self.work_order_start_date):
            raise ValueError("work-Order end date cannot be before the start date")
        return self



class WorkOrderLookupDTO(BaseModel):
    work_order_id: int | None = Field(
        default=None,
        gt=0,
    )

    work_order_uuid: UUID | None = None

    work_order_number: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    @model_validator(mode="after")
    def validate_identifiers(
        self,
    ) -> "WorkOrderLookupDTO":
        supplied = sum (
            [
                self.work_order_id is not None,
                self.work_order_uuid is not None,
                self.work_order_number is not None,
            ]
        )

        if supplied != 1:
            raise ValueError("Provide exactly one of work_order_id, work_order_uuid or work_order_number")
        return self
    

class WorkOrderResponseDTO(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    work_order_id: int
    work_order_uuid: UUID
    work_order_number: str

    project_id: int
    department_id: int
    developer_id: int
    officer_id: str

    tier: int
    monthly_salary: Decimal

    work_order_start_date: date
    work_order_end_date: date
    number_of_months: int | None

    work_order_description: str | None
    project_name_snapshot: str
    developer_name_snapshot: str
    officer_name_snapshot : str

    work_order_status: WorkOrderStatus
    signed_by_officer_id: str | None
    signed_at: datetime | None

    work_order_created_at: datetime
    work_order_updated_at: datetime