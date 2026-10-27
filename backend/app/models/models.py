import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Table
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone_or_email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student", nullable=False)  # Approved roles: 'student', 'teacher', 'parent', 'super_admin'
    class_level = Column(Integer, default=8, nullable=True)        # 6 to 10
    language = Column(String(20), default="hi", nullable=False)    # 'hi', 'en', 'mr', 'bn', 'ta'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Teacher relationships
    classes_taught = relationship("ClassRoom", back_populates="teacher", cascade="all, delete-orphan")

    # Student relationships
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="student", cascade="all, delete-orphan")
    masteries = relationship("Mastery", back_populates="student", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="student", cascade="all, delete-orphan")


class ClassRoom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    join_code = Column(String(12), unique=True, index=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("User", back_populates="classes_taught")
    enrollments = relationship("Enrollment", back_populates="classroom", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="enrollments")
    classroom = relationship("ClassRoom", back_populates="enrollments")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(50), nullable=False)      # e.g., 'Math', 'Science'
    class_level = Column(Integer, default=8, nullable=False)
    chapter = Column(String(100), nullable=False)
    name = Column(String(120), nullable=False)

    questions = relationship("Question", back_populates="topic", cascade="all, delete-orphan")
    masteries = relationship("Mastery", back_populates="topic", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    text = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)       # JSON serialized list of 4 choices
    correct_index = Column(Integer, nullable=False)    # 0, 1, 2, or 3
    difficulty = Column(String(20), default="medium")  # 'easy', 'medium', 'hard'
    language = Column(String(20), default="hi")        # 'hi', 'en', 'mr', 'bn', 'ta'
    explanation = Column(Text, nullable=False)
    status = Column(String(20), default="approved")    # 'approved', 'pending'
    source = Column(String(50), default="curated")     # 'curated', 'ai_generated', 'reported'
    created_at = Column(DateTime, default=datetime.utcnow)

    topic = relationship("Topic", back_populates="questions")
    attempts = relationship("Attempt", back_populates="question", cascade="all, delete-orphan")

    @property
    def options(self):
        try:
            return json.loads(self.options_json)
        except Exception:
            return []

    @options.setter
    def options(self, val):
        self.options_json = json.dumps(val)


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_index = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Integer, default=0)            # in seconds
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="attempts")
    question = relationship("Question", back_populates="attempts")


class Mastery(Base):
    __tablename__ = "masteries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    score = Column(Float, default=0.0, nullable=False) # 0.0 to 1.0
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("User", back_populates="masteries")
    topic = relationship("Topic", back_populates="masteries")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), nullable=False)          # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="chat_messages")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(50), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    due_date = Column(DateTime, nullable=True)
    instructions = Column(Text, nullable=True)
    status = Column(String(20), default="active")  # 'draft', 'active', 'completed'
    created_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("ClassRoom")
    teacher = relationship("User")
    topic = relationship("Topic")
    questions = relationship("AssignmentQuestion", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentQuestion(Base):
    __tablename__ = "assignment_questions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    assignment = relationship("Assignment", back_populates="questions")
    question = relationship("Question")


class ParentStudent(Base):
    __tablename__ = "parent_students"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    parent = relationship("User", foreign_keys=[parent_id])
    student = relationship("User", foreign_keys=[student_id])

