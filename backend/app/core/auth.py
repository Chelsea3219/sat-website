# Import Python libraries and packages 
import logging 
from typing import Annotated
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from clerk_backend_api import AuthenticateRequestOptions, authenticate_request, Clerk 
from clerk_backend_api.security.types import RequestState

from app.core.config import settings
from app.core.logging_config import setup_logging

# Logging 
setup_logging() 
logger = logging.getLogger("clerk authentication")


http_bearer = HTTPBearer(auto_error=False)

def require_auth(
        request: Request, 
        _creds: Annotated[HTTPAuthorizationCredentials | None, Depends(http_bearer)] = None, 
) -> RequestState:

    state = authenticate_request(
        request, # gives clerk acces to the incoming HTTP request and its authentication headers
        AuthenticateRequestOptions(
            secret_key=settings.CLERK_SECRET_KEY, 
            jwt_key=settings.CLERK_JWT_KEY, 
            authorized_parties=settings.CLERK_AUTHORIZED_PARTIES, 
            accepts_token=["session_token"] # restricts the accepted token types to session tokens 
        )
    )

    if not state.is_signed_in:
        logger.info(
            "Clerk auth failed: reason=%s message%s has auth_header=%s",
            state.reason.name if state.reason else None, 
            getattr(state, "message", None),
            "authorization" in request.headers
        )
        raise HTTPException(
            status_code=401, 
            detail=state.reason.name if state.reason else "unauthorized", 
            headers={"WWW-Authenticate": "Bearer"},
        )

    # returns an object containing suthentication information (is_signed_in, is_authenticated, status, reason, payload, token, to_auth)
    # print("state -->>", state)
    return state



def get_authenticated_clerk_id(
    state: Annotated[RequestState, Depends(require_auth)]
) -> str:
    if not state.payload or not state.payload.get("sub"):
        logger.error(
            "Authenticated request has no usable Clerk subject."
        )
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    return state.payload["sub"]



def get_clerk():
    return Clerk(bearer_auth=settings.CLERK_SECRET_KEY)


def require_permission(permission: str):
    def _check(state: Annotated[RequestState, Depends(require_auth)]) -> RequestState:
        org_permissions = state.payload.get("org_permissions") or []
        if permission not in org_permissions:
            raise HTTPException(status_code=403, detail=f"missing permission: {permission}")
        return state
    return _check


def require_system_role(role: str):
    """Check role for the user's ACTIVE organization (the one in `o.rol`).

    Pass the role without the `org:` prefix (e.g., `"admin"`, `"member"`) to
    match what Clerk stores in the claim.
    """
    def _check(
        state: Annotated[RequestState, Depends(require_auth)],
    ) -> RequestState:
        if not state.payload.get("org_id"):
            raise HTTPException(status_code=403, detail="no organization context")
        if state.payload.get("org_role") != role:
            raise HTTPException(status_code=403, detail=f"missing role: {role}")
        return state
    return _check

