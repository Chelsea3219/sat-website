# ------------------------------------------------------------------------------------------------------------------------------------------------------------------
ATTEMPT_CREDIT = {1:1.0, 2:0.5, 3:0.2}  #4+ attempts -->> 0
def attempt_factor(num_attempts: int, question_type: str) -> float:
    """
    Each extra attempt should cut credit sharply, because it's the clearest signal the student didn't know the answer. 
    For MC with 4 options, the 4th attempt is guaranteed correct by elimination, so it's should be worth nothing.
    For free responses, return 1/num_attempts
    """
    if question_type == "multiple choice":
        return ATTEMPT_CREDIT.get(num_attempts, 0.0)
    else:
        return 1/num_attempts


# ------------------------------------------------------------------------------------------------------------------------------------------------------------------
EXPECTED_SECONDS = {"easy":45, "medium":75, "hard":100}
TIME_FLOOR = 0.7 # slow-but correct keets at least 70% credit
def time_factor(seconds: float, difficulty: str) -> float:
    """
    Penalize time well past what's expected for that difficulty, decay gradually and never drop below a floor. 
    """
    expected = EXPECTED_SECONDS.get(difficulty, 75)
    if seconds <= expected:
        return 1.0
    overtime = (seconds - expected) / expected #1.0 = took twixe as long 
    return max(TIME_FLOOR, 1-0.15*overtime)


# ------------------------------------------------------------------------------------------------------------------------------------------------------------------
def score_distribution(difficulty, is_correct):
    correct_score = {"easy":2, "medium":3, "hard":5 }

    if is_correct:
        return correct_score[difficulty]
    else:
        return 0