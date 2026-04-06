# Deployment Notes

## Local Docker workflow
1. Train the model from the project root:
   `cd ai && python train_model.py`
2. Start containers:
   `docker compose up --build`
3. Apply migrations and seed data if needed:
   `docker compose exec backend python seed_demo.py`

## Render + Vercel approach
- Deploy the FastAPI backend to Render.
- Deploy the React frontend to Vercel.
- Use a managed PostgreSQL instance.
- Set `VITE_API_BASE_URL` in Vercel to the backend base URL.
- Set `CORS_ORIGINS` in Render to the frontend URL.

## Required environment variables
### Backend
- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`
- `MODEL_PATH`

### Frontend
- `VITE_API_BASE_URL`
