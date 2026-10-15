import json

def normalize_choices(choices):
    if not choices:
        return None
    filled = {k: v for k, v in choices.items() if v and str(v).strip()}
    return filled or None                       # {"A": "", ...} → None

def normalize_answer_key(key):
    if key is None:
        return None
    if isinstance(key, list):                   # ["-4/9", "-0.444"] → '["-4/9", "-0.444"]'
        return json.dumps(key)
    return str(key).strip() or None