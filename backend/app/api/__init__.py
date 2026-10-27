from app.api.auth import router as auth_router
from app.api.topics import router as topics_router
from app.api.quiz import router as quiz_router
from app.api.ai import router as ai_router
from app.api.progress import router as progress_router
from app.api.classes import router as classes_router
from app.api.questions import router as questions_router
from app.api.assignments import router as assignments_router
from app.api.parent import router as parent_router

__all__ = [
    "auth_router",
    "topics_router",
    "quiz_router",
    "ai_router",
    "progress_router",
    "classes_router",
    "questions_router",
    "assignments_router",
    "parent_router"
]

