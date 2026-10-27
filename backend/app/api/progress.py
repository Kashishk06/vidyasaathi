from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Topic, Question, Attempt, Mastery
from app.schemas.schemas import (
    StudentProgressOut,
    Badge,
    TopicMasteryProgress,
    AttemptHistoryItem
)
from app.auth import get_current_student
from app.engine.adaptive import calculate_streak, evaluate_badges

router = APIRouter(prefix="/progress", tags=["Progress & Analytics"])

@router.get("/me", response_model=StudentProgressOut)
def get_my_progress(
    current_student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Returns the student's mastery profile, badges, streak, accuracy, and practice history.
    """
    # Fetch all attempts
    attempts = db.query(Attempt).filter(Attempt.student_id == current_student.id).order_by(Attempt.created_at.asc()).all()
    total_attempts = len(attempts)
    total_correct = sum(1 for a in attempts if a.is_correct)
    accuracy = round((total_correct / total_attempts * 100), 1) if total_attempts > 0 else 0.0

    # Streak calculation
    history_correct = [a.is_correct for a in attempts]
    current_streak = calculate_streak(history_correct)

    # Highest streak calculation
    highest_streak = 0
    temp_streak = 0
    for c in history_correct:
        if c:
            temp_streak += 1
            if temp_streak > highest_streak:
                highest_streak = temp_streak
        else:
            temp_streak = 0

    # Topic Masteries
    topics = db.query(Topic).filter(Topic.class_level == current_student.class_level).all()
    mastery_records = db.query(Mastery).filter(Mastery.student_id == current_student.id).all()
    mastery_dict = {m.topic_id: m.score for m in mastery_records}

    topic_masteries: List[TopicMasteryProgress] = []
    scores_list: List[float] = []

    for t in topics:
        score = mastery_dict.get(t.id, 0.0)
        scores_list.append(score)

        # Attempts for this topic
        t_attempts = [a for a in attempts if a.question and a.question.topic_id == t.id]
        t_correct = sum(1 for a in t_attempts if a.is_correct)

        if score < 0.40:
            level = "Novice (शुरुआती)"
        elif score <= 0.70:
            level = "Developing (अभ्यासी)"
        else:
            level = "Master (महारथी)"

        topic_masteries.append(
            TopicMasteryProgress(
                topic_id=t.id,
                topic_name=t.name,
                subject=t.subject,
                chapter=t.chapter,
                mastery_score=round(score, 2),
                level=level,
                total_attempts=len(t_attempts),
                correct_attempts=t_correct
            )
        )

    # Badges evaluation
    badge_data = evaluate_badges(
        total_attempts=total_attempts,
        current_streak=current_streak,
        mastery_scores=scores_list
    )
    badges = [Badge(**b) for b in badge_data]

    # Recent attempts (last 10)
    recent = db.query(Attempt).filter(
        Attempt.student_id == current_student.id
    ).order_by(Attempt.created_at.desc()).limit(10).all()

    recent_history: List[AttemptHistoryItem] = []
    for a in recent:
        q = a.question
        t = q.topic if q else None
        recent_history.append(
            AttemptHistoryItem(
                attempt_id=a.id,
                question_text=q.text[:80] + "..." if q and len(q.text) > 80 else (q.text if q else ""),
                subject=t.subject if t else "General",
                topic_name=t.name if t else "General",
                is_correct=a.is_correct,
                time_taken=a.time_taken,
                created_at=a.created_at
            )
        )

    return StudentProgressOut(
        total_attempts=total_attempts,
        total_correct=total_correct,
        overall_accuracy=accuracy,
        current_streak=current_streak,
        highest_streak=highest_streak,
        badges=badges,
        topic_masteries=topic_masteries,
        recent_attempts=recent_history
    )
