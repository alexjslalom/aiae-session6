<!--
Sync Impact Report
Version change: none (unratified template) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles: I. Code Quality & Consistency, II. Test-First Reliability (NON-NEGOTIABLE),
    III. Simplicity & Scope Discipline, IV. Consistent & Accessible UI, V. Monorepo Architecture & Data Integrity
  - Technology Stack & Architecture Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes required (Constitution Check gate is generic)
  - .specify/templates/spec-template.md ✅ no changes required
  - .specify/templates/tasks-template.md ✅ no changes required
  - .specify/templates/checklist-template.md ✅ no changes required
Follow-up TODOs: none
-->

# aiae-session6 Todo App Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions defined in [docs/coding-guidelines.md](../../docs/coding-guidelines.md):
`camelCase` for variables/functions, `PascalCase` for components and classes, `UPPER_SNAKE_CASE`
for constants, and 2-space indentation. Imports MUST be grouped (external → internal → styles) and
separated by blank lines. Code MUST adhere to DRY, KISS, and SOLID principles — duplicate logic is
extracted into shared utilities, functions do one thing, and components have a single responsibility.
Every function or module that can fail MUST handle errors explicitly (try/catch with meaningful
messages); silent failures are prohibited. Comments explain *why*, not *what*. Linting MUST pass with
no errors before a pull request is opened.
**Rationale**: Consistent style and disciplined structure keep a multi-package (frontend/backend)
codebase navigable and reduce onboarding friction and review overhead.

### II. Test-First Reliability (NON-NEGOTIABLE)
New functionality MUST be accompanied by tests colocated in `__tests__/` directories next to the
code they cover, following the `{filename}.test.js` naming convention, per
[docs/testing-guidelines.md](../../docs/testing-guidelines.md). Unit tests MUST isolate the unit under
test and mock external dependencies; integration tests MUST cover component interactions and
frontend-to-backend API communication. Overall coverage MUST remain at or above 80%, with critical
user workflows (create, view, complete, edit, delete todo) covered by both unit and integration
tests. Tests MUST verify behavior, not implementation, and MUST be independent (no shared state, no
ordering dependencies). All tests MUST pass before a pull request is merged.
**Rationale**: A single-user todo app has a small but critical set of workflows; enforced test
coverage prevents regressions in the create/view/update/delete lifecycle across both packages.

### III. Simplicity & Scope Discipline
Implementation MUST stay within the scope defined in
[docs/functional-requirements.md](../../docs/functional-requirements.md). Features explicitly marked
out of scope (authentication, multi-user support, categories/tags, search, filtering, bulk
operations, undo/redo, notifications) MUST NOT be added without an explicit, documented requirements
change. Solutions MUST favor the simplest implementation that satisfies the stated requirement (YAGNI);
premature optimization and speculative abstraction are prohibited. Destructive actions (e.g. delete
todo) MUST require user confirmation before persisting.
**Rationale**: A minimal, single-user todo app stays maintainable only if scope creep and unnecessary
complexity are actively rejected.

### IV. Consistent & Accessible UI
Frontend UI MUST follow the design system in
[docs/ui-guidelines.md](../../docs/ui-guidelines.md): the defined color palette and typography scale
for light/dark mode, the 8px spacing grid, and Material Design elevation/shape conventions (4-8px
border radius, subtle shadows). All interactive elements MUST be keyboard accessible, meet WCAG AA
color contrast, and use properly associated labels or `aria-label`s on icon-only buttons. Dark/light
mode preference MUST persist via `localStorage` and default to system preference on first visit.
**Rationale**: A consistent, accessible design system keeps the UI cohesive and usable for all users
without requiring bespoke styling decisions per component.

### V. Monorepo Architecture & Data Integrity
The project MUST remain organized as an npm-workspaces monorepo with a clear separation between
`packages/frontend` (React) and `packages/backend` (Express.js), per
[docs/project-overview.md](../../docs/project-overview.md). The backend REST API is the single source
of truth for todo data; all create, update, and delete operations from the frontend MUST be persisted
through it immediately, and changes MUST survive a page refresh. Cross-package logic MUST be exposed
through the package's public service/API layer rather than reaching into another package's internals.
**Rationale**: Clear package boundaries and a single persistence path prevent data drift and keep
frontend and backend independently developable and testable.

## Technology Stack & Architecture Constraints

- Frontend: React + React DOM, styled with plain CSS following the design tokens in
  [docs/ui-guidelines.md](../../docs/ui-guidelines.md).
- Backend: Node.js + Express.js exposing a REST API consumed by the frontend.
- Testing: Jest across both packages, with `@testing-library/react` for frontend component/integration
  tests.
- Package management: npm workspaces at the repository root; per-package scripts remain runnable
  independently from within `packages/frontend` and `packages/backend`.
- No database schema or persistence mechanism changes beyond basic todo storage without an explicit
  requirements update.

## Development Workflow & Quality Gates

- Work happens on feature branches (e.g. `feature/<name>`); merges to the default branch happen via
  pull request.
- Before opening a pull request: linting MUST pass, all tests MUST pass, and new/changed behavior
  MUST have corresponding test coverage.
- Commit messages MUST be atomic and describe the "why" of the change, following the format in
  [docs/coding-guidelines.md](../../docs/coding-guidelines.md).
- Reviewers MUST verify compliance with the Code Review Checklist in
  [docs/coding-guidelines.md](../../docs/coding-guidelines.md) (naming, imports, DRY, error handling,
  tests, no leftover `console.log`) before approving.

## Governance

This constitution supersedes conflicting practices described elsewhere in the docs; where a docs file
and this constitution disagree, the constitution's stated principle governs and the docs file MUST be
updated to match.

Amendments require: (1) a documented rationale for the change, (2) an update to this file including
the Sync Impact Report header, and (3) a version bump following semantic versioning — MAJOR for
backward-incompatible principle removals/redefinitions, MINOR for new principles or materially
expanded guidance, PATCH for clarifications and wording fixes. All pull requests MUST be checked for
constitutional compliance; any deviation MUST be justified in the PR description or rejected.
Complexity that cannot be justified against Principle III (Simplicity & Scope Discipline) MUST be
simplified before merge. Use the docs referenced above ([docs/coding-guidelines.md](../../docs/coding-guidelines.md),
[docs/testing-guidelines.md](../../docs/testing-guidelines.md), [docs/ui-guidelines.md](../../docs/ui-guidelines.md),
[docs/functional-requirements.md](../../docs/functional-requirements.md), [docs/project-overview.md](../../docs/project-overview.md))
for detailed, runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-08-11 | **Last Amended**: 2026-08-11
