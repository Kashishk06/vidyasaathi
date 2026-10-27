from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Topic, Mastery, User
from app.schemas.schemas import TopicOut
from app.auth import get_current_user

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("", response_model=List[TopicOut])
def get_topics(
    subject: Optional[str] = None,
    class_level: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(Topic)
    if subject:
        query = query.filter(Topic.subject.ilike(f"%{subject}%"))
    if class_level:
        query = query.filter(Topic.class_level == class_level)
    elif current_user and current_user.class_level:
        query = query.filter(Topic.class_level == current_user.class_level)

    topics = query.all()

    # If current user is a student, fetch their mastery score for each topic
    mastery_map = {}
    if current_user and current_user.role == "student":
        masteries = db.query(Mastery).filter(Mastery.student_id == current_user.id).all()
        mastery_map = {m.topic_id: m.score for m in masteries}

    result = []
    for t in topics:
        score = mastery_map.get(t.id, 0.0)
        result.append(
            TopicOut(
                id=t.id,
                subject=t.subject,
                class_level=t.class_level,
                chapter=t.chapter,
                name=t.name,
                mastery_score=score
            )
        )
    return result
