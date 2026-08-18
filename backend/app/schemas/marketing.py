from pydantic import BaseModel
from typing import Literal

class ContactUsForm(BaseModel):
    full_name: str
    email: str
    role: Literal["student", "parent" , "teacher"]
    subject: Literal[ "general inquiry", "billing/subscription", "courses", "web design", "other"]
    message: str