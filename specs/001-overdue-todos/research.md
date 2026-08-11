# Phase 0 Research: Support for Overdue Todo Items

All items from the spec's Clarifications session are already resolved (recompute-on-render only, no
reordering). No `NEEDS CLARIFICATION` markers remain in the Technical Context. The research below
records the implementation-level decisions needed to move to design.

## Decision: Where overdue status is computed

- **Decision**: Compute overdue status in a single new pure function, `isOverdue(todo, referenceDate)`,
  in `packages/frontend/src/utils/todoStatus.js`. `TodoCard` calls it during render; no state, memo, or
  effect is needed since it's a cheap derived value re-evaluated on every render.
- **Rationale**: Keeps the rule (incomplete + dueDate < today) in exactly one tested place (DRY),
  matches "derived, computed state" from the spec's Key Entities section, and avoids introducing any
  new persisted field.
- **Alternatives considered**:
  - *Compute inline in `TodoCard`*: rejected — duplicates date logic if any other component ever needs
    it, and harder to unit test in isolation.
  - *Compute once in `App.js` and pass an `isOverdue` prop down*: rejected — adds unnecessary prop
    plumbing through `TodoList` for a value that is cheap to derive locally in `TodoCard`, and would
    need to be recalculated on every state change anyway.

## Decision: Date comparison semantics

- **Decision**: Compare using day-level (calendar date) granularity in the user's local timezone:
  `dueDate` is parsed as a local calendar date; a todo is overdue only if that date is strictly before
  today's local calendar date. Today is not overdue (FR-004).
- **Rationale**: Matches spec Assumptions ("day-level comparison", "user's local device date") and
  existing `formatDate` usage in `TodoCard`, which already renders dates without time components.
- **Alternatives considered**:
  - *Timestamp/millisecond comparison (`Date.now()` vs `Date(dueDate)`)*: rejected — due dates are
    stored/entered as plain dates (`<input type="date">`), so comparing full timestamps would
    incorrectly mark a same-day todo as overdue depending on time of day.

## Decision: Recomputation trigger (no background timer)

- **Decision**: No `setInterval`/timer is introduced. Overdue status is naturally recomputed every time
  React re-renders `TodoCard` (add/edit/delete/toggle update `todos` state in `App.js`, or a full page
  load/refresh re-fetches todos), consistent with FR-005 and the clarification answer.
- **Rationale**: Satisfies the explicit clarification ("Passive recompute only... No background timer")
  with zero added complexity.
- **Alternatives considered**:
  - *`setInterval` polling to flip status at midnight*: explicitly rejected by clarification.

## Decision: Visual indicator design

- **Decision**: Add a small text+icon badge (e.g., "⚠ Overdue") rendered in `todo-content` next to/below
  the due date, styled with the existing `--danger-color` design token (already defined in
  `theme.css` for both light/dark mode) and a `.todo-card.overdue` class for any card-level accent
  (e.g., left border), reusing existing spacing/radius tokens.
- **Rationale**: FR-007 requires non-color-only distinction; `--danger-color` already exists so no new
  design tokens are needed (Principle IV / III — simplicity, reuse existing system).
- **Alternatives considered**:
  - *Color-only left border or background tint*: rejected — fails FR-007 (must not rely on color alone).
  - *New dedicated "overdue" color token*: rejected — `--danger-color` already conveys the same urgency
    semantics used for delete actions; adding a new token is unnecessary duplication.

## Output

All unknowns resolved. Ready for Phase 1 design.
