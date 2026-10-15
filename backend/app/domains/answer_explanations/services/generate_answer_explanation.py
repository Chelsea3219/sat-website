# Import important Python libraries, variables, and functions
from datetime import timezone, datetime
from anthropic import Anthropic, transform_schema
from app.core.database import get_db
from app.core.config import settings

from app.domains.questions.schemas import IncomingQuestions
from app.domains.answer_explanations.services.format_prompt import SYSTEM_PROMPT, build_question_message, normalize_anwer_key
from app.domains.answer_explanations.schemas import GeneratedAnswerExplanations, OutgoingAnswerExplanations
from app.domains.answer_explanations.services.compare_answers import answers_match


# Initialize the Anthropic client with the API key from settings
anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY, max_retries=5)
MODEL = "claude-sonnet-5-5"


def generate_answer_explanation(question:IncomingQuestions) -> OutgoingAnswerExplanations:

    response = anthropic_client.messages.parse(
        model=MODEL,
        max_tokens=4096, 
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_question_message(question)}], 
        output_format=GeneratedAnswerExplanations,
    )

    if response.stop_reason == "max_tokens":
        raise RuntimeError("Explanation was cut off; increase max tokens.")
    if response is None:
        raise ValueError("Model returned no parsed answer explanation.")

    generated = response.parsed_output    # already a GeneratedAnswerExplanations

    # Checks the question answer_key with the generated one
    matches = answers_match(generated.answer_key, question.answer_key)

    return OutgoingAnswerExplanations(
        **generated.model_dump(), 
        question_id =question.question_id, 
        model_name=MODEL, 
        status="pending_review" if matches else "needs_review",
        created_at=datetime.now(timezone.utc)
    )

