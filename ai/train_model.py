from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

BASE = Path(__file__).resolve().parent
MODEL_DIR = BASE / "model"
MODEL_DIR.mkdir(exist_ok=True)

rng = np.random.default_rng(42)
rows = 1500

data = pd.DataFrame({
    "monthly_income": rng.integers(1000, 8000, rows),
    "monthly_expenses": rng.integers(500, 5000, rows),
    "current_debt": rng.integers(0, 20000, rows),
    "years_employed": rng.integers(0, 20, rows),
    "requested_amount": rng.integers(500, 15000, rows),
    "repayment_months": rng.integers(3, 48, rows),
    "age": rng.integers(18, 65, rows),
    "dependents": rng.integers(0, 5, rows),
    "employment_code": rng.integers(0, 4, rows),
    "housing_code": rng.integers(0, 3, rows),
})

risk = (
    (data["current_debt"] + data["requested_amount"]) / (data["monthly_income"] * 12)
    + (data["monthly_expenses"] / data["monthly_income"]).clip(0, 2) * 0.4
    - data["years_employed"] * 0.02
    - data["employment_code"] * 0.05
    - data["housing_code"] * 0.03
)

data["target"] = (risk > 0.5).astype(int)

X = data.drop(columns=["target"])
y = data["target"]

numeric_features = X.columns.tolist()
preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]), numeric_features)
])

model = Pipeline([
    ("prep", preprocessor),
    ("clf", RandomForestClassifier(n_estimators=150, random_state=42)),
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)
print(classification_report(y_test, preds))
joblib.dump(model, MODEL_DIR / "credit_model.joblib")
print(f"Saved model to {MODEL_DIR / 'credit_model.joblib'}")
