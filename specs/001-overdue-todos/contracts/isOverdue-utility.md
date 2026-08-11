# Contract: `isOverdue` utility function

This feature has no external/REST API surface changes. The only new interface introduced is an
internal frontend utility function, documented here as its "contract" since it is the single shared
piece of logic multiple components may depend on.

## Module

`packages/frontend/src/utils/todoStatus.js`

## Function: `isOverdue(todo, referenceDate)`

**Signature**:

```javascript
/**
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to `new Date()` (current local date)
 * @returns {boolean}
 */
function isOverdue(todo, referenceDate = new Date())
```

**Preconditions**:
- `todo` is an object with at least `dueDate` (ISO date string or `null`/`undefined`) and `completed`
  (`0`/`1` or boolean) fields.

**Postconditions / Contract**:
- Returns `false` if `todo.completed` is truthy, regardless of `dueDate`.
- Returns `false` if `todo.dueDate` is `null`, `undefined`, or an empty string.
- Returns `false` if the calendar date of `todo.dueDate` equals or is after the calendar date of
  `referenceDate` (day-level comparison, local timezone).
- Returns `true` only if `todo.completed` is falsy AND `todo.dueDate` is present AND its calendar date
  is strictly before `referenceDate`'s calendar date.
- Pure function: no side effects, no mutation of `todo`, deterministic for a given `todo` +
  `referenceDate` pair.

**Consumers**: `TodoCard` (renders the indicator based on this function's return value).

## No REST API changes

`packages/backend` routes/services (`GET /todos`, `POST /todos`, `PUT /todos/:id`,
`PATCH /todos/:id/status`, `DELETE /todos/:id`) are unchanged — todos are returned exactly as today;
`overdue` is never part of the request/response payload.
