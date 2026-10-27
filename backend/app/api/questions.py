import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Question, Topic, User
from app.schemas.schemas import QuestionOut, QuestionUpdate, QuestionReport, QuestionCreate
from app.auth import get_current_user, get_current_teacher

router = APIRouter(prefix="/questions", tags=["Question Bank & Review"])

@router.get("", response_model=List[QuestionOut])
def get_questions(
    status: Optional[str] = Query("pending", description="Filter by status: pending, approved, or all"),
    topic_id: Optional[int] = None,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if status and status != "all":
        query = query.filter(Question.status == status)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)

    questions = query.order_by(Question.created_at.desc()).all()
    topics = db.query(Topic).all()
    topic_map = {t.id: t for t in topics}

    result = []
    for q in questions:
        t = topic_map.get(q.topic_id)
        result.append(
            QuestionOut(
                id=q.id,
                topic_id=q.topic_id,
                topic_name=t.name if t else "General",
                subject=t.subject if t else "General",
                text=q.text,
                options=q.options,
                correct_index=q.correct_index,
                difficulty=q.difficulty,
                language=q.language,
                explanation=q.explanation,
                status=q.status,
                source=q.source
            )
        )
    return result


@router.post("", response_model=QuestionOut, status_code=status.HTTP_201_CREATED)
def create_question(
    data: QuestionCreate,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(Topic.id == data.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    q = Question(
        topic_id=data.topic_id,
        text=data.text.strip(),
        options_json=json.dumps(data.options),
        correct_index=data.correct_index,
        difficulty=data.difficulty,
        language=data.language,
        explanation=data.explanation.strip(),
        status="approved",
        source="teacher_created"
    )
    db.add(q)
    db.commit()
    db.refresh(q)

    return QuestionOut(
        id=q.id,
        topic_id=q.topic_id,
        topic_name=topic.name,
        subject=topic.subject,
        text=q.text,
        options=q.options,
        correct_index=q.correct_index,
        difficulty=q.difficulty,
        language=q.language,
        explanation=q.explanation,
        status=q.status,
        source=q.source
    )


@router.patch("/{id}", response_model=QuestionOut)
def update_question_status(
    id: int,
    data: QuestionUpdate,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    q = db.query(Question).filter(Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    if data.text is not None:
        q.text = data.text.strip()
    if data.options is not None:
        q.options = data.options
    if data.correct_index is not None:
        q.correct_index = data.correct_index
    if data.difficulty is not None:
        q.difficulty = data.difficulty
    if data.explanation is not None:
        q.explanation = data.explanation.strip()
    if data.status is not None:
        q.status = data.status

    db.commit()
    db.refresh(q)

    topic = db.query(Topic).filter(Topic.id == q.topic_id).first()

    return QuestionOut(
        id=q.id,
        topic_id=q.topic_id,
        topic_name=topic.name if topic else "General",
        subject=topic.subject if topic else "General",
        text=q.text,
        options=q.options,
        correct_index=q.correct_index,
        difficulty=q.difficulty,
        language=q.language,
        explanation=q.explanation,
        status=q.status,
        source=q.source
    )


@router.post("/{id}/report")
def report_question(
    id: int,
    report: QuestionReport,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows a student or teacher to flag an ambiguous or incorrect question.
    Flags it for teacher review in the Question Review dashboard.
    """
    q = db.query(Question).filter(Question.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    q.status = "pending"
    q.source = "reported"
    db.commit()

    return {
        "message": "Thank you! Question has been flagged for teacher review.",
        "question_id": q.id,
        "status": q.status
    }
