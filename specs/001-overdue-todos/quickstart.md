# Quickstart: Validate Overdue Todo Indicator

## Prerequisites

- Node.js v16+ and npm installed
- Repository dependencies installed: `npm install` at the repo root

## Setup

```bash
npm run start
```

This starts both `packages/backend` and `packages/frontend` (per
[docs/project-overview.md](../../docs/project-overview.md)). Open the app at the frontend dev server
URL shown in the terminal (typically `http://localhost:3000`).

## Manual Validation Scenarios

Run these against the running app to confirm the feature end-to-end (maps to spec Acceptance Scenarios):

1. **Overdue todo is flagged (US1 / FR-001)**
   - Add a todo with a due date a few days in the past (e.g., yesterday), leave it incomplete.
   - Expected: the todo shows a distinct overdue indicator (icon + text, e.g., "⚠ Overdue") in the list.

2. **Due today is not overdue (FR-004)**
   - Add a todo with a due date of today.
   - Expected: no overdue indicator.

3. **Future due date is not overdue**
   - Add a todo with a due date next week.
   - Expected: no overdue indicator.

4. **Completing removes the indicator (US2 / FR-002)**
   - Check the checkbox on the overdue todo from step 1.
   - Expected: overdue indicator disappears immediately, with no page refresh.

5. **No due date is never overdue (US3 / FR-003)**
   - Add a todo with no due date set.
   - Expected: no overdue indicator, ever.

6. **Editing due date toggles overdue immediately (Edge Cases)**
   - Edit an on-time todo's due date to a past date and save.
   - Expected: it becomes overdue immediately after save (no refresh needed).
   - Edit it again to a future date or clear the date.
   - Expected: overdue indicator is removed immediately.

7. **Ordering unaffected (FR-008)**
   - With a mix of overdue and on-time todos, confirm the list order stays by creation date (newest
     first) — overdue todos are not moved to the top or bottom.

## Automated Validation

```bash
# From repo root
npm test --workspace=packages/frontend
```

Expect new/updated tests to pass:
- `packages/frontend/src/utils/__tests__/todoStatus.test.js` — unit tests for `isOverdue` covering the
  table in [data-model.md](./data-model.md).
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — updated to assert the overdue
  indicator renders/hides per `completed`/`dueDate` combinations.

Refer to [data-model.md](./data-model.md) for the full truth table and
[contracts/isOverdue-utility.md](./contracts/isOverdue-utility.md) for the function contract being
tested.
