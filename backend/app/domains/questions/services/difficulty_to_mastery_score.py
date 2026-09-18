# Fallback if there is not enough questions for the selected difficulty -----------------------------------------------------------------
DIFFICULTY_ORDER = ["easy", "medium", "hard"]
def difficulties_to_try(primary_difficulty):
    """Primary difficulty first, then one tier easier as a fallback."""
    idx = DIFFICULTY_ORDER.index(primary_difficulty)
    fallback_idx = max(0, idx - 1)
    if fallback_idx == idx:
        return [primary_difficulty]
    return [primary_difficulty, DIFFICULTY_ORDER[fallback_idx]]



# Mastery Score Classfication ----------------------------------------------------------------------------------------------------------
def mastery_score_to_difficulty(mastery_score: int):
    """
    Converts the student's numeric mastery score into a difficulty label 
    """
    mastery_score = 0 if mastery_score is None else mastery_score
    if mastery_score < 60: # ~500/800
        difficulty = "easy"
    elif mastery_score < 90: # between 510 and 720
        difficulty = "medium"
    else: 
        difficulty = "hard"

    return difficulty



# Determine weights based on difficulty ----------------------------------------------------------------------------------------
def difficulty_weight(question_difficulty: str, user_difficulty) -> float:
    """
    Maps difficulty labels to numbers so "closeness" between difficulties can be measured as a numeric
    distance. Then difficulty_weight() assigns a weight to any given question based on how far its difficulty
    is from the student's target.
    """
    DIFFICULTY_ORDER = {"easy": 0, "medium": 1, "hard": 2}
    target_level = DIFFICULTY_ORDER[user_difficulty]
    
    distance = abs(DIFFICULTY_ORDER[question_difficulty] - target_level)
    if distance == 0:
        return 10   # exact match ==>> most likely to be picked ==>> heavily favored
    elif distance == 1:
        return 3    # adjacent difficulty — some chance
    else:
        return 1    # far away — still possible, just unlikely



# Determines section's proficiency based on original score -----------------------------------------------------------------------------
# TODO go back and check why you have this function (quiz)
def determine_proficiency(original_score:int):
    if original_score < 450:
        proficiency = "beginer"
    elif original_score < 650:
        proficiency = "intermediate"
    else: 
        proficiency = "advanced"
    return proficiency
