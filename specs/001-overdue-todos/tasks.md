---

description: "Task list template for feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/isOverdue-utility.md, quickstart.md

**Tests**: Included — the constitution's Test-First Reliability principle and plan.md explicitly
require unit tests for `isOverdue` and updated `TodoCard` rendering tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of
each story. This is a frontend-only feature (`packages/frontend`); `packages/backend` is untouched.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Existing web app monorepo — all paths below are under `packages/frontend/src/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new `utils/` module location; no new dependencies or config required.

- [ ] T001 Create `packages/frontend/src/utils/` directory and `packages/frontend/src/utils/__tests__/` directory (no dependencies to install; React/Jest/RTL already configured per plan.md)

**Checkpoint**: Directory structure ready for the foundational utility.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the single shared `isOverdue` pure function that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 [P] Write unit tests for `isOverdue(todo, referenceDate)` in `packages/frontend/src/utils/__tests__/todoStatus.test.js` covering the full truth table from [data-model.md](./data-model.md): incomplete+past date → `true`; incomplete+today → `false`; incomplete+future → `false`; incomplete+no dueDate → `false`; completed+past date → `false` (ensure tests FAIL before T003)
- [ ] T003 Implement `isOverdue(todo, referenceDate = new Date())` pure function per [contracts/isOverdue-utility.md](./contracts/isOverdue-utility.md) in `packages/frontend/src/utils/todoStatus.js` (day-level/calendar-date comparison in local timezone; no mutation, no side effects) — makes T002 pass

**Checkpoint**: `isOverdue` is implemented and fully unit-tested — user story implementation can now begin.

---

## Phase 3: User Story 1 - Spot overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose due date has passed display a clear, non-color-only overdue indicator
directly in the todo list, without changing list ordering.

**Independent Test**: Create a todo with a past due date and leave it incomplete; verify it displays a
distinct overdue indicator ("⚠ Overdue" text+icon) in the todo list, and that a todo due today or in the
future does not.

### Tests for User Story 1

- [ ] T004 [P] [US1] Add `TodoCard` test cases in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting: an incomplete todo with a past `dueDate` renders the overdue indicator (e.g., `screen.getByText(/Overdue/)`), a todo due today does not render it, and a todo with a future `dueDate` does not render it (ensure tests FAIL before T005-T006)

### Implementation for User Story 1

- [ ] T005 [US1] Import `isOverdue` from `../utils/todoStatus` in `packages/frontend/src/components/TodoCard.js` and compute `const overdue = isOverdue(todo);` in the non-editing render branch (depends on T003)
- [ ] T006 [US1] Render a text+icon overdue indicator (e.g., "⚠ Overdue") in `todo-content` next to/below the due date in `packages/frontend/src/components/TodoCard.js` when `overdue` is `true`, and conditionally add an `overdue` class to the `todo-card` div (e.g., `` `todo-card ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}` ``) (depends on T005)
- [ ] T007 [P] [US1] Add `.todo-card.overdue` and overdue indicator styles in `packages/frontend/src/styles/theme.css`, reusing the existing `--danger-color` token (no new color tokens) for both light and dark theme sections
- [ ] T008 [US1] Verify `packages/frontend/src/components/TodoList.js` requires no changes — confirm list ordering by `createdAt` is unaffected by the new `overdue` class/indicator (read-only verification, no reordering logic added)

**Checkpoint**: User Story 1 is fully functional and independently testable — MVP deliverable.

---

## Phase 4: User Story 2 - Completed todos are never shown as overdue (Priority: P2)

**Goal**: Todos marked complete never show an overdue indicator, regardless of due date, and the
indicator disappears immediately upon toggling completion.

**Independent Test**: Mark an overdue todo as complete and verify the overdue indicator disappears
immediately (no page refresh needed); verify a completed todo with a past due date never shows the
indicator.

### Tests for User Story 2

- [ ] T009 [P] [US2] Add `TodoCard` test cases in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting a completed todo (`completed: 1`) with a past `dueDate` does NOT render the overdue indicator, and that toggling `completed` from `0`→`1` on re-render removes the indicator (ensure tests FAIL before confirming behavior)

### Implementation for User Story 2

- [ ] T010 [US2] Confirm `isOverdue`'s `completed` short-circuit (already implemented in T003 per [data-model.md](./data-model.md) truth table) correctly covers this story end-to-end via `TodoCard`'s existing `handleToggle`/re-render flow in `packages/frontend/src/components/TodoCard.js` — no additional production code expected beyond T005-T006; fix if T009 reveals a gap

**Checkpoint**: User Stories 1 AND 2 both work independently — completed todos never flagged overdue.

---

## Phase 5: User Story 3 - Todos without a due date are never overdue (Priority: P3)

**Goal**: Todos with no due date set never display an overdue indicator.

**Independent Test**: Create a todo without a due date and verify it never shows an overdue indicator.

### Tests for User Story 3

- [ ] T011 [P] [US3] Add `TodoCard` test case in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting an incomplete todo with `dueDate: null` does NOT render the overdue indicator (ensure test FAILS before confirming behavior)

### Implementation for User Story 3

- [ ] T012 [US3] Confirm `isOverdue`'s `dueDate` presence check (already implemented in T003 per [data-model.md](./data-model.md) truth table) correctly covers this story via `TodoCard`'s existing conditional rendering in `packages/frontend/src/components/TodoCard.js` — no additional production code expected beyond T005-T006; fix if T011 reveals a gap

**Checkpoint**: All user stories are independently functional — full feature complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories.

- [ ] T013 [P] Run `npm test --workspace=packages/frontend` and confirm ≥80% coverage is maintained per [docs/testing-guidelines.md](../../docs/testing-guidelines.md) and constitution Principle II
- [ ] T014 Execute the manual validation scenarios in [quickstart.md](./quickstart.md) against a running app (`npm run start`) to confirm all 7 scenarios pass end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1) has no dependency on US2/US3
  - User Story 2 (P2) and User Story 3 (P3) both depend on the `TodoCard` overdue rendering added in
    US1 (T005-T006), since they only add negative-case tests/verification against the same rendering path
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — introduces the overdue indicator in `TodoCard`
- **User Story 2 (P2)**: Depends on US1's `TodoCard` changes (T005-T006) being in place to verify against; no new production code expected
- **User Story 3 (P3)**: Depends on US1's `TodoCard` changes (T005-T006) being in place to verify against; no new production code expected

### Within Each User Story

- Tests MUST be written and FAIL before implementation/verification
- Utility function (Foundational) before any `TodoCard` changes
- `TodoCard` logic change (T005) before `TodoCard` rendering/class change (T006)
- Story complete before moving to next priority

### Parallel Opportunities

- T002 (tests) can be written in parallel with reviewing T001 setup, but must fail before T003 is written
- T004, T007 within User Story 1 are marked [P] (different files: test file vs. CSS file)
- T009 (US2 tests) and T011 (US3 tests) can be written in parallel with each other — different assertions in the same test file but no shared line edits if added as separate `it()` blocks
- T013 (test run) can run in parallel with preparing for T014 (manual quickstart validation)

---

## Parallel Example: User Story 1

```bash
# Launch these two in parallel once Foundational (T003) is done:
Task: "Add TodoCard test cases for overdue indicator in packages/frontend/src/components/__tests__/TodoCard.test.js"
Task: "Add .todo-card.overdue styles reusing --danger-color in packages/frontend/src/styles/theme.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` utility + unit tests) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (overdue indicator renders in `TodoCard`)
4. **STOP and VALIDATE**: Run quickstart scenarios 1-3, 7 independently
5. Deploy/demo if ready — this alone satisfies FR-001, FR-004, FR-006, FR-007, FR-008

### Incremental Delivery

1. Complete Setup + Foundational → `isOverdue` ready and tested
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently (completed todos never flagged) → Deploy/Demo
4. Add User Story 3 → Test independently (no-due-date todos never flagged) → Deploy/Demo
5. Each story adds a guarding test without breaking previous stories, since `isOverdue`'s full contract
   was already implemented in Foundational (T003)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US2 and US3 are primarily test/verification tasks because the Foundational `isOverdue` function
  (T003) implements the complete contract (all rows of the truth table) up front — this keeps the logic
  in one tested place per research.md's DRY rationale, while still keeping each story independently
  testable via its own dedicated test cases
- Verify tests fail before implementing/confirming behavior
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No backend changes at any point — `packages/backend` is out of scope for this feature
