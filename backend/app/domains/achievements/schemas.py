
from typing import List, Optional 
from pydantic import BaseModel


class Achievement(BaseModel):
    id: str
    title: str
    description: str
    tier: Optional[str] = None      # bronze, silver, or gold 
    progress: int                   # current value 
    target: int                     # value needed for the next tier 
    earned: bool                    # at least one tier earned 


