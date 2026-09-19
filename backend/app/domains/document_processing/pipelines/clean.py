# Import Python libraries and files 
import re

# Normalize the test for files, id
def normalize_text(value: str) -> str:
    value = value.strip()
    value = value.replace("&", "and")  # & → and
    value = value.replace(" ", "_")  # spaces → underscores
    value = value.lower()  # optional: normalize case
    return value


# Removes excessive spaces, line breaks, newlines, and etc
def normalize_questions(extracted_questions):
    """
    Cleans OCR text inside a list of question dictionaries.
    """
    for question in extracted_questions:  # question is a dict
        text = question.get('text', '')

        # Fix excessive spaces
        text = re.sub(r'(?<=[a-zA-Z0-9,])\s{1,4}(?=[a-zA-Z0-9])', ' ', text)

        # Fix hyphenated line breaks
        text = re.sub(r'-\n\s*', '', text)

        # Collapse multiple newlines into one
        # text = re.sub(r'\n{1,}', '\n', text)
        text = text.replace('\n', ' ')

        # Remove lone single characters on a line
        text = re.sub(r'^\s*[a-z]\s*$', '', text, flags=re.MULTILINE)

        # Replace remaining single newlines with a space, except before A), B), etc. or numbered questions
        text = re.sub(r'(?<!\n)(?<!\d\.)\n(?![A-D]\))', ' ', text)

        text = text.strip()

        # Save back into the dictionary
        question['text'] = text

    return extracted_questions


# Differentiate between the questions, multiple choices and equation/diagram blocks
def mcq_diagram_identifier(questions):

    # Multiple Choice Pattern
    mcq_pattern = re.compile(
        r'A\)\s*(.*?)\s*' # Choice A
        r'B\)\s*(.*?)\s*' # Choice B 
        r'C\)\s*(.*?)\s*' # Choice C 
        r'D\)\s*(.*)', # Choice D
        re.DOTALL
    )

    # Numbered Question Pattern
    question_number_pattern = re.compile(
        r'^\s*[\\\(]?\)?(\d+(?:\.\d+)?)[\)\.\,:]?'
    )

    organized_questions = []
    i = 0

    while i < len(questions):
        question = questions[i]
        text = question.get('text', '')

        # Detect the start of question
        if question_number_pattern.search(text):
            new_question = question.copy()
            new_question['question_type'] = 'free response'

            i += 1 # Move to the next question

            # Collects blocks until the next numbered question
            while i < len(questions):
                next_question = questions[i]
                next_text = next_question.get('text', '')

                # Stop if the next block is a question
                if question_number_pattern.search(next_text):
                    # print(next_text)
                    break

                # Detect if it is a multiple choice block
                if mcq_pattern.search(next_text):
                    new_question['question_type'] = 'multiple choice'
                    new_question['multiple_choice_preview'] = next_question.get("question_preview")

                i += 1
                # Double-Check Input
            #pprint.pprint(question.get('text', ''))
            #print("---------------")

            organized_questions.append(new_question)
        else:
            i += 1

    return organized_questions

# QUESTION EXAMPLE
"""
import pprint
from data_pipelines.extract_pp import extract_text_pp
pdf = '/Users/chelseazebaze/Desktop/SAT/PrepPros/Sample of Ch 18 (M).pdf'
questions = extract_text_pp(pdf, "math", "algebra", "intepreting linear functions", "preppros")
normalized_questions = normalize_questions(questions)
organized_questions = mcq_diagram_identifier(normalized_questions)
pprint.pprint(organized_questions[:5])
"""
