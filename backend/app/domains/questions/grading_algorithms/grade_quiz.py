# Import Python libraries and variables 
from app.domains.questions.helpers import reading_topics, math_topics, determine_status
import pprint 


def scoring_distribution(difficulty, is_correct):
    correct_score = {"easy":2, "medium":3, "hard":5 }

    if is_correct:
        return correct_score[difficulty]
    else:
        return 0


def grade_quiz(answer_sheet, section):
    # Initialize the parameters
    topics = reading_topics if section == "reading" else math_topics

    # Calculate the score breakdown for each topic and Identify weak subtopics
    subtopics_mastery = {}
    topics_mastery = {t: {"raw_score": 0, "max_score": 0, "mastery_score": 0} for t in topics}
    for topic in topics:
        topic_questions = [q for q in answer_sheet if q["topic"] == topic]
        for question in topic_questions:
            topics_mastery[topic]["raw_score"] += scoring_distribution(question["difficulty"], question["is_correct"])
            topics_mastery[topic]["max_score"] += scoring_distribution(question["difficulty"], True)
            topics_mastery[topic]["mastery_score"] = (topics_mastery[topic]["raw_score"] / topics_mastery[topic]["max_score"]) * 100 if topics_mastery[topic]["max_score"] > 0 else 0
            topics_mastery[topic]["mastery_score"] = round(topics_mastery[topic]["mastery_score"], 2)

            # Detemines the subtopic mastery
            for sub in question["subtopic"]:
                if sub not in subtopics_mastery:
                    subtopics_mastery[sub] = {
                        "raw_score": 0, "max_score": 0, "mastery_score": 0, 
                        "num_incorrect":0, "num_questions": 0, "time_elapsed": []
                    }

                subtopics_mastery[sub]["raw_score"] += scoring_distribution(question["difficulty"], question["is_correct"])
                subtopics_mastery[sub]["max_score"] += scoring_distribution(question["difficulty"], True)
                subtopics_mastery[sub]["mastery_score"] = round(
                    (subtopics_mastery[sub]["raw_score"]/subtopics_mastery[sub]["max_score"]) * 100 
                    if subtopics_mastery[sub]["max_score"] > 0 else 0, 2
                )
                subtopics_mastery[sub]["time_elapsed"].append(question["time_elapsed"])
                subtopics_mastery[sub]["num_questions"] += 1

                if not question["is_correct"]:
                    subtopics_mastery[sub]["num_incorrect"] += 1


    # Calculate the overall mastery score
    section_mastery = {
        "raw_score": sum([topic_data["raw_score"] for topic_data in topics_mastery.values()]),
        "max_score": sum([topic_data["max_score"] for topic_data in topics_mastery.values()])
    }
    section_mastery["mastery_score"] = section_mastery["raw_score"]/section_mastery["max_score"] * 100 if section_mastery["max_score"] > 0 else 0
    section_mastery["mastery_score"] = round(section_mastery["mastery_score"], 2)

    # Results
    """ print("topics_mastery")
    pprint.pprint(topics_mastery, indent=4)
    print("--------------- \n", )
    print("section_mastery")
    pprint.pprint(section_mastery, indent=4)
    print("--------------- \n", )
    print("subtopics_mastery")
    pprint.pprint(subtopics_mastery, indent=4)
    print("--------------- \n", )"""

    return section_mastery, topics_mastery, subtopics_mastery




