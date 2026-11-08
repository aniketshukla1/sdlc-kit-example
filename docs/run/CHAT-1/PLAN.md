# CHAT-1 plan

## Summary
An order's total adds each line's unit price once and ignores its quantity, and the order page has no quantity
column. The fix multiplies by quantity where totals are worked out, and adds the column. No API, data or
dependency changes.

## Approach
- Backend: in `OrdersService.get_order`, multiply each line's unit price by its quantity when summing. It is the one
  place totals are worked out; its only caller outside tests is the route.
- Frontend: add a Quantity column to `OrderSummary`. The API already sends `quantity`, so the API types stay as they are.
- Tests first. The regression test from the quick track is already red. T1 adds a unit test with a quantity of 3,
  because a quantity of 2 can't tell "× n" from "added twice". T2 adds a page test. Both fail before their code.

## Roadmap (one row per open sub-task; None if there are none)
None

## Files
| Path | New/Edit | Lines now → expected | Purpose |
|------|----------|----------------------|---------|
| backend/app/services/orders_service.py | Edit | 23 → 23 | The total multiplies unit price by quantity |
| frontend/src/features/orders/components/OrderSummary.tsx | Edit | 35 → 37 | Quantity column |
| backend/tests/integration/orders/test_orders_routes.py | Edit | 44 → 44 | Regression test for AC1 (written in the quick track) |
| backend/tests/unit/orders/test_orders_service.py | Edit | 42 → 51 | Unit test for AC2 |
| frontend/src/features/orders/components/OrderPage.test.tsx | Edit | 77 → 92 | Page test for AC3 |

## Tasks
- [x] T1: The order total counts each line's quantity (AC1, AC2) (calls: `GET /api/v1/orders/{order_id}` and
  `OrdersService.get_order(order_id: int) -> OrderRead`; files: backend/app/services/orders_service.py)
  - [x] Regression test written and red (moved from the quick track)
- [x] T2: The order page shows each line's quantity (AC3) (calls: `OrderSummary` with props `{ order: Order }`,
  rendered by `OrderPage` with props `{ orderId: number }`; files: frontend/src/features/orders/components/OrderSummary.tsx)

## Data changes
- Migration: no
- NOT NULL on existing table: n/a
- Downgrade: n/a; reverting the commit restores the old total
- Indexes: none
- Elasticsearch: none

## API contract
| Method | Path | Request | Response | Status codes | Auth (required / public: ticket line) |
|--------|------|---------|----------|--------------|---------------------------------------|
| GET | /api/v1/orders/{order_id} | none | OrderRead, shape unchanged; `total` becomes the sum of unit_price × quantity | 200, 404, 422 | public, unchanged (REQUIREMENTS.md gap 3) |

## UI
- Screen/route: the order page (`/`, which shows order 1001 in this demo)
- States: loading "Loading order…", empty "This order has no items yet.", error "Could not load this order."
  with "Try again": all unchanged. Success: a table with Item, Quantity and Unit price columns, then Total.
- shadcn components used: None (this app has no shadcn; a plain table)

## Edge and abuse cases
| # | Case | Exact result (status, message, UI text) |
|---|------|------------------------------------------|
| E1 | An order id that doesn't exist (999) | 404 `{"detail": "Order 999 not found"}`, unchanged |
| E2 | A non-numeric order id (abc) | 422, unchanged |
| E3 | An order with no lines (1002) | API total "0.00"; the page says "This order has no items yet.", unchanged |
| E4 | Money precision: 3 × $10.00 + 1 × $14.50 | Exactly Decimal("44.50"), with no float rounding |
| E5 | Every line has a quantity of 1 | Total as today: Decimal("24.50") for 10.00 + 14.50 |

## Test plan
| Covers (AC#/Edge#) | Test name | Type (unit/integration/component/e2e) | Task | Expected (exact) | File |
|--------------------|-----------|----------------------------------------|------|------------------|------|
| E1 | test_read_order_that_does_not_exist_returns_404 | integration | existing | 404, `{"detail": "Order 999 not found"}` | backend/tests/integration/orders/test_orders_routes.py |
| E2 | test_read_order_with_non_numeric_id_returns_422 | integration | existing | 422 | backend/tests/integration/orders/test_orders_routes.py |
| E3 | test_read_order_without_lines_has_zero_total | integration | existing | `{"id": 1002, "lines": [], "total": "0.00"}` | backend/tests/integration/orders/test_orders_routes.py |
| E3 | says so when the order has no items | component | existing | "This order has no items yet." | frontend/src/features/orders/components/OrderPage.test.tsx |
| AC1, AC4 ✅ | test_read_order_total_counts_each_line_quantity | integration | T1 | 200, `total` "34.50" (red now: "24.50") | backend/tests/integration/orders/test_orders_routes.py |
| AC2, E4 ✅ | test_get_order_total_multiplies_each_unit_price_by_its_quantity | unit | T1 | Decimal("44.50") for 3 × 10.00 + 1 × 14.50 | backend/tests/unit/orders/test_orders_service.py |
| E5 | test_get_order_total_adds_up_the_lines | unit | existing | Decimal("24.50") | backend/tests/unit/orders/test_orders_service.py |
| AC3, AC4 ✅ | shows how many of each item were ordered | component | T2 | Column headers "Item", "Quantity", "Unit price"; tea row "Green tea 250 g", "2", "$10.00"; mug row "Ceramic mug", "1", "$14.50" | frontend/src/features/orders/components/OrderPage.test.tsx |

## New dependencies
None

## Risks
- Money: Decimal × int keeps the 2 decimal places, so no float maths enters the total.
- The existing page test matches cells with `arrayContaining`, so the new column doesn't break it.
- Ask first: None

## Human actions required
None

## Out of scope
- A per-line subtotal (unit price × quantity) on the page.
- Validating quantities when an order is written: this app has no write path.
