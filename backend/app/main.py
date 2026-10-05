import sys
import os
from rich.traceback import install
install(show_locals=True)

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError

# APIs
from app.domains.errors.router import general_http_exception_handler, validation_exception_handler
from app.domains.admin.routers import marketing
from app.domains.students.routers import register, student_info
from app.domains.questions.routers import fetch_questions
from app.domains.analytics.routers import router as analytics_router, past_analytics
from app.domains.document_processing.routers import extract_questions, fetch_questions_parameters, upload, add_questions, update_questions
from app.domains.achievements import router as achievement

# Configuration
from app.core.config import settings
from app.core.logging_config import setup_logging


# DEFINE THE API -------------------------------------------------------------------------------------------------------
setup_logging()

# Hide the interactive API docs on the deployed server (set ENV=production on Render)
IS_PRODUCTION = os.getenv("ENV", "").lower() == "production"

app = FastAPI(
    title = "Elevate Learning",
    description="Master the SAT through adaptive learning",
    version="0.0.0",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)


# HEALTH CHECK ---------------------------------------------------------------------------------------------------------
# Used by Render's health check and the weekly keep-alive workflow. Runs a tiny query so the
# Supabase project registers activity and doesn't auto-pause on the free tier.
@app.get("/health", include_in_schema=False)
def health():
    from sqlalchemy import text
    from app.core.database import engine
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}


# ERROR HANDLING -------------------------------------------------------------------------------------------------------
app.add_exception_handler(StarletteHTTPException, general_http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)


# API ROUTES -----------------------------------------------------------------------------------------------------------
app.include_router(marketing.router)
app.include_router(register.router)
app.include_router(student_info.router)
app.include_router(fetch_questions.router)
app.include_router(analytics_router.router)
app.include_router(past_analytics.router)
app.include_router(extract_questions.router)
app.include_router(upload.router)
app.include_router(fetch_questions_parameters.router)
app.include_router(add_questions.router)
app.include_router(update_questions.router)
app.include_router(achievement.router)


# MIDDLEWARE -----------------------------------------------------------------------------------------------------------
# Add middleware to enable certain origin / certain URLS to interact with our backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True, # allows someone to send credentials to backend
    allow_methods=["*"], # enables them to use any API method
    allow_headers=["*"], # enables them to send additional information with the request
)