# sdlc-kit example: orders demo

A small FastAPI + React app with [sdlc-kit](https://github.com/aniketshukla1/sdlc-kit) installed, to show the kit
working on a real repo.

**[Read the recorded run](docs/RUN.md):** one chat message to a merged PR, with the kit's real files and what went wrong.

The bug was planted on purpose. An order's total ignored quantity, and the order page didn't show quantity at all.
Order 1001 holds 2 × $10.00 tea and 1 × $14.50 mug, so the page said $24.50 instead of $34.50.

The app is small on purpose: one read-only route, made-up data in memory, no auth, no database, no styling.

## Run it

Tested with Python 3.13 and Node 22.

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload
```

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Then open http://localhost:5173.

## Check it

```bash
PATH="$PWD/backend/.venv/bin:$PATH" bash .cursor/skills/run-checks/scripts/check_all.sh
```

The last line is `ALL PASS` or `FAIL: <checks>`.

<!-- Throwaway change: this PR only exercises the agent-guards workflow. -->
