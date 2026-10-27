import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def teacher_auth():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "teacher@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_teacher_create_question(teacher_auth):
    # Fetch first topic
    topics_res = client.get("/topics", headers=teacher_auth)
    topic_id = topics_res.json()[0]["id"]

    res = client.post(
        "/questions",
        json={
            "topic_id": topic_id,
            "text": "परीक्षण अभ्यास प्रश्न: 2/5 का प्रतिशत क्या है?",
            "options": ["40%", "20%", "50%", "25%"],
            "correct_index": 0,
            "difficulty": "medium",
            "language": "hi",
            "explanation": "2/5 * 100 = 40%."
        },
        headers=teacher_auth
    )
    assert res.status_code == 201
    data = res.json()
    assert data["text"] == "परीक्षण अभ्यास प्रश्न: 2/5 का प्रतिशत क्या है?"
    assert data["status"] == "approved"
    assert data["source"] == "teacher_created"

def test_teacher_generate_lesson_plan(teacher_auth):
    topics_res = client.get("/topics", headers=teacher_auth)
    topic_id = topics_res.json()[0]["id"]

    res = client.post(
        "/ai/lesson-plan",
        json={
            "topic_id": topic_id,
            "subject": "Math",
            "class_level": 8,
            "duration_minutes": 45,
            "objectives": "छात्र भिन्न समझें",
            "rural_context": "कृषि एवं फसल",
            "language": "hi"
        },
        headers=teacher_auth
    )
    assert res.status_code == 200
    plan = res.json()
    assert "objectives" in plan
    assert len(plan["objectives"]) >= 2
    assert "rural_hook" in plan
    assert len(plan["teaching_steps"]) >= 2
    assert "classroom_activity" in plan

def test_teacher_assignment_lifecycle(teacher_auth):
    # 1. Get teacher classroom
    classes_res = client.get("/classes", headers=teacher_auth)
    classroom_id = classes_res.json()[0]["id"]

    # 2. Get questions to link
    q_res = client.get("/questions?status=approved", headers=teacher_auth)
    q_ids = [q["id"] for q in q_res.json()[:2]]

    # 3. Create assignment
    create_res = client.post(
        "/assignments",
        json={
            "title": "सत्र 1 गणित टेस्ट",
            "classroom_id": classroom_id,
            "subject": "Math",
            "instructions": "समय 20 मिनट",
            "question_ids": q_ids
        },
        headers=teacher_auth
    )
    assert create_res.status_code == 201
    assign_data = create_res.json()
    assign_id = assign_data["id"]
    assert assign_data["title"] == "सत्र 1 गणित टेस्ट"
    assert assign_data["question_count"] == len(q_ids)

    # 4. List assignments
    list_res = client.get(f"/assignments?classroom_id={classroom_id}", headers=teacher_auth)
    assert list_res.status_code == 200
    all_assignments = list_res.json()
    assert any(a["id"] == assign_id for a in all_assignments)

    # 5. Get assignment detail
    detail_res = client.get(f"/assignments/{assign_id}", headers=teacher_auth)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["title"] == "सत्र 1 गणित टेस्ट"
    assert len(detail["students"]) >= 1

    # 6. Delete assignment
    del_res = client.delete(f"/assignments/{assign_id}", headers=teacher_auth)
    assert del_res.status_code == 200
