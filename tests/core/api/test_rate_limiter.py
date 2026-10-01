"""Tests for the per-organization rate limiter."""

from types import SimpleNamespace
from typing import cast
from unittest.mock import AsyncMock

import pytest

from custom_components.meraki_ha.core.api.rate_limiter import (
    TokenBucket,
    get_org_limiter,
    throttle_session,
)


class FakeClock:
    """A clock that only moves when the test sleeps."""

    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        """Return the current fake time."""
        return self.now


@pytest.mark.asyncio
async def test_bucket_allows_burst_then_paces() -> None:
    """Five requests go at once, the sixth waits a fifth of a second."""
    clock = FakeClock()
    sleeps: list[float] = []

    async def fake_sleep(delay: float) -> None:
        sleeps.append(delay)
        clock.now += delay

    bucket = TokenBucket(rate=5, burst=5, clock=clock, sleep=fake_sleep)
    for _ in range(5):
        await bucket.acquire()
    assert sleeps == []

    await bucket.acquire()
    assert sleeps == [pytest.approx(0.2)]


@pytest.mark.asyncio
async def test_sustained_rate_is_capped() -> None:
    """Fifty requests take at least nine seconds at five per second."""
    clock = FakeClock()

    async def fake_sleep(delay: float) -> None:
        clock.now += delay

    bucket = TokenBucket(rate=5, burst=5, clock=clock, sleep=fake_sleep)
    for _ in range(50):
        await bucket.acquire()
    assert clock.now == pytest.approx(9.0)


def test_org_limiter_is_shared() -> None:
    """Two clients for one org share a bucket; other orgs get their own."""
    assert get_org_limiter("o1") is get_org_limiter("o1")
    assert get_org_limiter("o1") is not get_org_limiter("o2")


@pytest.mark.asyncio
async def test_throttle_session_wraps_every_request() -> None:
    """Each SDK HTTP request first takes a token."""
    original = AsyncMock(return_value="response")
    req_session = SimpleNamespace(request=original)
    api_session = SimpleNamespace(_session=SimpleNamespace(_req_session=req_session))
    limiter = SimpleNamespace(acquire=AsyncMock())

    throttle_session(api_session, cast(TokenBucket, limiter))
    throttle_session(api_session, cast(TokenBucket, limiter))  # idempotent
    result = await req_session.request("GET", "https://x", params={"a": 1})

    assert result == "response"
    limiter.acquire.assert_awaited_once()
    original.assert_awaited_once_with("GET", "https://x", params={"a": 1})
