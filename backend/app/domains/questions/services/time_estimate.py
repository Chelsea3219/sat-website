def time_estimate(difficulty: str):
    difficulty_to_time = { "easy": 30, "medium":60, "hard":90}
    return difficulty_to_time[difficulty]