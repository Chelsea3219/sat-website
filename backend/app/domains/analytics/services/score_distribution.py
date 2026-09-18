



def score_distribution(difficulty, is_correct):
    correct_score = {"easy":2, "medium":3, "hard":5 }

    if is_correct:
        return correct_score[difficulty]
    else:
        return 0