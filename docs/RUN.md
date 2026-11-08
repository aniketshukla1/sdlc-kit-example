# The recorded run: CHAT-1

One chat message became a reviewed, merged PR in this repo, through
[sdlc-kit](https://github.com/aniketshukla1/sdlc-kit). This page records what happened on 2026-11-08, including what
went wrong. The fix is [PR #2](https://github.com/aniketshukla1/sdlc-kit-example/pull/2).

**Read this first:** the same agent (Claude Code, Opus 5.5) built this app, planted the bug and then fixed it, so
finding the root cause proves nothing here. What the run shows is the process: the gates, the order of the work, and
what the scripts recorded or refused.

## The request

> fix: order 1001 shows a $24.50 total, but 2 × $10.00 tea plus a $14.50 mug is $34.50. The order page doesn't show
> quantity either.

The agent drafted that sentence, and the human started the run with it.

## What the human did

| Step | The human | What it decided |
|------|-----------|-----------------|
| Start | Clicked "Yes, start it" | Run `/chat` with that request |
| Ticket | Typed `start` | The drafted ticket is right; save it as CHAT-1 |
| Phases 1 to 3 | Typed `Continue CHAT-1`, 3 times | Go on to the next phase |
| Plan | Typed `approve` | Code may now be written |
| Phases 4 to 7 | Typed `Continue CHAT-1`, 4 times | Go on to the next phase |
| Review | Merged PR #2 on GitHub | The agent can't: a hook blocks `gh pr merge` |

The kit normally starts a new chat for each phase. This run stayed in one chat, because its working copy was in a
folder only that session could see.

## What the agent did

| Phase | Result |
|-------|--------|
| Chat to ticket | A Bug ticket with 4 testable acceptance criteria: [TICKET.md](run/CHAT-1/TICKET.md) |
| Quick track | A test written from the ticket's steps failed as expected. Then the quick track stopped itself: the fix changes money logic, so the kit moved the ticket to the full track |
| 1. Intake | [REQUIREMENTS.md](run/CHAT-1/REQUIREMENTS.md): no blockers, 7 written assumptions |
| 2. Explore | Notes in [PROGRESS.md](run/CHAT-1/PROGRESS.md): 2 files to change, no E2E tests for this screen |
| 3. Plan | [PLAN.md](run/CHAT-1/PLAN.md): 2 tasks, 5 edge cases, 8 test rows. No code until `approve` |
| 4. Build | Each new test failed first, then passed. The real page was checked at 375 and 1280 px |
| 5. Check | `ALL PASS` on the first run |
| 6. Self-review | No findings, then `ALL PASS` again |
| 7. PR | 2 commits, pushed without force, and a PR with its Proof section |

The whole fix is 5 files, 39 lines added and 3 removed. Backend tests went from 7 to 9, and frontend tests from 4 to 5.

## Each test failed first

Shortened to the failing assertion. The full lines are in [proof.md](run/CHAT-1/proof.md), which `proof_pack.sh` wrote
from the log:

```text
assert '24.50' == '34.50'
assert Decimal('24.50') == ((Decimal('10.00') * 3) + (Decimal('14.50') * 1))
expected [ 'Item', 'Unit price' ] to deeply equal [ 'Item', 'Quantity', 'Unit price' ]
```

## The last check

```text
--- file-size: PASS
--- guards: PASS
--- scope: PASS
--- backend: PASS
--- frontend: PASS
--- api-types: PASS
Changed-line coverage: 100% (1 of 1 lines, minimum 90%).
--- coverage: PASS
ALL PASS
```

`proof_pack.sh` then confirmed that this `ALL PASS` ran on exactly the pushed commit, `832b6e5`. Its output went into
the PR unedited.

## What the run found in the kit

Using the kit on a real repo found problems that its 96 self-tests had missed.

| Finding | Status when this was written |
|---------|------------------------------|
| `install.sh --host` broke `mr.sh`, which read a comment line as the host name | Fixed in [sdlc-kit#2](https://github.com/aniketshukla1/sdlc-kit/pull/2) |
| `check_frontend.sh` failed whenever a ticket regenerated the API types | Fixed in [sdlc-kit#2](https://github.com/aniketshukla1/sdlc-kit/pull/2) |
| A command in the explore skill aborts under zsh when its glob matches nothing | Not fixed yet |
| `/quick-fix` asks for one regression test, which doesn't fit a bug with two symptoms | Not fixed yet |
| Changed-line coverage can't see JSX-only lines. The "1 of 1" above is the backend line, and the page test covers the 3 JSX lines | A known limit |

## What this run doesn't show

- **Review feedback (phase 8):** nobody left comments, and this repo has no CI.
- **Jira, Linear and GitLab:** this run used `/chat` and GitHub only.
- **A hard bug or a large codebase:** the app has one route and one page, and the agent already knew the bug.

## The files

[TICKET.md](run/CHAT-1/TICKET.md), [REQUIREMENTS.md](run/CHAT-1/REQUIREMENTS.md), [PLAN.md](run/CHAT-1/PLAN.md),
[PROGRESS.md](run/CHAT-1/PROGRESS.md) and [proof.md](run/CHAT-1/proof.md) are the kit's working files from this run,
copied unchanged. They normally stay out of git, in `.agent/work/`.
