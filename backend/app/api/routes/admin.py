from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.db.session import get_db
from app.models.loan_application import LoanApplication
from app.models.user import User
from app.schemas.application import LoanApplicationOut, AdminDecisionUpdate
from app.schemas.audit import AuditLogOut
from app.models.audit_log import AuditLog
from app.services.audit import write_audit_log

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/applications", response_model=list[LoanApplicationOut])
def list_applications(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(LoanApplication).order_by(LoanApplication.created_at.desc()).all()


@router.patch("/applications/{application_id}/decision", response_model=LoanApplicationOut)
def decide_application(
    application_id: int,
    payload: AdminDecisionUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    application = db.get(LoanApplication, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    application.final_decision = payload.final_decision
    application.status = payload.final_decision
    application.reviewer_id = admin_user.id
    db.add(application)
    db.commit()
    db.refresh(application)
    write_audit_log(db, admin_user.id, "admin_decision", "loan_application", application.id, f"Set decision to {payload.final_decision}")
    return application


@router.get("/audit-logs", response_model=list[AuditLogOut])
def list_audit_logs(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
