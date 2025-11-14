"""
Rate Limiting Middleware for API Protection
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
import logging

logger = logging.getLogger(__name__)


# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/hour"],
    storage_uri="memory://",  # Can be changed to Redis: redis://localhost:6379
    strategy="fixed-window"
)


# Rate limit configurations for different endpoints
RATE_LIMITS = {
    "predictions": "10/minute",  # Expensive predictions
    "charts": "20/minute",  # Chart calculations
    "auth": "5/minute",  # Authentication attempts
    "general": "30/minute"  # General API calls
}


def get_limiter():
    """Get the rate limiter instance"""
    return limiter


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded errors
    """
    logger.warning(
        f"Rate limit exceeded for {request.client.host} "
        f"on {request.url.path}"
    )
    
    return Response(
        content={
            "error": "Rate Limit Exceeded",
            "message": "Too many requests. Please try again later.",
            "retry_after": str(exc.retry_after) if hasattr(exc, 'retry_after') else None
        },
        status_code=429,
        headers={
            "Retry-After": str(getattr(exc, 'retry_after', 60)),
            "X-RateLimit-Limit": str(getattr(exc, 'limit', 'N/A')),
            "X-RateLimit-Remaining": "0"
        }
    )
