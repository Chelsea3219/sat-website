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
from app.domains.analytics import router

# Configuration
from app.core.config import settings
from app.core.logging_config import setup_logging


# DEFINE THE API -------------------------------------------------------------------------------------------------------
setup_logging()
app = FastAPI(
    title = "Elevate Learning",
    description="Master the SAT through adaptive learning",
    version="0.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# ERROR HANDLING -------------------------------------------------------------------------------------------------------
app.add_exception_handler(StarletteHTTPException, general_http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)


# API ROUTES -----------------------------------------------------------------------------------------------------------
app.include_router(marketing.router)
app.include_router(register.router)
app.include_router(student_info.router)
app.include_router(fetch_questions.router)
app.include_router(router.router)

#app.include_router(progress.router)
#app.include_router(profile.router)
#app.include_router(dashboard.router)
#app.include_router(landing.router)


# MIDDLEWARE -----------------------------------------------------------------------------------------------------------
# Add middleware to enable certain origin / certain URLS to interact with our backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True, # allows someone to send credentials to backend
    allow_methods=["*"], # enables them to use any API method
    allow_headers=["*"], # enables them to send additional information with the request
)