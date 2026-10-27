from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, EmailStr

# Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone_or_email: str = Field(..., min_length=3, max_length=120)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field("student", pattern="^(student|teacher|parent)$")
    class_level: Optional[int] = Field(8, ge=6, le=10)
    language: str = Field("hi", pattern="^(hi|en|mr|bn|ta)$")

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    phone_or_email: str
    role: str
    class_level: Optional[int] = 8
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    language: Optional[str] = None
    class_level: Optional[int] = None
    name: Optional[str] = None

class UserRoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(student|teacher|parent|super_admin)$")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Parent & Child Schemas
class LinkChildRequest(BaseModel):
    student_phone_or_email: str

class LinkedChildOut(BaseModel):
    id: int
    name: str
    phone_or_email: str
    class_level: Optional[int] = 8
    language: str
    average_mastery: float
    questions_attempted: int
    streak: int
    last_active: Optional[datetime] = None

# Topic Schemas
class TopicOut(BaseModel):
    id: int
    subject: str
    class_level: int
    chapter: str
    name: str
    mastery_score: Optional[float] = 0.0

    class Config:
        from_attributes = True

# Question Schemas
class QuestionOut(BaseModel):
    id: int
    topic_id: int
    topic_name: Optional[str] = None
    subject: Optional[str] = None
    text: str
    options: List[str]
    correct_index: Optional[int] = None  # May be hidden in student view unless submitted
    difficulty: str
    language: str
    explanation: Optional[str] = None
    status: str
    source: str

    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    topic_id: int
    text: str
    options: List[str] = Field(..., min_length=2, max_length=5)
    correct_index: int = Field(..., ge=0, le=4)
    difficulty: str = Field("medium", pattern="^(easy|medium|hard)$")
    language: str = Field("hi", pattern="^(hi|en|mr|bn|ta)$")
    explanation: str

class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    options: Optional[List[str]] = None
    correct_index: Optional[int] = None
    difficulty: Optional[str] = None
    explanation: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(approved|pending|flagged)$")

class QuestionReport(BaseModel):
    reason: Optional[str] = "Incorrect option or confusing explanation"

# Quiz Schemas
class DiagnosticRequest(BaseModel):
    subject: str = "Math"
    class_level: int = 8
    language: Optional[str] = None

class AnswerSubmission(BaseModel):
    question_id: int
    selected_index: int
    time_taken: int = 0

class AnswerResult(BaseModel):
    is_correct: bool
    selected_index: int
    correct_index: int
    explanation: str
    topic_id: int
    topic_name: str
    new_mastery: float
    next_difficulty: str
    streak: int
    badge_unlocked: Optional[str] = None

# AI Schemas
class ExplainRequest(BaseModel):
    question_id: Optional[int] = None
    topic_id: Optional[int] = None
    concept_title: Optional[str] = None
    language: Optional[str] = None
    user_query: Optional[str] = None

class ExplainResponse(BaseModel):
    title: str
    explanation: str
    rural_example: str
    key_takeaway: str
    audio_text: str
    language: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = None
    topic_id: Optional[int] = None

class ChatResponse(BaseModel):
    reply: str
    source_chapter: str
    grounded_context: Optional[str] = None
    audio_text: str

class GenerateQuestionsRequest(BaseModel):
    topic_id: int
    difficulty: str = "medium"
    count: int = Field(3, ge=1, le=10)
    language: str = "hi"

# Classroom Schemas
class ClassCreate(BaseModel):
    name: str

class ClassJoin(BaseModel):
    join_code: str

class ClassOut(BaseModel):
    id: int
    name: str
    join_code: str
    teacher_id: int
    student_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class StudentMasteryRow(BaseModel):
    student_id: int
    name: str
    phone_or_email: str
    average_mastery: float
    questions_attempted: int
    weakest_topic: str
    last_active: Optional[datetime] = None

class WeakTopicStat(BaseModel):
    topic_id: int
    topic_name: str
    subject: str
    average_mastery: float
    attempts_count: int

class TeacherDashboardResponse(BaseModel):
    class_id: int
    class_name: str
    join_code: str
    total_students: int
    class_average_mastery: float
    weakest_topics: List[WeakTopicStat]
    students_mastery: List[StudentMasteryRow]
    inactive_students: List[StudentMasteryRow]

# Progress Schemas
class Badge(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked: bool
    unlocked_at: Optional[str] = None

class TopicMasteryProgress(BaseModel):
    topic_id: int
    topic_name: str
    subject: str
    chapter: str
    mastery_score: float
    level: str  # 'Novice', 'Developing', 'Master'
    total_attempts: int
    correct_attempts: int

class AttemptHistoryItem(BaseModel):
    attempt_id: int
    question_text: str
    subject: str
    topic_name: str
    is_correct: bool
    time_taken: int
    created_at: datetime

class StudentProgressOut(BaseModel):
    total_attempts: int
    total_correct: int
    overall_accuracy: float
    current_streak: int
    highest_streak: int
    badges: List[Badge]
    topic_masteries: List[TopicMasteryProgress]
    recent_attempts: List[AttemptHistoryItem]


# Assignment Schemas
class AssignmentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    classroom_id: int
    subject: str = Field("Math", max_length=50)
    topic_id: Optional[int] = None
    due_date: Optional[datetime] = None
    instructions: Optional[str] = None
    question_ids: List[int] = []


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|active|completed)$")
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None


class AssignmentOut(BaseModel):
    id: int
    title: str
    classroom_id: int
    classroom_name: Optional[str] = None
    teacher_id: int
    subject: str
    topic_id: Optional[int] = None
    topic_name: Optional[str] = None
    due_date: Optional[datetime] = None
    instructions: Optional[str] = None
    status: str
    question_count: int = 0
    questions: Optional[List[QuestionOut]] = None
    total_students: int = 0
    submissions_count: int = 0
    average_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Lesson Plan Schemas
class LessonPlanRequest(BaseModel):
    topic_id: int
    subject: Optional[str] = "Math"
    class_level: Optional[int] = 8
    duration_minutes: Optional[int] = 45
    objectives: Optional[str] = None
    rural_context: Optional[str] = None
    language: Optional[str] = "hi"


class LessonPlanResponse(BaseModel):
    topic_name: str
    subject: str
    class_level: int
    duration_minutes: int
    language: str
    ai_engine: str
    objectives: List[str]
    rural_hook: str
    teaching_steps: List[Dict[str, Any]]
    classroom_activity: Dict[str, Any]
    common_misconceptions: List[Dict[str, str]]
    quick_assessments: List[Dict[str, Any]]
    homework: str

