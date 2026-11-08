# CHAT-1 progress
Track: full
Phase: 7-mr (open)
Parent: -
Branch: bugfix/CHAT-1-order-total-quantity
MR: !2 https://github.com/aniketshukla1/sdlc-kit-example/pull/2

## Log
- 2026-11-08 quick track, Part 1: regression test `backend/tests/integration/orders/test_orders_routes.py::test_read_order_total_counts_each_line_quantity`: red: AssertionError: assert '24.50' == '34.50'
- 2026-11-08 moved to the full track: the fix changes money logic (the order total), which the quick track leaves out.
- 2026-11-08 intake: done. Blockers: none. 7 assumptions, in REQUIREMENTS.md "Gaps".
- 2026-11-08 Agent: intake done, exploring codebase. (Chat ticket: said in chat instead of posted.)
- 2026-11-08 explore: done. Pattern source: the orders feature. 2 files to change, no E2E for this screen.
- 2026-11-08 plan: PLAN.md written (2 tasks, 8 test rows), shown in chat. Waiting for approve.
- 2026-11-08 plan: approved by the human in chat. Branch: bugfix/CHAT-1-order-total-quantity (kept from the quick track).
- 2026-11-08 T1 `backend/tests/unit/orders/test_orders_service.py::test_get_order_total_multiplies_each_unit_price_by_its_quantity`: red: AssertionError: assert Decimal('24.50') == ((Decimal('10.00') * 3) + (Decimal('14.50') * 1))
- 2026-11-08 T1 done: `backend/app/services/orders_service.py` multiplies unit price by quantity in `get_order`.
  T1's tests green (2 of 2), the whole backend suite 9 passed; ruff, ruff format and mypy clean. Edge cases:
  auth N/A (no new route; it stays public, as planned); Create/Update schemas N/A (read only); not found
  unchanged (404 test passes); 403 N/A (no users); 409 N/A (no writes); 422 unchanged; optional fields N/A
  (none added); an empty order keeps total 0.00; pagination N/A (no list); transactions N/A (no writes);
  N+1 N/A (in memory); money stays Decimal; no logging added.
- 2026-11-08 T2 `frontend/src/features/orders/components/OrderPage.test.tsx > shows how many of each item were ordered`: red: AssertionError: expected [ 'Item', 'Unit price' ] to deeply equal [ 'Item', 'Quantity', 'Unit price' ]
- 2026-11-08 T2 done: `frontend/src/features/orders/components/OrderSummary.tsx` adds a Quantity column (37 lines).
  T2's test green; the whole frontend suite 5 passed; tsc and eslint clean. The real page on localhost shows the
  Quantity column (2 and 1) and Total $34.50 at 375 and 1280 px, with no console errors or warnings, and
  GET /api/v1/orders/1001 returns 200. Edge cases: loading, error with Try again, and empty unchanged (this app
  has no shadcn, so no Skeleton); form, toast, hidden actions and confirmations N/A (read-only page);
  `quantity` is a required number in the API types, so it's never missing; no inputs to label.
- 2026-11-08 build: done. T1 and T2 ticked.
- 2026-11-08 check: ALL PASS on the first run (tree 25a6135). file-size, guards, scope, backend (9 passed),
  frontend (5 passed), api-types and coverage all PASS. "Changed-line coverage: 100% (1 of 1 lines, minimum 90%)":
  the 1 line is `orders_service.py:21`. The 3 changed JSX lines in `OrderSummary.tsx` have no statements of their
  own in v8's report, so they aren't counted; T2's test is their proof.
- 2026-11-08 self-review: no findings (see "Self-review"); ALL PASS again on the same tree.
- 2026-11-08 MR: 2 commits (backend, frontend), pushed without force; proof_pack.sh vouched for 832b6e5.
  PR #2 opened through mr.sh: https://github.com/aniketshukla1/sdlc-kit-example/pull/2. Agent: MR ready for
  review (chat ticket: said in chat instead of posted).

## Codebase notes
Pattern source: orders, the app's only feature (the fix stays inside it)
| File | Purpose | Lines |
|------|---------|-------|
| backend/app/services/orders_service.py | `get_order` works out the total (to change) | 23 |
| frontend/src/features/orders/components/OrderSummary.tsx | the order's table (to change) | 35 |
| backend/app/api/v1/routes/orders.py | GET /api/v1/orders/{order_id} | 24 |
| backend/app/schemas/orders.py | OrderRead, OrderLineRead (already has `quantity`) | 24 |
| backend/app/repositories/orders_repository.py | orders in memory; `OrderLine.quantity` | 42 |
| frontend/src/features/orders/api/useOrder.ts | TanStack Query hook; `Order` type from `schema.d.ts` | 14 |
| frontend/src/features/orders/components/OrderPage.tsx | loading, error and empty states, then OrderSummary | 24 |
| backend/tests/unit/orders/test_orders_service.py | service tests, repository mocked (pattern) | 42 |
| backend/tests/integration/orders/test_orders_routes.py | API tests through TestClient (pattern) | 44 |
| frontend/src/features/orders/components/OrderPage.test.tsx | page tests, `fetch` stubbed (pattern) | 77 |

- Root cause of the total: `backend/app/services/orders_service.py:21` sums each line's `unit_price` and never
  multiplies by `quantity`. `get_order` has one caller outside tests: `backend/app/api/v1/routes/orders.py:24`.
  It never worked: the line came in with the app (`git log -S` finds only 5adbe47).
- Root cause of the missing quantity: `frontend/src/features/orders/components/OrderSummary.tsx` renders each
  line's name and unit price only, though the API already returns `quantity`. Its one caller is `OrderPage.tsx:23`.
- The regression test copies the setup of `test_read_order_returns_its_lines`.
- Error classes: OrderNotFoundError (`backend/app/core/errors.py`). Auth dependency: none; the route is public.
- Tests: pytest unit and integration; Vitest with Testing Library. E2E for this screen: none (no Playwright or
  Cypress config).
- Elasticsearch: no.
- API types: generated `frontend/src/api/schema.d.ts`. No field changes, so it stays as it is.
- Files near 200 lines (need split): none. The largest file to change has 77 lines.
- UNKNOWN: none.

## Self-review
- 2026-11-08: all 5 changed files reviewed one at a time against the whole checklist. No findings.
  - `orders_service.py:21`: the code for AC1 and AC2. Decimal × int stays Decimal. No new input, query, cache or write.
  - `OrderSummary.tsx`: the code for AC3. The new header cell has `scope="col"`, and Total's `colSpan={2}` keeps the
    total in the last column. The row key stays the SKU. No `any`, no HTML from data.
  - The 3 test files: names say scenario and result; Arrange / Act / Assert; exact values, derived from the inputs
    in the unit and page tests; all far below 200 lines.
  - Every AC has code, a test and a logged red line (3). Only PLAN.md's files changed. No debug code or TODOs.
  - Noted, not changed (out of scope, and as it was before): the total sits in the "Unit price" column.
