import requests
import json
import sys

BASE = 'http://localhost:8000'

def test_all():
    print("Testing Teacher Backend Endpoints...")
    
    # 1. Login
    r = requests.post(f'{BASE}/auth/login', json={'phone_or_email': 'teacher@vidyasaathi.in', 'password': 'password123'})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    token = r.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("[1/8] Teacher Login: PASS")

    # 2. Classes
    r = requests.get(f'{BASE}/classes', headers=headers)
    assert r.status_code == 200, f"Classes failed: {r.status_code} {r.text}"
    classes = r.json()
    print(f"[2/8] Classes List: PASS ({len(classes)} classes found)")
    cid = classes[0]['id'] if classes else 1

    # 3. Class dashboard / analytics
    r = requests.get(f'{BASE}/classes/{cid}/dashboard', headers=headers)
    assert r.status_code == 200, f"Dashboard failed: {r.status_code} {r.text}"
    dash = r.json()
    students_count = dash.get("total_students", 0)
    print(f"[3/8] Class Analytics Dashboard: PASS (Total Students: {students_count})")

    # 4. Topics
    r = requests.get(f'{BASE}/topics', headers=headers)
    assert r.status_code == 200, f"Topics failed: {r.status_code} {r.text}"
    topics = r.json()
    tid = topics[0]['id'] if topics else 1
    print(f"[4/8] Topics List: PASS ({len(topics)} topics)")

    # 5. AI Question Generator
    r = requests.post(f'{BASE}/ai/generate-questions', headers=headers, json={
        'topic_id': tid,
        'difficulty': 'medium',
        'language': 'en',
        'count': 2
    })
    assert r.status_code == 200, f"AI questions failed: {r.status_code} {r.text}"
    gen_res = r.json()
    count_gen = gen_res.get("count", 0)
    print(f"[5/8] AI Question Generator: PASS ({count_gen} questions generated)")

    # 6. Lesson Plan Assistant
    r = requests.post(f'{BASE}/ai/lesson-plan', headers=headers, json={
        'topic_id': tid,
        'class_level': 8,
        'duration_minutes': 40,
        'language': 'en',
        'rural_context': 'Village farms and tube wells'
    })
    assert r.status_code == 200, f"Lesson plan failed: {r.status_code} {r.text}"
    plan = r.json()
    sections = len(plan.get("sections", []))
    print(f"[6/8] Lesson Plan Generator: PASS (Sections generated: {sections})")

    # 7. Content Review Queue
    r = requests.get(f'{BASE}/questions?status=pending', headers=headers)
    assert r.status_code == 200, f"Questions review failed: {r.status_code} {r.text}"
    review_qs = r.json()
    print(f"[7/8] Content Review Queue: PASS ({len(review_qs)} pending questions)")

    # 8. Assignments
    r = requests.get(f'{BASE}/assignments', headers=headers)
    assert r.status_code == 200, f"Assignments failed: {r.status_code} {r.text}"
    assignments = r.json()
    print(f"[8/8] Assignments & Tests: PASS ({len(assignments)} assignments)")

    print("\n==============================================")
    print("ALL 8 TEACHER BACKEND APIS TESTED & FUNCTIONAL!")
    print("==============================================")

if __name__ == "__main__":
    test_all()
