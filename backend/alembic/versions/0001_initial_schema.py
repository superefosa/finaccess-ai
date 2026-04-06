"""initial schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-04-06 10:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="user"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("email"),
    )
    op.create_table(
        "financial_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("employment_status", sa.String(length=50), nullable=False),
        sa.Column("monthly_income", sa.Float(), nullable=False),
        sa.Column("monthly_expenses", sa.Float(), nullable=False),
        sa.Column("current_debt", sa.Float(), nullable=False),
        sa.Column("years_employed", sa.Integer(), nullable=False),
        sa.Column("housing_status", sa.String(length=50), nullable=False),
        sa.Column("dependents", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "loan_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("requested_amount", sa.Float(), nullable=False),
        sa.Column("loan_purpose", sa.String(length=100), nullable=False),
        sa.Column("repayment_months", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("ai_score", sa.Float(), nullable=True),
        sa.Column("ai_recommendation", sa.String(length=50), nullable=True),
        sa.Column("explanation_summary", sa.Text(), nullable=True),
        sa.Column("final_decision", sa.String(length=50), nullable=True),
        sa.Column("reviewer_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("actor_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("target_type", sa.String(length=100), nullable=False),
        sa.Column("target_id", sa.Integer(), nullable=False),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("loan_applications")
    op.drop_table("financial_profiles")
    op.drop_table("users")
