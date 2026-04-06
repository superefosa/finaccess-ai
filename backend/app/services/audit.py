from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def write_audit_log(db: Session, actor_id: int | None, action: str, target_type: str, target_id: int | None = None, details: str | None = None):
    log = AuditLog(
        actor_id=actor_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
