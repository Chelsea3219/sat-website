import json
from fractions import Fraction


def _accepted_answers(stored: str | None) -> list[str]:
    if not stored or not stored.strip():
        return []
    s = stored.strip()
    if s.startswith("["):
        try:
            return [str(a) for a in json.loads(s)]
        except json.JSONDecodeError:
            pass
    return [s]


def _to_number(s: str) -> float | None:
    try:
        return float(Fraction(s.replace(" ", "")))
    except (ValueError, ZeroDivisionError):
        return None


def answers_match(generated: str, stored: str | None) -> bool:
    accepted = _accepted_answers(stored)
    if not accepted:
        return True                       # no key on file: nothing to compare against
    gen = generated.strip().upper()
    gen_num = _to_number(gen)
    for a in accepted:
        a = a.strip().upper()
        if gen == a:
            return True
        a_num = _to_number(a)
        if gen_num is not None and a_num is not None and abs(gen_num - a_num) < 0.001:
            return True
    return False