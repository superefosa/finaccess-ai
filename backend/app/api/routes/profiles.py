from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.financial_profile import FinancialProfile
from app.models.user import User
from app.schemas.profile import FinancialProfileCreate, FinancialProfileOut
from app.services.audit import write_audit_log

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("", response_model=FinancialProfileOut)
def create_or_update_profile(
    payload: FinancialProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if profile:
        for field, value in payload.model_dump().items():
            setattr(profile, field, value)
        action = "update_profile"
    else:
        profile = FinancialProfile(user_id=current_user.id, **payload.model_dump())
        db.add(profile)
        action = "create_profile"

    db.commit()
    db.refresh(profile)
    write_audit_log(db, current_user.id, action, "financial_profile", profile.id, "Profile saved")
    return profile


@router.get("/me", response_model=FinancialProfileOut)
def get_my_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
