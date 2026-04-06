from datetime import datetime
from sqlalchemy import ForeignKey, String, Float, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    age: Mapped[int] = mapped_column(Integer)
    employment_status: Mapped[str] = mapped_column(String(50))
    monthly_income: Mapped[float] = mapped_column(Float)
    monthly_expenses: Mapped[float] = mapped_column(Float)
    current_debt: Mapped[float] = mapped_column(Float)
    years_employed: Mapped[int] = mapped_column(Integer)
    housing_status: Mapped[str] = mapped_column(String(50))
    dependents: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="financial_profile")
