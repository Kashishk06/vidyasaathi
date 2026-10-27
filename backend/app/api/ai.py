import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Topic, Question, ChatMessage
from app.schemas.schemas import (
    ExplainRequest,
    ExplainResponse,
    ChatRequest,
    ChatResponse,
    GenerateQuestionsRequest,
    QuestionOut,
    LessonPlanRequest,
    LessonPlanResponse
)
from app.auth import get_current_user, get_current_teacher
from app.ai.service import ai_provider
from app.rag.retriever import retriever

router = APIRouter(prefix="/ai", tags=["AI Tutoring & Generation"])

@router.post("/explain", response_model=ExplainResponse)
async def explain_concept(
    req: ExplainRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a clear, step-by-step explanation grounded in real-life Indian rural examples
    (farming, local markets, tube wells, solar panels, etc.) in the user's chosen language.
    """
    lang = req.language or current_user.language or "hi"
    concept_title = req.concept_title or "Key Concept"
    context = ""

    if req.question_id:
        question = db.query(Question).filter(Question.id == req.question_id).first()
        if question:
            concept_title = question.text
            context = f"Question: {question.text}\nExplanation context: {question.explanation}"
            if question.topic:
                concept_title = f"{question.topic.name}: {concept_title}"

    elif req.topic_id:
        topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
        if topic:
            concept_title = f"{topic.subject} - {topic.name}"
            # Retrieve syllabus context for topic
            chunks = retriever.retrieve(f"{topic.subject} {topic.name}", top_k=2)
            if chunks:
                context = "\n".join([c["text"] for c in chunks])

    if not context:
        chunks = retriever.retrieve(concept_title, top_k=2)
        if chunks:
            context = "\n".join([c["text"] for c in chunks])

    explanation_data = await ai_provider.generate_explanation(
        concept_title=concept_title,
        context=context,
        language=lang
    )

    return ExplainResponse(
        title=explanation_data.get("title", concept_title),
        explanation=explanation_data.get("explanation", ""),
        rural_example=explanation_data.get("rural_example", ""),
        key_takeaway=explanation_data.get("key_takeaway", ""),
        audio_text=explanation_data.get("audio_text", ""),
        language=lang
    )


@router.post("/chat", response_model=ChatResponse)
async def doubt_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Doubt Clearing Assistant: Takes a student's query, retrieves syllabus ground truth,
    checks safety guardrails, and provides an age-appropriate answer with source chapter citations.
    """
    lang = req.language or current_user.language or "hi"
    
    # RAG Retrieval
    chunks = retriever.retrieve(req.message, top_k=2)
    syllabus_context = ""
    source_chapter = "Class 8 Curriculum"
    if chunks:
        syllabus_context = "\n".join([c["text"] for c in chunks])
        source_chapter = chunks[0]["chapter"]

    result = await ai_provider.chat_doubt(
        user_query=req.message,
        syllabus_context=syllabus_context,
        source_chapter=source_chapter,
        language=lang
    )

    # Save to chat history if student
    if current_user.role == "student":
        msg_user = ChatMessage(student_id=current_user.id, role="user", content=req.message)
        msg_bot = ChatMessage(student_id=current_user.id, role="assistant", content=result["reply"])
        db.add(msg_user)
        db.add(msg_bot)
        db.commit()

    return ChatResponse(
        reply=result["reply"],
        source_chapter=result["source_chapter"],
        grounded_context=syllabus_context[:200] + "..." if len(syllabus_context) > 200 else syllabus_context,
        audio_text=result["audio_text"]
    )


@router.post("/generate-questions")
async def generate_questions_for_teacher(
    req: GenerateQuestionsRequest,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Teacher Tool: Uses Granite AI / Watsonx to draft new curriculum questions for a topic.
    Generated questions are saved with 'pending' status for teacher verification.
    """
    topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    # Retrieve syllabus excerpts
    chunks = retriever.retrieve(f"{topic.subject} {topic.name}", top_k=3)
    syllabus_context = "\n".join([c["text"] for c in chunks]) if chunks else topic.name

    generated_raw = await ai_provider.generate_questions(
        topic_name=topic.name,
        subject=topic.subject,
        class_level=topic.class_level,
        difficulty=req.difficulty,
        language=req.language,
        syllabus_context=syllabus_context,
        count=req.count
    )

    created_questions = []
    for item in generated_raw:
        q = Question(
            topic_id=topic.id,
            text=item["text"],
            options_json=json.dumps(item["options"]),
            correct_index=item["correct_index"],
            difficulty=item.get("difficulty", req.difficulty),
            language=item.get("language", req.language),
            explanation=item.get("explanation", ""),
            status="pending",
            source="ai_generated"
        )
        db.add(q)
        created_questions.append(q)

    db.commit()

    return {
        "message": f"Successfully generated {len(created_questions)} questions in pending review.",
        "count": len(created_questions),
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "options": q.options,
                "correct_index": q.correct_index,
                "difficulty": q.difficulty,
                "language": q.language,
                "status": q.status
            }
            for q in created_questions
        ]
    }


@router.post("/lesson-plan", response_model=LessonPlanResponse)
async def generate_lesson_plan_for_teacher(
    req: LessonPlanRequest,
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Teacher Tool: Generates structured, pedagogical lesson plans grounded in rural Indian analogies.
    Uses IBM watsonx.ai Granite if configured, or culturally-grounded MockProvider offline fallback.
    """
    topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    chunks = retriever.retrieve(f"{topic.subject} {topic.name}", top_k=2)
    syllabus_context = "\n".join([c["text"] for c in chunks]) if chunks else topic.name

    plan = await ai_provider.generate_lesson_plan(
        topic_name=topic.name,
        subject=topic.subject,
        class_level=topic.class_level or req.class_level or 8,
        duration_minutes=req.duration_minutes or 45,
        objectives=req.objectives or "",
        rural_context=req.rural_context or "",
        language=req.language or "hi",
        syllabus_context=syllabus_context
    )

    return LessonPlanResponse(**plan)

