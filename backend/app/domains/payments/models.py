from app.core.database import Base
from sqlalchemy import Column, DateTime, String, Integer
from sqlalchemy.dialects.postgresql import UUID


# app/domains/payments/models.py
class Payments(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema":"silver"}

    record_id = Column(String,  primary_key=True, index=True)
    subscription_id = Column(String, index=True)
    clerk_id = Column(String)
    stripe_id = Column(String, index=True)
    stripe_price_id = Column(String, index=True)
    product_name = Column(String, nullable=False)                 # monthly | three_months | six_months
    status = Column(String, nullable=False)               # paid | unpaid
    created_at = Column(DateTime(timezone=True), nullable=False)




class UserAccess(Base):

    __tablename__ = "user_access"
    __table_args__ = {"schema":"silver"}

    clerk_id = Column(String, primary_key=True)
    record_id = Column(String)
    current_plan = Column(String)
    status = Column(String)
    sessions_remaining = Column(Integer)
    current_plan_end = Column(DateTime(timezone=True), nullable=True)
