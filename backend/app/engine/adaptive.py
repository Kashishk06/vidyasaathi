import random
from typing import List, Dict, Any, Optional

def calculate_new_mastery(current_score: float, is_correct: bool) -> float:
    """
    Updates the student's mastery score for a topic based on answer correctness.
    
    Formula:
      - Correct: mastery += 0.1 * (1 - mastery)
      - Wrong:   mastery -= 0.15 * mastery
    
    The resulting score is clamped between 0.0 and 1.0.
    """
    score = max(0.0, min(1.0, float(current_score)))
    if is_correct:
        new_score = score + 0.10 * (1.0 - score)
    else:
        new_score = score - 0.15 * score
    
    return round(max(0.0, min(1.0, new_score)), 4)


def get_difficulty_for_mastery(mastery: float) -> str:
    """
    Maps mastery score to question difficulty:
      - mastery < 0.4: "easy"
      - 0.4 <= mastery <= 0.7: "medium"
      - mastery > 0.7: "hard"
    """
    score = max(0.0, min(1.0, float(mastery)))
    if score < 0.40:
        return "easy"
    elif score <= 0.70:
        return "medium"
    else:
        return "hard"


def select_next_topic(topic_scores: List[Dict[str, Any]], exploration_rate: float = 0.2) -> Optional[int]:
    """
    Selects the next topic to reinforce.
    Picks the topic with the lowest mastery score to close learning gaps,
    with an exploration factor to maintain engagement across the syllabus.
    
    topic_scores: List of dicts, each containing:
      {"topic_id": int, "score": float}
    """
    if not topic_scores:
        return None
    
    # Sort primarily by lowest score
    sorted_topics = sorted(topic_scores, key=lambda x: x.get("score", 0.0))
    
    # Exploration vs Exploitation (reinforce weakest vs explore)
    if len(sorted_topics) > 1 and random.random() < exploration_rate:
        # Explore from the bottom half
        pool_size = max(2, len(sorted_topics) // 2)
        selected = random.choice(sorted_topics[:pool_size])
        return selected["topic_id"]
    
    return sorted_topics[0]["topic_id"]


def calculate_streak(is_correct_history: List[bool]) -> int:
    """
    Calculates the current streak of consecutive correct answers,
    reading from latest to oldest.
    """
    streak = 0
    for is_correct in reversed(is_correct_history):
        if is_correct:
            streak += 1
        else:
            break
    return streak


def evaluate_badges(
    total_attempts: int,
    current_streak: int,
    mastery_scores: List[float]
) -> List[Dict[str, Any]]:
    """
    Evaluates which badges a student has unlocked based on learning history.
    """
    badges = [
        {
            "id": "first_step",
            "title": "First Step (पहला कदम)",
            "description": "Completed your first practice question!",
            "icon": "🌱",
            "unlocked": total_attempts >= 1
        },
        {
            "id": "streak_3",
            "title": "On Fire (3 की लड़ी)",
            "description": "Answered 3 questions correctly in a row!",
            "icon": "🔥",
            "unlocked": current_streak >= 3
        },
        {
            "id": "streak_5",
            "title": "Super Scholar (5 की लड़ी)",
            "description": "5 consecutive correct answers!",
            "icon": "⚡",
            "unlocked": current_streak >= 5
        },
        {
            "id": "topic_master",
            "title": "Topic Champion (विषय महारथी)",
            "description": "Achieved >70% mastery in any topic!",
            "icon": "🏆",
            "unlocked": any(s >= 0.70 for s in mastery_scores) if mastery_scores else False
        },
        {
            "id": "practice_centurion",
            "title": "Practice Hero (अभ्यास वीर)",
            "description": "Completed 15 or more practice questions!",
            "icon": "🎯",
            "unlocked": total_attempts >= 15
        }
    ]
    return badges
