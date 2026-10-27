import pytest
from fastapi.testclient import TestClient
from app.main import app
from seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database()

client = TestClient(app)

def test_root_health():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "VidyaSaathi"
    assert data["status"] == "online"

def test_student_login():
    response = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" == "access_token" in data
    assert data["user"]["role"] == "student"

def test_teacher_login():
    response = client.post(
        "/auth/login",
        json={"phone_or_email": "teacher@vidyasaathi.in", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "teacher"

def test_get_topics():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/topics", headers=headers)
    assert response.status_code == 200
    topics = response.json()
    assert len(topics) >= 4
    assert any(t["name"] == "Fractions (भिन्न)" for t in topics)

def test_adaptive_quiz_flow():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch next adaptive question
    next_res = client.get("/quiz/next?subject=Math", headers=headers)
    assert next_res.status_code == 200
    question = next_res.json()
    assert "text" in question
    assert len(question["options"]) == 4

    # 2. Submit answer
    answer_res = client.post(
        "/quiz/answer",
        json={
            "question_id": question["id"],
            "selected_index": 0,
            "time_taken": 12
        },
        headers=headers
    )
    assert answer_res.status_code == 200
    ans_data = answer_res.json()
    assert "is_correct" in ans_data
    assert "new_mastery" in ans_data
    assert "explanation" in ans_data

def test_ai_explanation():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/ai/explain",
        json={"concept_title": "Fractions", "language": "hi"},
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "explanation" in data
    assert "rural_example" in data

def test_ai_doubt_chat():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/ai/chat",
        json={"message": "What is stomata?", "language": "en"},
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "source_chapter" in data
    assert "stomata" in data["reply"].lower()

def test_student_progress():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "aarav@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/progress/me", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_attempts"] > 0
    assert "badges" in data
    assert len(data["topic_masteries"]) > 0

def test_teacher_dashboard():
    login_res = client.post(
        "/auth/login",
        json={"phone_or_email": "teacher@vidyasaathi.in", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List classes
    classes_res = client.get("/classes", headers=headers)
    assert classes_res.status_code == 200
    classes = classes_res.json()
    assert len(classes) >= 1
    class_id = classes[0]["id"]

    # View dashboard
    dash_res = client.get(f"/classes/{class_id}/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_students"] == 5
    assert len(dash_data["weakest_topics"]) > 0
    assert len(dash_data["students_mastery"]) == 5
