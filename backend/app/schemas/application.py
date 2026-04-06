from datetime import datetime
from pydantic import BaseModel, Field


class LoanApplicationCreate(BaseModel):
    requested_amount: float = Field(..., gt=0)
    loan_purpose: str
    repayment_months: int = Field(..., ge=1, le=120)


class LoanApplicationOut(BaseModel):
    id: int
    user_id: int
    requested_amount: float
    loan_purpose: str
    repayment_months: int
    status: str
    ai_score: float | None = None
    ai_recommendation: str | None = None
    explanation_summary: str | None = None
    final_decision: str | None = None
    reviewer_id: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AdminDecisionUpdate(BaseModel):
    final_decision: str
