import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Topic, Question, Attempt, Mastery
from app.schemas.schemas import (
    DiagnosticRequest,
    QuestionOut,
    AnswerSubmission,
    AnswerResult
)
from app.auth import get_current_student
from app.engine.adaptive import (
    calculate_new_mastery,
    get_difficulty_for_mastery,
    select_next_topic,
    calculate_streak,
    evaluate_badges
)

router = APIRouter(prefix="/quiz", tags=["Quiz & Practice"])

@router.post("/diagnostic", response_model=List[QuestionOut])
def get_diagnostic_quiz(
    diag_req: DiagnosticRequest,
    current_student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Returns an 8-question diagnostic quiz spanning topics in the requested subject
    to assess the student's initial proficiency level.
    """
    lang = diag_req.language or current_student.language or "hi"
    topics = db.query(Topic).filter(
        Topic.class_level == diag_req.class_level,
        Topic.subject.ilike(f"%{diag_req.subject}%")
    ).all()

    if not topics:
        topics = db.query(Topic).filter(Topic.class_level == diag_req.class_level).all()

    topic_ids = [t.id for t in topics]
    
    # Fetch approved questions for these topics
    questions = db.query(Question).filter(
        Question.topic_id.in_(topic_ids),
        Question.status == "approved"
    ).all()

    # Prefer student language, fallback if needed
    lang_questions = [q for q in questions if q.language == lang]
    pool = lang_questions if len(lang_questions) >= 8 else questions

    if len(pool) < 8:
        selected_questions = pool
    else:
        selected_questions = random.sample(pool, 8)

    topic_map = {t.id: t for t in topics}

    result = []
    for q in selected_questions:
        t = topic_map.get(q.topic_id)
        result.append(
            QuestionOut(
                id=q.id,
                topic_id=q.topic_id,
                topic_name=t.name if t else "General",
                subject=t.subject if t else diag_req.subject,
                text=q.text,
                options=q.options,
                correct_index=None,  # Conceal during quiz
                difficulty=q.difficulty,
                language=q.language,
                explanation=None,
                status=q.status,
                source=q.source
            )
        )
    return result


@router.get("/next", response_model=QuestionOut)
def get_next_question(
    subject: Optional[str] = Query("Math"),
    topic_id: Optional[int] = Query(None),
    current_student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Retrieves the next adaptive practice question tailored to the student's current learning gap.
    Selects the weakest topic and maps mastery to difficulty ('easy', 'medium', 'hard').
    """
    lang = current_student.language or "hi"

    # Determine topic
    target_topic_id = topic_id
    if not target_topic_id:
        topics = db.query(Topic).filter(
            Topic.class_level == current_student.class_level,
            Topic.subject.ilike(f"%{subject}%")
        ).all()
        if not topics:
            topics = db.query(Topic).all()

        topic_ids = [t.id for t in topics]
        masteries = db.query(Mastery).filter(
            Mastery.student_id == current_student.id,
            Mastery.topic_id.in_(topic_ids)
        ).all()
        mastery_dict = {m.topic_id: m.score for m in masteries}

        topic_scores = [{"topic_id": t.id, "score": mastery_dict.get(t.id, 0.0)} for t in topics]
        target_topic_id = select_next_topic(topic_scores, exploration_rate=0.2)

    if not target_topic_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No topics available for practice."
        )

    topic = db.query(Topic).filter(Topic.id == target_topic_id).first()
    mastery_record = db.query(Mastery).filter(
        Mastery.student_id == current_student.id,
        Mastery.topic_id == target_topic_id
    ).first()

    current_score = mastery_record.score if mastery_record else 0.0
    target_difficulty = get_difficulty_for_mastery(current_score)

    # Search for question with matching topic and difficulty
    query = db.query(Question).filter(
        Question.topic_id == target_topic_id,
        Question.status == "approved"
    )

    # Try matching language and difficulty
    candidates = query.filter(Question.language == lang, Question.difficulty == target_difficulty).all()
    if not candidates:
        candidates = query.filter(Question.language == lang).all()
    if not candidates:
        candidates = query.all()
    if not candidates:
        # Fallback to any approved question in subject
        candidates = db.query(Question).filter(Question.status == "approved").all()

    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No practice questions found."
        )

    # Pick one question (preferably one not attempted recently)
    recent_attempted_ids = [
        a.question_id for a in db.query(Attempt)
        .filter(Attempt.student_id == current_student.id)
        .order_by(Attempt.created_at.desc())
        .limit(10).all()
    ]
    unattempted = [q for q in candidates if q.id not in recent_attempted_ids]
    selected_question = random.choice(unattempted if unattempted else candidates)

    return QuestionOut(
        id=selected_question.id,
        topic_id=selected_question.topic_id,
        topic_name=topic.name if topic else "General",
        subject=topic.subject if topic else "General",
        text=selected_question.text,
        options=selected_question.options,
        correct_index=None,
        difficulty=selected_question.difficulty,
        language=selected_question.language,
        explanation=None,
        status=selected_question.status,
        source=selected_question.source
    )


@router.post("/answer", response_model=AnswerResult)
def submit_answer(
    submission: AnswerSubmission,
    current_student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Submits a student's answer, updates adaptive mastery score, logs the attempt,
    evaluates streaks and badges, and returns instant feedback with explanation.
    """
    question = db.query(Question).filter(Question.id == submission.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = (submission.selected_index == question.correct_index)

    # Record attempt
    attempt = Attempt(
        student_id=current_student.id,
        question_id=question.id,
        selected_index=submission.selected_index,
        is_correct=is_correct,
        time_taken=submission.time_taken
    )
    db.add(attempt)

    # Update Mastery
    mastery = db.query(Mastery).filter(
        Mastery.student_id == current_student.id,
        Mastery.topic_id == question.topic_id
    ).first()

    current_score = mastery.score if mastery else 0.0
    new_score = calculate_new_mastery(current_score, is_correct)

    if mastery:
        mastery.score = new_score
    else:
        mastery = Mastery(
            student_id=current_student.id,
            topic_id=question.topic_id,
            score=new_score
        )
        db.add(mastery)

    db.commit()

    # Calculate streak from past attempts
    attempts_history = [
        a.is_correct for a in db.query(Attempt)
        .filter(Attempt.student_id == current_student.id)
        .order_by(Attempt.created_at.asc())
        .all()
    ]
    current_streak = calculate_streak(attempts_history)
    next_diff = get_difficulty_for_mastery(new_score)

    # Check for unlocked badges
    topic = db.query(Topic).filter(Topic.id == question.topic_id).first()
    badge_unlocked = None
    if current_streak == 3:
        badge_unlocked = "🔥 On Fire (3 की लड़ी) Unlocked!"
    elif current_streak == 5:
        badge_unlocked = "⚡ Super Scholar (5 की लड़ी) Unlocked!"
    elif new_score >= 0.70 and current_score < 0.70:
        badge_unlocked = "🏆 Topic Champion (विषय महारथी) Unlocked!"

    return AnswerResult(
        is_correct=is_correct,
        selected_index=submission.selected_index,
        correct_index=question.correct_index,
        explanation=question.explanation,
        topic_id=question.topic_id,
        topic_name=topic.name if topic else "Topic",
        new_mastery=new_score,
        next_difficulty=next_diff,
        streak=current_streak,
        badge_unlocked=badge_unlocked
    )
