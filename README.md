# FinAccess AI

FinAccess AI is an AI-powered credit assessment and loan application platform designed for Capstone delivery. It demonstrates a complete applicant workflow, AI-assisted risk scoring, admin review, Dockerized local development, CI, and deployment scaffolding.

## Stack
- React + Vite
- FastAPI
- PostgreSQL
- scikit-learn
- Docker Compose
- GitHub Actions

## Quick start

### 1. Train the AI model
```bash
cd ai
python train_model.py
```

### 2. Run the full stack with Docker
```bash
docker compose up --build
```

### 3. Seed demo accounts
```bash
docker compose exec backend python seed_demo.py
```

Demo credentials:
- Admin: `admin@finaccess.local` / `AdminPass123!`
- User: `user@finaccess.local` / `UserPass123!`

## Non-Docker local backend
```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python seed_demo.py
uvicorn app.main:app --reload
```

## Non-Docker local frontend
```bash
cd frontend
npm install
npm run dev
```

## Default URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Main features
- User registration and login
- Financial profile creation
- Loan application submission
- AI-generated scoring and recommendation
- Admin review and final decision
- Audit-ready flow foundations
- Deployment starter files for Render and Vercel

## Repository layout
- `frontend/` React application
- `backend/` FastAPI API and tests
- `ai/` model training script and artifacts
- `docs/` architecture, deployment, testing notes

## Capstone checklist coverage
- Working code repository
- Cloud deployment scaffolding
- AI workflow integration
- CI/CD starter pipeline
- Design/testing documentation starter
