import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import engine, Base
from app.api import (
    auth_router,
    topics_router,
    quiz_router,
    ai_router,
    progress_router,
    classes_router,
    questions_router,
    assignments_router,
    parent_router
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty (required for cloud deployments like Render)
def ensure_seeded():
    from app.database import SessionLocal
    from app.models.models import User
    from seed import seed_database
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            print("[Startup] Database is empty. Seeding initial users, classes, and demo data...")
            seed_database()
            print("[Startup] Auto-seed complete.")
    except Exception as e:
        print(f"[Startup] Auto-seed check error: {e}")
    finally:
        db.close()

try:
    ensure_seeded()
except Exception as e:
    print(f"[Startup] Could not run ensure_seeded: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    description="VidyaSaathi: AI-Powered Personalized Learning Agent for Rural Students (SDG 4: Quality Education)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Mobile Web & PWA
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lightweight Request Duration & Rate-limit Logging Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Register API Routers
app.include_router(auth_router)
app.include_router(topics_router)
app.include_router(quiz_router)
app.include_router(ai_router)
app.include_router(progress_router)
app.include_router(classes_router)
app.include_router(questions_router)
app.include_router(assignments_router)
app.include_router(parent_router)


@app.get("/", tags=["Health"])
def health_check():
    from app.database import SessionLocal
    from app.models.models import User
    has_watsonx = bool(settings.WATSONX_API_KEY and settings.WATSONX_PROJECT_ID)
    db = SessionLocal()
    user_count = 0
    try:
        user_count = db.query(User).count()
    except Exception:
        pass
    finally:
        db.close()

    return {
        "project": "VidyaSaathi",
        "sdg_target": "SDG 4: Quality Education",
        "status": "online",
        "users_in_db": user_count,
        "ai_engine": "IBM watsonx.ai (Granite)" if has_watsonx else "MockProvider (Offline Demo Mode)",
        "docs": "/docs",
        "supported_languages": ["hi", "en", "mr", "bn", "ta"]
    }

@app.get("/seed-db", tags=["Seed"])
def trigger_seed():
    from seed import seed_database
    try:
        seed_database()
        return {"status": "success", "message": "Database successfully seeded with demo accounts!"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
