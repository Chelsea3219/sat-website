
from app.core.config import settings




PRODUCTS = {
    "monthly":{
        "price_id": settings.STRIPE_PRICE_MONTHLY,
        "mode": "subscription", 
        "price": 49 
    }, 
    "three_months":{
        "price_id": settings.STRIPE_PRICE_THREE_MONTHS,
        "mode": "payment", 
        "price": 132
    }, 
    "six_months":{
        "price_id": settings.STRIPE_PRICE_SIX_MONTHS,
        "mode": "payment", 
        "price": 235
    }, 
    "one_session":{
        "price_id": settings.STRIPE_SINGLE_SESSION,
        "mode": "payment", 
        "price": 65
    }, 
    "three_sessions":{
        "price_id": settings.STRIPE_THREE_SESSIONS,
        "mode": "payment", 
        "price": 180
    }, 
    "five_sessions":{
        "price_id": settings.STRIPE_FIVE_SESSIONS,
        "mode": "payment", 
        "price": 275 
    }, 

}