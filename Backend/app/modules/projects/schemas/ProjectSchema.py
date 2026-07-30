from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

from modules.projects.models.ProjectTable import ProjectStatus

class OfficerCreateDTO(BaseModel):
    officer_id : str = Field(
        min_length=2, 
        max_length=150
    )

    department_id : int = Field(gt=0)

    officer_name: str = Field(
        min_length=2, 
        max_length=150
    )
    
    officer_designation: str | None = Field(
        default=None,
        max_length=150
    )

    officer_email: EmailStr | None = None

    officer_status: bool = True

    @field_validator(
        "officer_id",
        "officer_name",
        "officer_designation",
        mode="before"
    )
    @classmethod
    def clean_officer_strings(
        cls,
        value: object,
    ) -> object:
        
        if isinstance (value, str):
            cleaned_value = value.strip()

            if cleaned_value == "":
                return None
            
            return cleaned_value
        
        return value
    
class ProjectCreateDTO(BaseModel):
    project_name: str = Field(
        min_length=2,
        max_length=200
    )

    project_budget: Decimal = Field(
        default=Decimal("0.00"),
        ge = 0,
        max_digits=15,
        decimal_places=2
    )

    project_status: ProjectStatus = ProjectStatus.PLANNED

    department_id: int = Field(gt=0)

    officer_id: str = Field(
        min_length=2,
        max_length=150
    )

    project_start_date: date | None = None

    project_expected_end_date: date | None = None

    project_description: str | None = Field(
        default=None,
        max_length=5000
    )

    @field_validator(
        "project_name",
        "officer_id",
        "project_description",
        mode="before",
    )
    @classmethod
    def clean_project_strings(
        cls,
        value: object,
    ) -> object:
        
        if isinstance(value, str):
            cleaned_value = value.strip()

            if cleaned_value == "":
                return None
            
            return cleaned_value
        
        return value
    
    @model_validator(mode="after")
    def validate_project_dates(
        self
    )-> "ProjectCreateDTO":
        
        if (
            self.project_start_date is not None
            and self.project_expected_end_date is not None
            and self.project_expected_end_date < self.project_start_date
        ):
            raise ValueError("Project Expected end date can not be" \
            "before the project start date")
        
        return self
    

#==================Project Member DTO
    

class ProjectMemberCreateDTO(BaseModel):
    project_id: int = Field(gt=0)

    developer_id: int = Field(gt=0)

    assigned_by_id: str = Field(
        min_length=2,
        max_length=150
    )

    @field_validator("assigned_by_id", mode="before")
    @classmethod
    def clean_assigned_by_id(
        cls,
        value: object
    ) -> object:
        
        if isinstance(value, str):
            return value.strip()
        
        return value
    

#====================view project DTO
class ProjectLookupDTO(BaseModel):
    project_id: int | None = Field(
        default=None,
        gt=0
    )
    project_uuid: UUID | None = None
    
    @model_validator(mode="after")
    def validate_project_identifier(self) -> "ProjectLookupDTO" : 
        provided_identifiers = sum([self.project_id is not None,
                                    self.project_uuid is not None])
        
        if provided_identifiers == 0:
            raise ValueError("Provide either Project ID or Project UUID")
        
        if provided_identifiers > 1:
            raise ValueError("Provide only one identifiers:"
                             "Project_id or Project_uuid")
        return self


class ProjectReponseDTO(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )
    project_id: int
    project_uuid: UUID
    project_name: str
    project_budget: Decimal
    project_status: ProjectStatus
    department_id: int
    officer_id: str
    project_start_date: date | None
    project_expected_end_date: date | None
    project_description: str | None
    project_created_at: datetime
    project_updated_at: datetime
