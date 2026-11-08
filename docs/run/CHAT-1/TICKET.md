Type: Bug
Request: fix: order 1001 shows a $24.50 total, but 2 × $10.00 tea plus a $14.50 mug is $34.50. The order page doesn't show quantity either.

Summary: Order page: total ignores quantity, and quantities aren't shown

## User Story
As someone viewing an order, I expect its total to count each item's quantity and the page to show each
quantity, so that the total matches what was ordered.

## Environment
- Where: not stated. Build or version: not stated.
- Browser or device: not stated. User role: not stated.

## Steps to Reproduce
1. Open the order page for order 1001.

## Actual Result
The total reads $24.50, and the page doesn't show quantity.

## Evidence
- None

## Expected Result
The total reads $34.50 (2 × $10.00 tea + 1 × $14.50 mug), and the page shows each item's quantity.

## Frequency and Impact
- Frequency: not stated
- Affected: not stated. Severity: not stated. Workaround: not stated
- Regression: Unknown

## Root Cause
Unknown, found during the fix.

## Acceptance Criteria
1. Given order 1001 (2 × $10.00 tea, 1 × $14.50 mug), when its page loads, then the total reads $34.50.
2. Given an order line with quantity n, when the order's total is worked out, then that line adds its unit price × n.
3. Given order 1001, when its page loads, then each line shows its quantity: 2 for the tea, 1 for the mug.
4. A regression test reproduces each symptom, and passes after the fix.

## Benefits
- Orders with more than one of an item show the right total and how many were ordered.

## Open Questions
- None
