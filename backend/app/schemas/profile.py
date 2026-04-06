from datetime import datetime
from pydantic import BaseModel, Field


class FinancialProfileBase(BaseModel):
    age: int = Field(..., ge=18, le=100)
    employment_status: str
    monthly_income: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    current_debt: float = Field(..., ge=0)
    years_employed: int = Field(..., ge=0, le=80)
    housing_status: str
    dependents: int = Field(0, ge=0, le=20)


class FinancialProfileCreate(FinancialProfileBase):
    pass


class FinancialProfileOut(FinancialProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
