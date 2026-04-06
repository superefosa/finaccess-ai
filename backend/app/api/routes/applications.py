from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.financial_profile import FinancialProfile
from app.models.loan_application import LoanApplication
from app.models.user import User
from app.schemas.application import LoanApplicationCreate, LoanApplicationOut
from app.services.audit import write_audit_log
from app.services.scoring import score_application

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=LoanApplicationOut, status_code=201)
def create_application(
    payload: LoanApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Create a financial profile first")

    application = LoanApplication(user_id=current_user.id, **payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    scored = score_application(db, profile, application)
    write_audit_log(db, current_user.id, "create_application", "loan_application", scored.id, "Application created and scored")
    return scored


@router.get("/me", response_model=list[LoanApplicationOut])
def get_my_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(LoanApplication).filter(LoanApplication.user_id == current_user.id).order_by(LoanApplication.created_at.desc()).all()


@router.get("/{application_id}", response_model=LoanApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    application = db.get(LoanApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    return application
