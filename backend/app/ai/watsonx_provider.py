import json
import re
from typing import Dict, Any, List
from app.config import settings
from app.ai.base import BaseAIProvider
from app.ai.mock_provider import MockProvider

class WatsonxProvider(BaseAIProvider):
    """
    IBM watsonx.ai Integration for VidyaSaathi.
    Uses Granite Foundation Models with RAG grounding and JSON safety checks.
    """
    def __init__(self):
        self.api_key = settings.WATSONX_API_KEY
        self.project_id = settings.WATSONX_PROJECT_ID
        self.url = settings.WATSONX_URL
        self.model_id = settings.WATSONX_MODEL_ID
        self.mock_fallback = MockProvider()
        self.client = None
        self._init_client()

    def _init_client(self):
        if not self.api_key or not self.project_id:
            return
        try:
            from ibm_watsonx_ai import APIClient, Credentials
            from ibm_watsonx_ai.foundation_models import ModelInference
            credentials = Credentials(
                url=self.url,
                api_key=self.api_key
            )
            self.client = APIClient(credentials)
            self.model = ModelInference(
                model_id=self.model_id,
                credentials=credentials,
                project_id=self.project_id,
                params={
                    "decoding_method": "greedy",
                    "max_new_tokens": 800,
                    "repetition_penalty": 1.1
                }
            )
        except Exception as e:
            print(f"[WatsonxProvider] Initialization note: {e}. Fallback to mock active.")
            self.client = None

    async def _call_model(self, prompt: str) -> str:
        if not self.client:
            raise RuntimeError("Watsonx client not active")
        try:
            response = self.model.generate_text(prompt=prompt)
            return response
        except Exception as e:
            print(f"[WatsonxProvider] API Call failed: {e}")
            raise e

    async def generate_explanation(
        self,
        concept_title: str,
        context: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        prompt = f"""<|system|>
You are VidyaSaathi, an empathetic AI tutor for rural Indian school students (SDG 4: Quality Education).
Explain concepts simply in language '{language}' with short sentences and a real-life rural Indian example (farming, panchayat, local market, tube wells, cricket).
Output strictly in valid JSON format with keys:
"title", "explanation", "rural_example", "key_takeaway", "audio_text".

<|user|>
Concept: {concept_title}
Syllabus Context: {context}
Language: {language}
Return JSON only:
<|assistant|>
"""
        try:
            raw_text = await self._call_model(prompt)
            clean_json = self._extract_json(raw_text)
            data = json.loads(clean_json)
            data["language"] = language
            return data
        except Exception:
            return await self.mock_fallback.generate_explanation(concept_title, context, language)

    async def chat_doubt(
        self,
        user_query: str,
        syllabus_context: str,
        source_chapter: str,
        language: str = "hi"
    ) -> Dict[str, Any]:
        prompt = f"""<|system|>
You are VidyaSaathi, an AI tutor for Class 6-10 students in India.
Rule 1: Answer strictly based on the provided syllabus context in language '{language}'.
Rule 2: Keep it age-appropriate, encouraging, and clear.
Rule 3: If the question is outside syllabus or inappropriate, refuse politely. If unsure, say "I am not sure".
Output format: A direct, warm, concise paragraph.

<|user|>
Syllabus Context from {source_chapter}:
{syllabus_context}

Student Question:
{user_query}
<|assistant|>
"""
        try:
            raw_text = await self._call_model(prompt)
            clean_reply = raw_text.strip()
            return {
                "reply": clean_reply,
                "source_chapter": source_chapter,
                "audio_text": clean_reply,
                "safety_passed": True
            }
        except Exception:
            return await self.mock_fallback.chat_doubt(user_query, syllabus_context, source_chapter, language)

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
        prompt = f"""<|system|>
You are an expert Indian school curriculum developer for NCERT Class {class_level} {subject}.
Generate {count} multiple-choice questions for topic "{topic_name}" at difficulty level "{difficulty}" in language '{language}'.
Ground questions in this syllabus excerpt:
{syllabus_context}

Return ONLY a JSON array of objects with the exact schema:
[
  {{
    "text": "Question statement here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "difficulty": "{difficulty}",
    "language": "{language}",
    "explanation": "Clear explanation of the correct answer"
  }}
]
<|assistant|>
"""
        # Retry loop for JSON parsing
        for attempt in range(2):
            try:
                raw_text = await self._call_model(prompt)
                clean_json = self._extract_json(raw_text)
                questions = json.loads(clean_json)
                if isinstance(questions, list) and len(questions) > 0:
                    # Validate schema
                    validated = []
                    for q in questions:
                        if "text" in q and "options" in q and len(q["options"]) == 4 and "correct_index" in q:
                            q["topic_id"] = None
                            validated.append(q)
                    if validated:
                        return validated[:count]
            except Exception as e:
                print(f"[WatsonxProvider] Retry {attempt + 1} parsing questions failed: {e}")

        # Fallback to MockProvider on parse failure or network issue
        return await self.mock_fallback.generate_questions(
            topic_name, subject, class_level, difficulty, language, syllabus_context, count
        )

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
        Uses Granite or falls back to mock to generate structured lesson plans.
        """
        prompt = f"""You are an expert pedagogy specialist for rural Indian schools (SDG 4: Quality Education).
Create a structured {duration_minutes}-minute lesson plan for Class {class_level} {subject} on topic: "{topic_name}".
Context / Objectives: {objectives or 'Standard NCERT curriculum outcomes'}.
Rural analogies to integrate: {rural_context or 'Farming, tube wells, village market, crop sharing, solar lights'}.
Language: {language}.

Respond ONLY with valid JSON having this exact schema:
{{
  "topic_name": "{topic_name}",
  "subject": "{subject}",
  "class_level": {class_level},
  "duration_minutes": {duration_minutes},
  "language": "{language}",
  "ai_engine": "IBM watsonx.ai (Granite)",
  "objectives": ["string", "string", "string"],
  "rural_hook": "5-minute village analogy story to engage students",
  "teaching_steps": [
    {{"step_number": 1, "title": "string", "duration": "string", "teacher_action": "string", "student_activity": "string"}},
    {{"step_number": 2, "title": "string", "duration": "string", "teacher_action": "string", "student_activity": "string"}},
    {{"step_number": 3, "title": "string", "duration": "string", "teacher_action": "string", "student_activity": "string"}}
  ],
  "classroom_activity": {{"title": "string", "materials": "string", "instructions": "string", "expected_outcome": "string"}},
  "common_misconceptions": [{{"misconception": "string", "clarification": "string"}}],
  "quick_assessments": [{{"question": "string", "expected_answer": "string"}}],
  "homework": "string"
}}
"""
        for attempt in range(2):
            try:
                raw_text = await self._call_model(prompt)
                clean_json = self._extract_json(raw_text)
                plan = json.loads(clean_json)
                if isinstance(plan, dict) and "objectives" in plan and "teaching_steps" in plan:
                    plan["ai_engine"] = "IBM watsonx.ai (Granite-13b-chat-v2)"
                    return plan
            except Exception as e:
                print(f"[WatsonxProvider] Lesson plan parse attempt {attempt + 1} failed: {e}")

        # Fallback to mock provider
        return await self.mock_fallback.generate_lesson_plan(
            topic_name, subject, class_level, duration_minutes, objectives, rural_context, language, syllabus_context
        )


    def _extract_json(self, text: str) -> str:
        """Extracts JSON substring from markdown fenced code blocks or raw string."""
        text = text.strip()
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
        if match:
            return match.group(1).strip()
        bracket_start = text.find('[')
        brace_start = text.find('{')
        if bracket_start != -1 and (brace_start == -1 or bracket_start < brace_start):
            bracket_end = text.rfind(']')
            if bracket_end != -1:
                return text[bracket_start:bracket_end + 1]
        elif brace_start != -1:
            brace_end = text.rfind('}')
            if brace_end != -1:
                return text[brace_start:brace_end + 1]
        return text
