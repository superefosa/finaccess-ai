from pathlib import Path
import joblib
import numpy as np
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.financial_profile import FinancialProfile
from app.models.loan_application import LoanApplication

EMPLOYMENT_MAP = {
    "unemployed": 0,
    "part_time": 1,
    "full_time": 2,
    "self_employed": 3,
}

HOUSING_MAP = {
    "renting": 0,
    "family": 1,
    "owning": 2,
}


class FallbackModel:
    def predict_proba(self, X):
        results = []
        for row in X:
            monthly_income, monthly_expenses, current_debt, years_employed, requested_amount, repayment_months, age, dependents, employment_code, housing_code = row
            debt_to_income = (current_debt + requested_amount) / max(monthly_income * 12, 1)
            expense_ratio = monthly_expenses / max(monthly_income, 1)
            stability = min(years_employed / 10, 1)
            employment_bonus = employment_code / 10
            housing_bonus = housing_code / 20
            age_factor = 0.05 if 25 <= age <= 55 else 0.12
            risk = 0.25 + debt_to_income * 0.5 + expense_ratio * 0.2 + age_factor - stability * 0.1 - employment_bonus - housing_bonus
            risk = min(max(risk, 0.01), 0.99)
            results.append([1 - risk, risk])
        return np.array(results)


def load_model():
    path = Path(__file__).resolve().parent / settings.model_path
    if path.exists():
        return joblib.load(path)
    return FallbackModel()


def build_features(profile: FinancialProfile, application: LoanApplication):
    return np.array([[
        profile.monthly_income,
        profile.monthly_expenses,
        profile.current_debt,
        profile.years_employed,
        application.requested_amount,
        application.repayment_months,
        profile.age,
        profile.dependents,
        EMPLOYMENT_MAP.get(profile.employment_status, 0),
        HOUSING_MAP.get(profile.housing_status, 0),
    ]])


def recommendation_from_score(score: float) -> str:
    if score < 0.35:
        return "approve"
    if score <= 0.65:
        return "review"
    return "reject"


def explanation_summary(profile: FinancialProfile, application: LoanApplication, score: float) -> str:
    reasons = []
    dti = (profile.current_debt + application.requested_amount) / max(profile.monthly_income * 12, 1)
    if dti > 0.35:
        reasons.append("high debt-to-income ratio increased risk")
    if profile.years_employed < 2:
        reasons.append("short employment duration contributed to risk")
    if profile.monthly_income > profile.monthly_expenses * 1.8:
        reasons.append("income stability improved score confidence")
    if profile.housing_status == "owning":
        reasons.append("stable housing reduced risk")
    if not reasons:
        reasons.append("balanced financial profile produced a moderate risk assessment")
    return "; ".join(reasons)


def score_application(db: Session, profile: FinancialProfile, application: LoanApplication):
    model = load_model()
    features = build_features(profile, application)
    score = float(model.predict_proba(features)[0][1])
    application.ai_score = round(score, 4)
    application.ai_recommendation = recommendation_from_score(score)
    application.explanation_summary = explanation_summary(profile, application, score)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
