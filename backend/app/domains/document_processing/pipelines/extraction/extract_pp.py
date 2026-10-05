# Import Python libraries and files
import re
import os
import pprint
from pdf2image import convert_from_path
import pytesseract
pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD", "/opt/homebrew/bin/tesseract")

from app.domains.document_processing.pipelines.image_processing import *


# EXTRACTS THE QUESTIONS/ MCs PER QUESTION BLOCKS
def extract_text_pp(pdf_path, section, topic, subtopic, source):
    images = convert_from_path(pdf_path, 300, poppler_path=os.getenv("POPPLER_PATH"))  # Converts PDF to a list of PIL Image Object

    questions = []

    for i in images:
        # Trims the whitespace_pp
        img = trim_whitespace_pp(i)

        # Splits the questions into columns
        left_half, right_half = split_image(img)

        # Splits questions into blocks
        for j in [left_half, right_half]:
            question_blocks = crop_question_blocks(j)
            for k in question_blocks:
                # k.show() # Preview the question blocks

                # Extracts the text
                text = pytesseract.image_to_string(k, config='--psm 6')
                #pprint.pprint(text)

                # Clean messy OCR
                text = re.sub(r'\n+', '\n', text)  # collapse multiple \n → single
                text = text.strip()

                questions.append({
                    # Classification
                    "section": section,
                    "topic":topic,
                    "subtopic": subtopic,

                    # Question context
                    "text":text,
                    "question_preview": k,

                    # Answer and Grading
                    "question_type": "unknown",
                    "multiple_choice_preview":None,

                    "source":source
                })

    # pprint.pprint(text)
    return questions



# QUESTION EXAMPLE
"""
import pprint
pdf = '/Users/chelseazebaze/Desktop/SAT/PrepPros/Sample of Ch 18 (M).pdf'
questions = extract_text_pp(pdf, "math", "algebra", "intepreting linear functions", "preppros")
pprint.pprint(questions[:5])
"""

