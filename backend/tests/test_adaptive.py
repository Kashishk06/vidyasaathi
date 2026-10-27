import pytest
from app.engine.adaptive import (
    calculate_new_mastery,
    get_difficulty_for_mastery,
    select_next_topic,
    calculate_streak,
    evaluate_badges
)

def test_calculate_new_mastery_correct():
    # If starting at 0.5 and correct:
    # new_score = 0.5 + 0.1 * (1 - 0.5) = 0.55
    res = calculate_new_mastery(0.5, True)
    assert res == 0.55

    # If starting at 0.0 and correct:
    # 0.0 + 0.1 * 1.0 = 0.1
    assert calculate_new_mastery(0.0, True) == 0.10

    # Upper boundary clamp
    assert calculate_new_mastery(1.0, True) == 1.0

def test_calculate_new_mastery_wrong():
    # If starting at 0.5 and wrong:
    # new_score = 0.5 - 0.15 * 0.5 = 0.5 - 0.075 = 0.425
    res = calculate_new_mastery(0.5, False)
    assert res == 0.425

    # If starting at 0.0 and wrong:
    assert calculate_new_mastery(0.0, False) == 0.0

def test_get_difficulty_for_mastery():
    assert get_difficulty_for_mastery(0.0) == "easy"
    assert get_difficulty_for_mastery(0.39) == "easy"
    assert get_difficulty_for_mastery(0.40) == "medium"
    assert get_difficulty_for_mastery(0.70) == "medium"
    assert get_difficulty_for_mastery(0.71) == "hard"
    assert get_difficulty_for_mastery(1.0) == "hard"

def test_select_next_topic():
    topics = [
        {"topic_id": 1, "score": 0.8},
        {"topic_id": 2, "score": 0.2}, # Weakest
        {"topic_id": 3, "score": 0.6},
    ]
    # With exploration_rate = 0.0, must strictly pick topic 2
    selected = select_next_topic(topics, exploration_rate=0.0)
    assert selected == 2

    # Empty case
    assert select_next_topic([]) is None

def test_calculate_streak():
    assert calculate_streak([True, True, True]) == 3
    assert calculate_streak([True, False, True, True]) == 2
    assert calculate_streak([True, True, False]) == 0
    assert calculate_streak([]) == 0

def test_evaluate_badges():
    # 0 attempts
    badges_empty = evaluate_badges(0, 0, [0.0])
    unlocked_empty = [b["id"] for b in badges_empty if b["unlocked"]]
    assert len(unlocked_empty) == 0

    # 1 attempt -> first step unlocked
    badges_1 = evaluate_badges(1, 1, [0.1])
    unlocked_1 = [b["id"] for b in badges_1 if b["unlocked"]]
    assert "first_step" in unlocked_1

    # Streak of 3
    badges_3 = evaluate_badges(3, 3, [0.3])
    unlocked_3 = [b["id"] for b in badges_3 if b["unlocked"]]
    assert "streak_3" in unlocked_3

    # High mastery
    badges_master = evaluate_badges(10, 2, [0.75, 0.4])
    unlocked_master = [b["id"] for b in badges_master if b["unlocked"]]
    assert "topic_master" in unlocked_master
