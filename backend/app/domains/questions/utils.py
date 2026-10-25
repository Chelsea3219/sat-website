import hashlib, json 

CONTENT_FIELDS = ["text", "multiple_choices", "equation", "diagram", "reading_question", "question_explanation"]



def content_hash(question) -> str:
    """
    On edits, it skips regeneration when nothing important changed. If someone fixes the topic, difficulty, or time estimate, the 
    hash stays the same, so you dont pay for a new Claude call. Chenage the question text or a MC and the hash changes, so you 
    regenerate. 
    It catches outdated jobs. If the question was edited before the job ran, the stored hash no longer matches, so the job exits without
    generating an explanation for the old content. 
    It prevents duplicated jobs 
    """
    payload = {f: getattr(question, f, None) for f in CONTENT_FIELDS}
    raw = json.dumps(payload, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()