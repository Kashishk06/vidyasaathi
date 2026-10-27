from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIProvider(ABC):
    """
    Abstract AI Provider Interface for VidyaSaathi tutoring engine.
    """
    @abstractmethod
    async def generate_explanation(
        self,
        concept_title: str,
        context: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        """
        Generates a step-by-step conceptual explanation with an authentic rural Indian example.
        Must return:
        {
            "title": str,
            "explanation": str,
            "rural_example": str,
            "key_takeaway": str,
            "audio_text": str,
            "language": str
        }
        """
        pass

    @abstractmethod
    async def chat_doubt(
        self,
        user_query: str,
        syllabus_context: str,
        source_chapter: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        """
        Answers student doubt strictly grounded in syllabus.
        Must return:
        {
            "reply": str,
            "source_chapter": str,
            "audio_text": str,
            "safety_passed": bool
        }
        """
        pass

    @abstractmethod
    async def generate_questions(
        self,
        topic_name: str,
        subject: str,
        class_level: int,
        difficulty: str,
        language: str,
        syllabus_context: str,
        count: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Generates multiple-choice questions in strict JSON format.
        Must return a list of dicts:
        [
            {
                "text": str,
                "options": List[str], # 4 choices
                "correct_index": int, # 0..3
                "difficulty": str,
                "language": str,
                "explanation": str
            }
        ]
        """
        pass

    @abstractmethod
    async def generate_lesson_plan(
        self,
        topic_name: str,
        subject: str,
        class_level: int,
        duration_minutes: int,
        objectives: str = "",
        rural_context: str = "",
        language: str = "hi",
        syllabus_context: str = ""
    ) -> Dict[str, Any]:
        """
        Generates a structured, culturally grounded lesson plan for teachers.
        """
        pass
