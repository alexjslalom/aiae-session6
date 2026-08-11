# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Visually flag incomplete todos whose due date has passed as "overdue" directly in the todo list, without
reordering the list or persisting any new data. Overdue status is a purely derived value — computed from
a todo's existing `dueDate` and `completed` fields compared against the current local date — recalculated
on every render (add/edit/delete/toggle/page load), with no background timer. The implementation is
frontend-only: a small pure utility function determines overdue status, and `TodoCard` renders a
text+icon indicator (not color-only) styled with the existing design tokens.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2 (frontend), Node.js/Express (backend — unchanged by this feature)

**Primary Dependencies**: React, React DOM (frontend); Jest, `@testing-library/react` (testing). No new
dependencies required.

**Storage**: N/A — overdue status is computed at render time from the existing `dueDate` and `completed`
fields; no schema or persistence change.

**Testing**: Jest + `@testing-library/react` for frontend unit/integration tests, colocated in
`__tests__/` directories per [docs/testing-guidelines.md](../../docs/testing-guidelines.md).

**Target Platform**: Web browser (existing React SPA served by `packages/frontend`)

**Project Type**: Web application (existing monorepo: `packages/frontend` + `packages/backend`); this
feature only touches `packages/frontend`.

**Performance Goals**: Negligible — O(n) date comparison over the visible todo list per render; no
measurable performance impact expected.

**Constraints**: No background timer/polling for overdue recomputation (per clarification); recomputation
only on user-triggered re-render (add/edit/delete/toggle) or page load/refresh. Indicator must not change
list ordering. Must remain distinguishable without relying on color alone (WCAG AA, per constitution
Principle IV).

**Scale/Scope**: Single-user todo list of typical size (tens of items); no scale concerns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Code Quality & Consistency | New logic lives in a single-purpose utility function (`camelCase`), colocated with existing frontend conventions; no new lint violations. | PASS |
| II. Test-First Reliability | New utility function and updated `TodoCard`/`TodoList` rendering get unit tests in `__tests__/`; existing coverage (≥80%) maintained. | PASS |
| III. Simplicity & Scope Discipline | No new persisted field, no reordering, no new dependency — smallest change that satisfies FR-001–FR-008. Feature stays within functional-requirements scope. | PASS |
| IV. Consistent & Accessible UI | Indicator reuses existing `--danger-color` design token and adds a text label/icon (not color-only) to meet WCAG AA and non-color-reliant guidance. | PASS |
| V. Monorepo Architecture & Data Integrity | No backend/API changes; todo data source of truth (REST API) untouched. Frontend remains the only package modified. | PASS |

No violations — Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/src/
├── components/
│   ├── TodoCard.js              # MODIFIED: render overdue indicator
│   ├── TodoList.js              # unchanged (no reordering)
│   └── __tests__/
│       └── TodoCard.test.js     # MODIFIED: add overdue indicator cases
├── utils/                       # NEW directory
│   ├── todoStatus.js            # NEW: isOverdue(todo, referenceDate) pure function
│   └── __tests__/
│       └── todoStatus.test.js   # NEW
└── styles/
    └── theme.css                 # unchanged: reuse existing --danger-color token

packages/backend/                 # UNCHANGED — no API or schema changes
```

**Structure Decision**: This is a frontend-only addition to the existing web application (Option 2:
frontend + backend). No backend routes, services, or schema are touched — overdue status is derived
purely in the frontend from data already returned by the existing REST API. A new `utils/` folder is
introduced in `packages/frontend/src` to hold the single pure `isOverdue` function shared by `TodoCard`
(and any future consumer), keeping the logic in one tested place per the DRY principle.

## Complexity Tracking

*No Constitution Check violations — this section is not applicable.*
