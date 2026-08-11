# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `[001-overdue-todos]`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date, so they can prioritize their work and quickly see which tasks are past their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot overdue todos at a glance (Priority: P1)

As a todo application user, I want incomplete todos whose due date has passed to be visually distinguished in the list, so I can quickly identify what needs my attention without checking each date manually.

**Why this priority**: This is the core value of the feature — without a visible indicator, users still have to manually compare dates, which is exactly the problem being solved.

**Independent Test**: Create a todo with a due date in the past and leave it incomplete; verify it displays a distinct overdue indicator in the todo list. Delivers value on its own even before any other refinement.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and status incomplete, **When** the user views the todo list, **Then** the todo displays a clear overdue indicator (e.g., label and color) distinguishing it from on-time todos.
2. **Given** a todo with a due date of today, **When** the user views the todo list, **Then** the todo is NOT marked overdue.
3. **Given** a todo with a due date in the future, **When** the user views the todo list, **Then** the todo is NOT marked overdue.

---

### User Story 2 - Completed todos are never shown as overdue (Priority: P2)

As a todo application user, I want todos I've already completed to never show an overdue indicator, regardless of their due date, so my list reflects only what still needs action.

**Why this priority**: Prevents a confusing/misleading signal once the priority-1 indicator exists; without this, completed work would appear to still need urgent attention.

**Independent Test**: Mark an overdue todo as complete and verify the overdue indicator disappears immediately; can be tested independently of how the indicator is styled.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past, **When** the user marks it complete, **Then** the overdue indicator is removed immediately.
2. **Given** a completed todo with a past due date, **When** the user views the todo list, **Then** no overdue indicator is shown for that todo.

---

### User Story 3 - Todos without a due date are never overdue (Priority: P3)

As a todo application user, I want todos with no due date set to never display an overdue indicator, so untimed tasks aren't incorrectly flagged.

**Why this priority**: Lower priority since due dates are optional and this is a correctness guard rather than the primary value, but still needed to avoid incorrect flags.

**Independent Test**: Create a todo without a due date and verify it never shows an overdue indicator regardless of how much time passes.

**Acceptance Scenarios**:

1. **Given** a todo with no due date set, **When** the user views the todo list, **Then** no overdue indicator is shown for that todo.

---

### Edge Cases

- A todo due today is treated as not yet overdue (still on time until the day passes).
- Editing a todo's due date to a past date while incomplete causes it to become overdue immediately; editing it to a future or empty date removes the overdue indicator immediately.
- Toggling a todo from complete back to incomplete re-evaluates overdue status based on its due date at that moment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish, in the todo list, any incomplete todo whose due date is earlier than the current date as "overdue".
- **FR-002**: System MUST NOT apply the overdue indicator to any todo marked complete, regardless of its due date.
- **FR-003**: System MUST NOT apply the overdue indicator to any todo that has no due date set.
- **FR-004**: System MUST treat a todo due on the current date as not overdue.
- **FR-005**: System MUST recompute a todo's overdue status whenever its due date, title, or completion status changes, and on each view of the list (no stale/manually-set overdue flag).
- **FR-006**: The overdue indicator MUST be visible directly in the todo list view without requiring the user to open or hover over the todo.
- **FR-007**: The overdue indicator MUST be distinguishable without relying on color alone (e.g., accompanying text or icon), consistent with the application's accessibility requirements.

### Key Entities

- **Todo**: Existing entity representing a task; relevant attributes are due date (optional) and completion status. This feature adds no new stored attributes — overdue is a derived, computed state based on due date and completion status compared to the current date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list within 2 seconds of viewing it, without checking individual due dates.
- **SC-002**: 100% of incomplete todos with a due date earlier than today display the overdue indicator.
- **SC-003**: 0% of completed todos display an overdue indicator, regardless of due date.
- **SC-004**: 0% of todos without a due date display an overdue indicator.

## Assumptions

- "Overdue" means the todo's due date is strictly earlier than the current date (day-level comparison); a todo due today is not yet overdue.
- Overdue status is a derived/computed value evaluated at render time, not a new persisted field on the todo.
- The current date used for comparison is the user's local device date.
- No new due-date functionality (e.g., reminders, recurring dates) is introduced; this feature only adds a visual indicator to existing due dates.
