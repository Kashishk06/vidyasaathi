from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import (
    Assignment, AssignmentQuestion, ClassRoom, Enrollment, Question, Topic, User, Attempt
)
from app.schemas.schemas import AssignmentCreate, AssignmentOut, AssignmentUpdate, QuestionOut
from app.auth import get_current_teacher

router = APIRouter(prefix="/assignments", tags=["Teacher Assignments"])

@router.post("", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
def create_assignment(
    data: AssignmentCreate,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    classroom = db.query(ClassRoom).filter(
        ClassRoom.id == data.classroom_id,
        ClassRoom.teacher_id == current_teacher.id
    ).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found or unauthorized")

    topic = None
    if data.topic_id:
        topic = db.query(Topic).filter(Topic.id == data.topic_id).first()

    assignment = Assignment(
        title=data.title.strip(),
        classroom_id=classroom.id,
        teacher_id=current_teacher.id,
        subject=data.subject.strip(),
        topic_id=data.topic_id,
        due_date=data.due_date,
        instructions=data.instructions.strip() if data.instructions else None,
        status="active"
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    # Link questions
    for qid in data.question_ids:
        q = db.query(Question).filter(Question.id == qid).first()
        if q:
            link = AssignmentQuestion(assignment_id=assignment.id, question_id=q.id)
            db.add(link)
    db.commit()

    total_students = db.query(Enrollment).filter(Enrollment.classroom_id == classroom.id).count()

    return AssignmentOut(
        id=assignment.id,
        title=assignment.title,
        classroom_id=assignment.classroom_id,
        classroom_name=classroom.name,
        teacher_id=assignment.teacher_id,
        subject=assignment.subject,
        topic_id=assignment.topic_id,
        topic_name=topic.name if topic else None,
        due_date=assignment.due_date,
        instructions=assignment.instructions,
        status=assignment.status,
        question_count=len(data.question_ids),
        total_students=total_students,
        submissions_count=0,
        average_score=0.0,
        created_at=assignment.created_at
    )


@router.get("", response_model=List[AssignmentOut])
def list_assignments(
    classroom_id: Optional[int] = None,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment).filter(Assignment.teacher_id == current_teacher.id)
    if classroom_id:
        query = query.filter(Assignment.classroom_id == classroom_id)

    assignments = query.order_by(Assignment.created_at.desc()).all()
    result = []

    for a in assignments:
        c = a.classroom
        t = a.topic
        q_count = len(a.questions)
        q_ids = [aq.question_id for aq in a.questions]
        
        # Enrolled students
        enrollments = db.query(Enrollment).filter(Enrollment.classroom_id == a.classroom_id).all()
        student_ids = [e.student_id for e in enrollments]
        total_students = len(student_ids)

        # Calculate submissions & score from attempts on these questions
        submissions_count = 0
        avg_score = None
        if q_ids and student_ids:
            # Students who attempted at least one question of this assignment
            attempts = db.query(Attempt).filter(
                Attempt.question_id.in_(q_ids),
                Attempt.student_id.in_(student_ids)
            ).all()
            
            submitting_students = set(att.student_id for att in attempts)
            submissions_count = len(submitting_students)
            if attempts:
                correct = sum(1 for att in attempts if att.is_correct)
                avg_score = round((correct / len(attempts)) * 100, 1)

        result.append(
            AssignmentOut(
                id=a.id,
                title=a.title,
                classroom_id=a.classroom_id,
                classroom_name=c.name if c else "General Class",
                teacher_id=a.teacher_id,
                subject=a.subject,
                topic_id=a.topic_id,
                topic_name=t.name if t else None,
                due_date=a.due_date,
                instructions=a.instructions,
                status=a.status,
                question_count=q_count,
                total_students=total_students,
                submissions_count=submissions_count,
                average_score=avg_score,
                created_at=a.created_at
            )
        )

    return result


@router.get("/{id}")
def get_assignment_detail(
    id: int,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.id == id,
        Assignment.teacher_id == current_teacher.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    classroom = assignment.classroom
    enrollments = db.query(Enrollment).filter(Enrollment.classroom_id == assignment.classroom_id).all()
    student_ids = [e.student_id for e in enrollments]
    students = db.query(User).filter(User.id.in_(student_ids)).all() if student_ids else []

    q_ids = [aq.question_id for aq in assignment.questions]
    questions = db.query(Question).filter(Question.id.in_(q_ids)).all() if q_ids else []

    # Calculate student-by-student submissions
    student_breakdown = []
    for s in students:
        s_attempts = db.query(Attempt).filter(
            Attempt.student_id == s.id,
            Attempt.question_id.in_(q_ids)
        ).all() if q_ids else []

        has_submitted = len(s_attempts) > 0
        correct_count = sum(1 for att in s_attempts if att.is_correct)
        accuracy = round((correct_count / len(s_attempts)) * 100) if s_attempts else 0
        last_submitted = max([att.created_at for att in s_attempts]) if s_attempts else None

        student_breakdown.append({
            "student_id": s.id,
            "name": s.name,
            "phone_or_email": s.phone_or_email,
            "submitted": has_submitted,
            "questions_completed": len(s_attempts),
            "total_questions": len(q_ids),
            "score_percent": accuracy if has_submitted else None,
            "submitted_at": last_submitted
        })

    return {
        "id": assignment.id,
        "title": assignment.title,
        "classroom_id": assignment.classroom_id,
        "classroom_name": classroom.name if classroom else "",
        "subject": assignment.subject,
        "topic_id": assignment.topic_id,
        "due_date": assignment.due_date,
        "instructions": assignment.instructions,
        "status": assignment.status,
        "created_at": assignment.created_at,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "options": q.options,
                "correct_index": q.correct_index,
                "difficulty": q.difficulty,
                "explanation": q.explanation
            }
            for q in questions
        ],
        "students": student_breakdown
    }


@router.patch("/{id}", response_model=AssignmentOut)
def update_assignment(
    id: int,
    data: AssignmentUpdate,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.id == id,
        Assignment.teacher_id == current_teacher.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if data.title is not None:
        assignment.title = data.title.strip()
    if data.status is not None:
        assignment.status = data.status
    if data.instructions is not None:
        assignment.instructions = data.instructions.strip()
    if data.due_date is not None:
        assignment.due_date = data.due_date

    db.commit()
    db.refresh(assignment)

    classroom = assignment.classroom
    topic = assignment.topic
    total_students = db.query(Enrollment).filter(Enrollment.classroom_id == assignment.classroom_id).count()

    return AssignmentOut(
        id=assignment.id,
        title=assignment.title,
        classroom_id=assignment.classroom_id,
        classroom_name=classroom.name if classroom else "",
        teacher_id=assignment.teacher_id,
        subject=assignment.subject,
        topic_id=assignment.topic_id,
        topic_name=topic.name if topic else None,
        due_date=assignment.due_date,
        instructions=assignment.instructions,
        status=assignment.status,
        question_count=len(assignment.questions),
        total_students=total_students,
        submissions_count=0,
        average_score=None,
        created_at=assignment.created_at
    )


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_assignment(
    id: int,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.id == id,
        Assignment.teacher_id == current_teacher.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully", "id": id}
