

from fastapi import APIRouter, HTTPException
from fastapi.exception_handlers import http_exception_handler
from fastapi import Request, status
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

router = APIRouter(prefix="/api/errors", tags=["errors"])

# StarletteHTTPException Handler
# provide a customizable, structured way to catch raised exceptions and return consistent HTTP responses (e.g. JSON) to clients.
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

async def general_http_exception_handler(request: Request, exc: StarletteHTTPException):
    if request.url.path.startswith("/api"):
        return http_exception_handler(request, exc)

    message = exc.detail if exc.detail else "An error occurred. Please check your request and try again."
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": "Customized error message", "errors": message},
    )

# RequestValidationError Handler
# used to override default error responses when request data fails validation. Catches Pydantic validation errors, log detailed debugging information
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    if request.url.path.startswith("/api"):
        return await request_validation_exception_handler(request, exc)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Customized error message", "errors": exc.errors()},
    )

# Clerk Handler
def http_exception_handler(request: Request, exc: HTTPException):
    errors = {401: "unauthorized", 403: "forbidden"}
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": errors.get(exc.status_code, "error"),
            "reason": exc.detail
        },
        headers=exc.headers or {},
    )
