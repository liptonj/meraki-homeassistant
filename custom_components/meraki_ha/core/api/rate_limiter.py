"""Per-organization request rate limiting for the Meraki Dashboard API."""

from __future__ import annotations

import asyncio
import time
from collections.abc import Awaitable, Callable
from typing import Any

# Meraki allows 10 requests per second per organization, shared by every
# application using it. Staying at half leaves room for the Dashboard itself
# and other integrations.
DEFAULT_RATE = 5.0
DEFAULT_BURST = 5


class TokenBucket:
    """An asyncio token bucket: waits until a request may be sent."""

    def __init__(
        self,
        rate: float = DEFAULT_RATE,
        burst: int = DEFAULT_BURST,
        clock: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], Awaitable[None]] = asyncio.sleep,
    ) -> None:
        """Initialize the bucket full."""
        self._rate = rate
        self._burst = burst
        self._clock = clock
        self._sleep = sleep
        self._tokens = float(burst)
        self._updated = clock()
        self._lock = asyncio.Lock()

    async def acquire(self) -> None:
        """Wait for a token. Callers are served in arrival order."""
        async with self._lock:
            now = self._clock()
            self._tokens = min(
                self._burst, self._tokens + (now - self._updated) * self._rate
            )
            self._updated = now
            if self._tokens >= 1:
                self._tokens -= 1
                return
            await self._sleep((1 - self._tokens) / self._rate)
            # The sleep earned exactly one token; take it rather than
            # re-measuring, which float rounding could leave just short.
            self._tokens = 0.0
            self._updated = self._clock()


_BUCKETS: dict[str, TokenBucket] = {}


def get_org_limiter(org_id: str) -> TokenBucket:
    """Return the bucket shared by every client of an organization."""
    if org_id not in _BUCKETS:
        _BUCKETS[org_id] = TokenBucket()
    return _BUCKETS[org_id]


def throttle_session(api_session: Any, limiter: TokenBucket) -> None:
    """
    Make every HTTP request of a Meraki SDK session wait for the limiter.

    The SDK sends each attempt, retry and page through
    ``_session._req_session.request``, so wrapping it covers all of them,
    including code that calls the SDK directly.
    """
    rest_session = getattr(api_session, "_session", None)
    req_session = getattr(rest_session, "_req_session", None)
    if req_session is None or getattr(req_session, "_meraki_ha_throttled", False):
        return
    original = req_session.request

    async def throttled_request(method: str, url: str, **kwargs: Any) -> Any:
        await limiter.acquire()
        return await original(method, url, **kwargs)

    req_session.request = throttled_request
    req_session._meraki_ha_throttled = True
