## Proof
`check_all.sh` printed ALL PASS on exactly this commit, `832b6e5` (checked 2026-11-08 12:02 IST).
Checks that ran: file-size guards scope backend frontend api-types coverage

Tests written first, each shown failing before its code (as logged in PROGRESS.md / PLAN.md):
```text
2026-11-08 quick track, Part 1: regression test `backend/tests/integration/orders/test_orders_routes.py::test_read_order_total_counts_each_line_quantity`: red: AssertionError: assert '24.50' == '34.50'
2026-11-08 T1 `backend/tests/unit/orders/test_orders_service.py::test_get_order_total_multiplies_each_unit_price_by_its_quantity`: red: AssertionError: assert Decimal('24.50') == ((Decimal('10.00') * 3) + (Decimal('14.50') * 1))
2026-11-08 T2 `frontend/src/features/orders/components/OrderPage.test.tsx > shows how many of each item were ordered`: red: AssertionError: expected [ 'Item', 'Unit price' ] to deeply equal [ 'Item', 'Quantity', 'Unit price' ]
```

Changed files vs `origin/main`:
```text
M	backend/app/services/orders_service.py
M	backend/tests/integration/orders/test_orders_routes.py
M	backend/tests/unit/orders/test_orders_service.py
M	frontend/src/features/orders/components/OrderPage.test.tsx
M	frontend/src/features/orders/components/OrderSummary.tsx
```
