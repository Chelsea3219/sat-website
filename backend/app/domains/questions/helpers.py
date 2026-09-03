# Reading and Math Topics. ------------------------------------------------------------------------------------------------------------
reading_topics = ["information & ideas", "craft & structure", "expression of ideas", "standard english conventions"]
math_topics = ["algebra", "advanced math", "problem solving & data analysis", "geometry & trigonometry"]
topics = reading_topics + math_topics


# Questions Distribution based on difficulty -------------------------------------------------------------------------------------------
question_distribution = {
    "beginner": {"easy": 0.70, "medium": 0.20, "hard": 0.10},
    "intermediate": {"easy": 0.30, "medium": 0.50, "hard": 0.20},
    "advanced": {"easy": 0.10, "medium": 0.50, "hard": 0.40}
}


# Question Classification based on subtopics -------------------------------------------------------------------------------------------
categorized_subtopics = {
    "algebra": ["linear functions", "interpreting linear functions", "systems of equations"],
    "advanced math": ["exponents", "quadratic equations", "systems of equations"],
    "problem solving & data analysis": ["percents", "statistical analysis", "mean/median/range/mode", "ratios & proportions"],
    "geometry & trigonometry":["angles", "shapes", "similar triangles", "trigonometry", "circle equation"]
}


# Determines section's proficiency based on original score -----------------------------------------------------------------------------
def determine_proficiency(original_score):
    if original_score < 450:
        proficiency = "beginer"
    elif original_score > 451 and original_score < 650:
        proficiency = "intermediate"
    else: 
        proficiency = "advanced"
    return proficiency


# Question Distrubution based on topic ------------------------------------------------------------------------------------------------
math_questions_per_topic = {
    "algebra": 15,
    "advanced math": 15,
    "problem solving & data analysis": 7,
    "geometry & trigonometry": 7
}
reading_questions_per_topic = {
    "information & ideas": 15,
    "craft & structure": 14,
    "expression of ideas": 15,
    "standard english conventions": 10
}

# Checks to see how the questions are allocated based on section and difficulty ------------------------------------------------------------
def check_questions_distribution(questions):
    all_topics = [
        "information & ideas", "craft & structure", "expression of ideas", "standard english conventions",
        "algebra", "advanced math", "problem solving & data analysis", "geometry & trigonometry"
    ]

    question_spread = {
        "information & ideas":0,
        "craft & structure":0,
        "expression of ideas":0,
        "standard english conventions":0,

        "algebra":0,
        "advanced math":0,
        "problem solving & data analysis":0,
        "geometry & trigonometry":0,

        "easy" : {"reading": 0, "math":0},
        "medium" : {"reading": 0, "math":0},
        "hard" : {"reading": 0, "math":0}
    }
    for topic in all_topics:
        question_spread[topic] = len([q for q in questions if q.topic == topic])

    for difficulty in ["easy", "medium", "hard"]:
        question_spread[difficulty] = len([q for q in questions if q.difficulty == difficulty])

    return question_spread


# Organizes the subtopics based on topic
categorized_subtopics = {
    "algebra": ["linear functions", "interpreting linear functions", "systems of equations"],
    "advanced_math": ["exponents", "quadratic equations", "systems of equations"],
    "problem solving & data analysis": ["percents", "statistical analysis", "mean/median/range/mode", "ratios & proportions"],
    "geometry & trigonometry":["angles", "shapes", "similar triangles", "trigonometry", "circle equation"]
}

def organize_subtopics(weak_subtopics):
    organized_list = {i: [] for i in topics}
    
