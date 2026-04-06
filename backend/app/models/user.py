from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False)
    applications = relationship(
        "LoanApplication",
        back_populates="user",
        foreign_keys="LoanApplication.user_id",
        cascade="all, delete-orphan",
    )
    reviewed_applications = relationship(
        "LoanApplication",
        foreign_keys="LoanApplication.reviewer_id",
        overlaps="applications,user",
    )
