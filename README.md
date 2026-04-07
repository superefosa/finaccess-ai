# 🚀 FinAccess AI

FinAccess AI is a full-stack, AI-powered credit assessment and loan application platform developed as a Capstone project. It demonstrates an end-to-end applicant workflow, machine learning-based risk scoring, admin decision support, and cloud deployment.

---

## 🌐 Live Deployment

* Frontend (Vercel): https://finaccess-ai.vercel.app
* Backend API (Render): https://finaccess-backend.onrender.com

---

## 🔐 Demo Access (Quick Test)

Use these credentials to test the system immediately:

### 👤 User
* Email: `user@example.com`
* Password: `UserPass123!`

### 🛠️ Admin
* Email: `admin@example.com`
* Password: `AdminPass123!`

👉 Login: https://finaccess-ai.vercel.app/login  
👉 Admin Dashboard: https://finaccess-ai.vercel.app/admin  

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