"""The orders API, through the test client."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_read_order_returns_its_lines() -> None:
    response = client.get("/api/v1/orders/1001")

    assert response.status_code == 200
    assert response.json()["lines"] == [
        {"sku": "TEA-250", "name": "Green tea 250 g", "unit_price": "10.00", "quantity": 2},
        {"sku": "MUG-01", "name": "Ceramic mug", "unit_price": "14.50", "quantity": 1},
    ]


def test_read_order_without_lines_has_zero_total() -> None:
    response = client.get("/api/v1/orders/1002")

    assert response.status_code == 200
    assert response.json() == {"id": 1002, "lines": [], "total": "0.00"}


def test_read_order_that_does_not_exist_returns_404() -> None:
    response = client.get("/api/v1/orders/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Order 999 not found"}


def test_read_order_with_non_numeric_id_returns_422() -> None:
    response = client.get("/api/v1/orders/abc")

    assert response.status_code == 422
