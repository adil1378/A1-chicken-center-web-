import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_returns_200():
    """Verify that GET /health returns status 200 and expected payload."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "A1 Chicken Center API"
    assert "version" in data
    assert "environment" in data


def test_v1_health_check_returns_200():
    """Verify that GET /api/v1/health returns status 200 and expected payload."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_root_returns_200():
    """Verify that root / returns service info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to A1 Chicken Center API" in data["message"]
