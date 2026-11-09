import logging 
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging_config import setup_logging


setup_logging()
logger = logging.getLogger("http-errors")

ERROR_NAMES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    409: "conflict",
    413: "payload_too_large",
}

async def http_error_handler(request: Request, exc: StarletteHTTPException):
    """All HTTPExceptions (FastAPI's and Starlette's): keep the real message."""
    log = logger.error if exc.status_code >= 500 else logger.warning
    log("HTTP %s on %s %s: %r", exc.status_code, request.method, request.url.path, exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": ERROR_NAMES.get(exc.status_code, "error"), "detail": exc.detail},
        headers=getattr(exc, "headers", None),
    )


async def validation_error_handler(request: Request, exc: RequestValidationError):
    """422s: return which fields failed and why."""
    logger.warning("Validation error on %s %s: %s", request.method, request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={"error": "validation_error", "detail": jsonable_encoder(exc.errors())},
    )