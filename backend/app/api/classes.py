import random
import string
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, ClassRoom, Enrollment, Topic, Question, Mastery, Attempt
from app.schemas.schemas import (
    ClassCreate,
    ClassJoin,
    ClassOut,
    TeacherDashboardResponse,
    StudentMasteryRow,
    WeakTopicStat
)
from app.auth import get_current_user, get_current_teacher, get_current_student

router = APIRouter(prefix="/classes", tags=["Classrooms"])

def generate_join_code() -> str:
    """Generates a memorable 6-character alphanumeric code for rural classroom joining."""
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choice(chars) for _ in range(6))

@router.post("", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
def create_class(
    data: ClassCreate,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    join_code = generate_join_code()
    while db.query(ClassRoom).filter(ClassRoom.join_code == join_code).first():
        join_code = generate_join_code()

    classroom = ClassRoom(
        name=data.name.strip(),
        join_code=join_code,
        teacher_id=current_teacher.id
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)

    return ClassOut(
        id=classroom.id,
        name=classroom.name,
        join_code=classroom.join_code,
        teacher_id=classroom.teacher_id,
        student_count=0,
        created_at=classroom.created_at
    )


@router.get("", response_model=List[ClassOut])
def list_classes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "teacher":
        classes = db.query(ClassRoom).filter(ClassRoom.teacher_id == current_user.id).all()
        result = []
        for c in classes:
            student_count = db.query(Enrollment).filter(Enrollment.classroom_id == c.id).count()
            result.append(
                ClassOut(
                    id=c.id,
                    name=c.name,
                    join_code=c.join_code,
                    teacher_id=c.teacher_id,
                    student_count=student_count,
                    created_at=c.created_at
                )
            )
        return result
    else:
        # Enrolled classes for student
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
        result = []
        for e in enrollments:
            c = e.classroom
            if c:
                student_count = db.query(Enrollment).filter(Enrollment.classroom_id == c.id).count()
                result.append(
                    ClassOut(
                        id=c.id,
                        name=c.name,
                        join_code=c.join_code,
                        teacher_id=c.teacher_id,
                        student_count=student_count,
                        created_at=c.created_at
                    )
                )
        return result


@router.post("/join", status_code=status.HTTP_200_OK)
def join_class(
    data: ClassJoin,
    current_student: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    code = data.join_code.strip().upper()
    classroom = db.query(ClassRoom).filter(ClassRoom.join_code == code).first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid join code. Please check with your teacher."
        )

    # Check if already joined
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_student.id,
        Enrollment.classroom_id == classroom.id
    ).first()
    if existing:
        return {"message": f"Already enrolled in {classroom.name}", "class_id": classroom.id}

    enrollment = Enrollment(
        student_id=current_student.id,
        classroom_id=classroom.id
    )
    db.add(enrollment)
    db.commit()

    return {"message": f"Successfully joined {classroom.name}!", "class_id": classroom.id}


@router.get("/{id}/dashboard", response_model=TeacherDashboardResponse)
def get_class_dashboard(
    id: int,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    classroom = db.query(ClassRoom).filter(
        ClassRoom.id == id,
        ClassRoom.teacher_id == current_teacher.id
    ).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    enrollments = db.query(Enrollment).filter(Enrollment.classroom_id == classroom.id).all()
    student_ids = [e.student_id for e in enrollments]
    total_students = len(student_ids)

    if total_students == 0:
        return TeacherDashboardResponse(
            class_id=classroom.id,
            class_name=classroom.name,
            join_code=classroom.join_code,
            total_students=0,
            class_average_mastery=0.0,
            weakest_topics=[],
            students_mastery=[],
            inactive_students=[]
        )

    students = db.query(User).filter(User.id.in_(student_ids)).all()
    student_dict = {s.id: s for s in students}

    # Gather all masteries for these students
    all_masteries = db.query(Mastery).filter(Mastery.student_id.in_(student_ids)).all()
    topics = db.query(Topic).all()
    topic_map = {t.id: t for t in topics}

    # Student rows
    students_mastery: List[StudentMasteryRow] = []
    inactive_students: List[StudentMasteryRow] = []
    three_days_ago = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=3)

    student_avg_scores = []

    for sid in student_ids:
        st = student_dict.get(sid)
        if not st:
            continue
        
        s_masteries = [m for m in all_masteries if m.student_id == sid]
        s_attempts = db.query(Attempt).filter(Attempt.student_id == sid).all()
        
        last_attempt = db.query(Attempt).filter(
            Attempt.student_id == sid
        ).order_by(Attempt.created_at.desc()).first()
        last_active = last_attempt.created_at if last_attempt else None

        avg_m = (sum(m.score for m in s_masteries) / len(s_masteries)) if s_masteries else 0.0
        student_avg_scores.append(avg_m)

        # Find weakest topic for this student
        weakest_topic_name = "None"
        if s_masteries:
            lowest_m = min(s_masteries, key=lambda x: x.score)
            t = topic_map.get(lowest_m.topic_id)
            if t:
                weakest_topic_name = f"{t.name} ({round(lowest_m.score * 100)}%)"

        row = StudentMasteryRow(
            student_id=st.id,
            name=st.name,
            phone_or_email=st.phone_or_email,
            average_mastery=round(avg_m, 2),
            questions_attempted=len(s_attempts),
            weakest_topic=weakest_topic_name,
            last_active=last_active
        )
        students_mastery.append(row)

        if not last_active or last_active < three_days_ago:
            inactive_students.append(row)

    class_avg = (sum(student_avg_scores) / len(student_avg_scores)) if student_avg_scores else 0.0

    # Calculate Weakest Topics across class
    topic_scores: dict = {}
    for m in all_masteries:
        if m.topic_id not in topic_scores:
            topic_scores[m.topic_id] = []
        topic_scores[m.topic_id].append(m.score)

    weakest_topics: List[WeakTopicStat] = []
    for tid, scores in topic_scores.items():
        t = topic_map.get(tid)
        if t:
            avg_topic_score = sum(scores) / len(scores)
            attempts_count = db.query(Attempt).join(Question).filter(
                Question.topic_id == tid,
                Attempt.student_id.in_(student_ids)
            ).count()

            weakest_topics.append(
                WeakTopicStat(
                    topic_id=t.id,
                    topic_name=t.name,
                    subject=t.subject,
                    average_mastery=round(avg_topic_score, 2),
                    attempts_count=attempts_count
                )
            )

    # Sort topics by lowest mastery
    weakest_topics.sort(key=lambda x: x.average_mastery)

    return TeacherDashboardResponse(
        class_id=classroom.id,
        class_name=classroom.name,
        join_code=classroom.join_code,
        total_students=total_students,
        class_average_mastery=round(class_avg, 2),
        weakest_topics=weakest_topics,
        students_mastery=students_mastery,
        inactive_students=inactive_students
    )
