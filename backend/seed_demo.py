from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.financial_profile import FinancialProfile
from app.models.loan_application import LoanApplication
from app.services.security import hash_password
from app.services.scoring import score_application


def ensure_user(db: Session, email: str, full_name: str, role: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(full_name=full_name, email=email, role=role, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def main() -> None:
    db = SessionLocal()
    try:
        admin = ensure_user(db, "admin@example.com", "Demo Admin", "admin", "AdminPass123!")
        applicant = ensure_user(db, "user@example.com", "Demo User", "user", "UserPass123!")

        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == applicant.id).first()
        if not profile:
            profile = FinancialProfile(
                user_id=applicant.id,
                age=34,
                employment_status="full_time",
                monthly_income=3200,
                monthly_expenses=1700,
                current_debt=600,
                years_employed=4,
                housing_status="renting",
                dependents=1,
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        existing_application = db.query(LoanApplication).filter(LoanApplication.user_id == applicant.id).first()
        if not existing_application:
            application = LoanApplication(
                user_id=applicant.id,
                requested_amount=2500,
                loan_purpose="education",
                repayment_months=12,
            )
            db.add(application)
            db.commit()
            db.refresh(application)
            score_application(db, profile, application)

        print("Demo data ready")
        print("Admin: admin@example.com / AdminPass123!")
        print("User:  user@example.com / UserPass123!")
    finally:
        db.close()


if __name__ == "__main__":
    main()