# 🚀 FinAccess AI

FinAccess AI is a full-stack, AI-powered credit assessment and loan application platform developed as a Capstone project. It demonstrates an end-to-end applicant workflow, machine learning-based risk scoring, admin decision support, and cloud deployment.

---

## 🌐 Live Deployment

* Frontend (Vercel): https://finaccess-ai.vercel.app
* Backend API (Render): https://finaccess-backend.onrender.com

---

## 🧰 Tech Stack

### Frontend

* React (Vite)
* JavaScript
* Axios

### Backend

* FastAPI
* SQLAlchemy
* Alembic (database migrations)
* JWT Authentication (python-jose)

### AI / Machine Learning

* scikit-learn
* pandas
* joblib

### Database

* SQLite (deployment version)

### DevOps / Tooling

* Docker Compose (local development)
* GitHub Actions (CI scaffolding)
* Render (backend deployment)
* Vercel (frontend deployment)

---

## ⚙️ Quick Start (Local Development)

### 1. Train the AI model

```bash
cd ai
python train_model.py
```

### 2. Run full stack with Docker

```bash
docker compose up --build
```

### 3. Seed demo accounts

```bash
docker compose exec backend python seed_demo.py
```

### 🔐 Demo Credentials

* Admin: `admin@example.com` / `AdminPass123!`
* User: `user@example.com` / `UserPass123!`

---

## 🖥️ Non-Docker Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python seed_demo.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Default Local URLs

* Frontend: http://localhost:5173
* Backend: http://localhost:8000
* API Docs: http://localhost:8000/docs

---

## ✨ Core Features

### 👤 User

* Secure registration and login (JWT-based)
* Financial profile creation
* Loan application submission
* Application status tracking

### 🤖 AI Engine

* Credit risk scoring model
* Automated recommendation (approve/reject)
* Human-readable explanation summary

### 🛠️ Admin

* Admin dashboard
* View all applications
* Approve or reject applications
* Override AI recommendations

---

## 🧠 AI Model

The model predicts credit risk using:

* income
* expenses
* debt
* employment duration
* dependents

### Output

* Risk score (0–1)
* Recommendation (approve/reject)
* Explanation summary

### Model File

```
backend/app/model/credit_model.joblib
```

---

## 🏗️ System Architecture

```
Frontend (React - Vercel)
        ↓
Backend API (FastAPI - Render)
        ↓
Database (SQLite)
        ↓
AI Model (scikit-learn)
```

---

## 🔄 Data Flow

```
User → Profile → Loan Application → AI Risk Scoring
     → Admin Review → Final Decision → Dashboard Update
```

---

## 📡 API Overview

### Auth

* POST /auth/register
* POST /auth/login
* GET /auth/me

### Profiles

* POST /profiles
* GET /profiles/me

### Applications

* POST /applications
* GET /applications/me

### Admin

* GET /admin/applications
* PATCH /admin/applications/{id}/decision

---

## 📂 Repository Structure

* `frontend/` → React application
* `backend/` → FastAPI backend
* `ai/` → model training scripts
* `docs/` → design and testing documentation

---

## 🧪 Testing

The system was validated using:

* Functional testing (user + admin workflows)
* API endpoint testing

### Verified functionality

* Authentication
* Profile creation
* Loan application workflow
* AI scoring logic
* Admin decision flow
* Dashboard updates

---

## ⚠️ Limitations

* SQLite used instead of a production-grade database
* Limited dataset for model training
* No external financial system integration
* No real-time notifications

---

## 🚀 Future Improvements

* PostgreSQL integration
* Real-time notifications
* Advanced machine learning models
* Credit bureau integration
* Payment tracking system

---

## 📚 Documentation

* Design → `/docs/design.md`
* Testing → `/docs/testing.md`

---

## 📸 Screenshots

Stored in:

```
/docs/screenshots/
```

---

## 🎓 Capstone Coverage

This project demonstrates:

* Full-stack application development
* AI/ML integration
* REST API design
* Authentication and role-based access
* Cloud deployment (Render + Vercel)
* CI/CD pipeline scaffolding

---

## 👥 Team

(Add all group members here before submission)

---

## 🏁 Conclusion

FinAccess AI delivers a complete end-to-end intelligent lending platform combining:

* Software engineering
* Machine learning
* Secure backend architecture
* Cloud deployment

It demonstrates how AI can support financial decision-making while maintaining human oversight.
