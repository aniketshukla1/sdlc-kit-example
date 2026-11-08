# CHAT-1: Order page: total ignores quantity, and quantities aren't shown
Type: bug   Link: none, a chat ticket (`.agent/work/CHAT-1/TICKET.md`)

## Acceptance criteria
| #   | Original text (verbatim) | Given / When / Then |
|-----|--------------------------|---------------------|
| AC1 | Given order 1001 (2 × $10.00 tea, 1 × $14.50 mug), when its page loads, then the total reads $34.50. | Given order 1001 holds 2 × $10.00 tea and 1 × $14.50 mug / When its page loads / Then the total reads $34.50 |
| AC2 | Given an order line with quantity n, when the order's total is worked out, then that line adds its unit price × n. | Given an order line with unit price p and quantity n / When the order's total is worked out / Then that line adds p × n to it |
| AC3 | Given order 1001, when its page loads, then each line shows its quantity: 2 for the tea, 1 for the mug. | Given order 1001 / When its page loads / Then the tea's line shows 2 and the mug's line shows 1 |
| AC4 | A regression test reproduces each symptom, and passes after the fix. | Given the code before the fix / When each symptom's regression test runs / Then it fails, and after the fix it passes |

## Sub-tasks (None if the ticket has none)
None

## Answers from ticket
- Roles: not stated.
- Errors: not stated.
- Screen: the order page (Steps to Reproduce).

## Bug (Type = bug only)
- Steps to reproduce: 1. Open the order page for order 1001.
- Expected: The total reads $34.50 (2 × $10.00 tea + 1 × $14.50 mug), and the page shows each item's quantity.
- Actual: The total reads $24.50, and the page doesn't show quantity.

## Gaps
| # | Question | BLOCKER/ASSUMPTION | Default or answer |
|---|----------|--------------------|-------------------|
| 1 | Inputs: is anything new entered? | ASSUMPTION | No. The fix only reads existing order data. |
| 2 | Errors: order not found, invalid id | ASSUMPTION | Unchanged: 404 and 422, as the API returns today. |
| 3 | Users: who may view an order? | ASSUMPTION | Unchanged: the route is public in this demo. |
| 4 | UI: where does quantity go? Loading, empty and error states? | ASSUMPTION | A "Quantity" column between Item and Unit price. Loading, empty and error states unchanged. |
| 5 | Data: new tables or columns? Existing data affected? | ASSUMPTION | None. Totals are worked out on every read and never stored, so nothing needs a backfill. |
| 6 | Money: rounding, currency, a quantity of 0 or less? | ASSUMPTION | Unit prices have 2 decimal places and quantities are whole numbers, so unit price × quantity needs no rounding. Currency display unchanged. Quantities stay at 1 or more, as in the data; no validation added. |
| 7 | Search, pagination, performance, audit log, notifications? | ASSUMPTION | Not affected. No Elasticsearch in this app. |

## Out of scope
- A per-line subtotal (unit price × quantity) on the page: the ticket asks only for the quantity and the right total.
- Validating quantities when an order is written: this app has no write path.
