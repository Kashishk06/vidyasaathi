from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, ParentStudent, Attempt, Mastery, Topic
from app.schemas.schemas import LinkChildRequest, LinkedChildOut
from app.auth import get_current_parent
from app.engine.adaptive import calculate_streak

router = APIRouter(prefix="/parent", tags=["Parent / Guardian"])

@router.get("/children", response_model=List[LinkedChildOut])
def get_linked_children(
    current_parent: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """
    Returns all students linked to this parent account.
    Restricted strictly to the authenticated parent's children.
    """
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == current_parent.id).all()
    student_ids = [l.student_id for l in links]

    if not student_ids:
        return []

    students = db.query(User).filter(User.id.in_(student_ids), User.role == "student").all()
    result = []

    for s in students:
        masteries = db.query(Mastery).filter(Mastery.student_id == s.id).all()
        avg_m = (sum(m.score for m in masteries) / len(masteries)) if masteries else 0.0

        attempts = db.query(Attempt).filter(Attempt.student_id == s.id).order_by(Attempt.created_at.asc()).all()
        history_correct = [a.is_correct for a in attempts]
        streak = calculate_streak(history_correct)

        last_att = attempts[-1] if attempts else None
        last_active = last_att.created_at if last_att else None

        result.append(
            LinkedChildOut(
                id=s.id,
                name=s.name,
                phone_or_email=s.phone_or_email,
                class_level=s.class_level or 8,
                language=s.language,
                average_mastery=round(avg_m, 2),
                questions_attempted=len(attempts),
                streak=streak,
                last_active=last_active
            )
        )

    return result


@router.post("/link-child")
def link_child(
    req: LinkChildRequest,
    current_parent: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """
    Allows a parent to link their child account using the student's phone number or email.
    Verifies the student exists and is assigned the 'student' role.
    """
    query_contact = req.student_phone_or_email.strip()
    student = db.query(User).filter(
        User.phone_or_email == query_contact,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student account not found with this phone/email. Please verify details with your child."
        )

    # Check if already linked
    existing = db.query(ParentStudent).filter(
        ParentStudent.parent_id == current_parent.id,
        ParentStudent.student_id == student.id
    ).first()

    if existing:
        return {"message": f"{student.name} is already linked to your account.", "student_id": student.id}

    new_link = ParentStudent(
        parent_id=current_parent.id,
        student_id=student.id
    )
    db.add(new_link)
    db.commit()

    return {
        "message": f"Successfully linked child: {student.name}",
        "student_id": student.id,
        "student_name": student.name
    }


@router.get("/children/{child_id}/progress")
def get_child_progress(
    child_id: int,
    current_parent: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """
    Returns detailed learning progress for a linked child.
    Privacy enforcement: Rejects requests if child is not authorized to this parent.
    """
    # Authorization verification
    link = db.query(ParentStudent).filter(
        ParentStudent.parent_id == current_parent.id,
        ParentStudent.student_id == child_id
    ).first()

    if not link:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You can only view progress for children linked to your parent account."
        )

    student = db.query(User).filter(User.id == child_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attempts = db.query(Attempt).filter(Attempt.student_id == student.id).order_by(Attempt.created_at.asc()).all()
    total_attempts = len(attempts)
    total_correct = sum(1 for a in attempts if a.is_correct)
    accuracy = round((total_correct / total_attempts * 100), 1) if total_attempts > 0 else 0.0

    # Topic Masteries
    topics = db.query(Topic).filter(Topic.class_level == (student.class_level or 8)).all()
    masteries = db.query(Mastery).filter(Mastery.student_id == student.id).all()
    mastery_map = {m.topic_id: m.score for m in masteries}

    topic_details = []
    for t in topics:
        score = mastery_map.get(t.id, 0.0)
        topic_details.append({
            "topic_id": t.id,
            "topic_name": t.name,
            "subject": t.subject,
            "chapter": t.chapter,
            "mastery": round(score * 100),
            "status": "उत्कृष्ट" if score >= 0.7 else "मध्यम" if score >= 0.4 else "ध्यान आवश्यक"
        })

    # Weekly Activity (Daily practice minutes)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    weekly_breakdown = []
    days_labels = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"]
    for i in range(7):
        target_day = now - timedelta(days=6 - i)
        start_day = datetime(target_day.year, target_day.month, target_day.day)
        end_day = start_day + timedelta(days=1)
        day_attempts = [a for a in attempts if start_day <= a.created_at < end_day]
        minutes = sum(a.time_taken for a in day_attempts) // 60
        weekly_breakdown.append({
            "day": days_labels[target_day.weekday()],
            "minutes": max(minutes, len(day_attempts) * 3)  # estimate
        })

    return {
        "child": {
            "id": student.id,
            "name": student.name,
            "class_level": student.class_level,
            "phone_or_email": student.phone_or_email
        },
        "overall_accuracy": accuracy,
        "total_questions_solved": total_attempts,
        "topics": topic_details,
        "weekly_activity": weekly_breakdown,
        "home_support_tips": [
            "प्रतिदिन 30 मिनट अध्ययन के बाद छात्र से समझी गई अवधारणाओं पर चर्चा करें।",
            "गणित अभ्यास में गलत उत्तर आने पर हतोत्साहित न करें, बल्कि विद्यासाथी RAG संदेह समाधान का उपयोग करने को कहें।",
            "नियमित अभ्यास के लिए समय सारिणी बनाएं और स्क्रीन समय को 45 मिनट के भीतर सीमित रखें।"
        ]
    }
