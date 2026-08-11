import { isOverdue } from '../todoStatus';

describe('isOverdue', () => {
  const referenceDate = new Date('2026-08-11T12:00:00');

  it('returns true when incomplete and dueDate is in the past', () => {
    const todo = { dueDate: '2026-08-10', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(true);
  });

  it('returns false when incomplete and dueDate is today', () => {
    const todo = { dueDate: '2026-08-11', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when incomplete and dueDate is in the future', () => {
    const todo = { dueDate: '2026-08-12', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when incomplete and dueDate is null', () => {
    const todo = { dueDate: null, completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when incomplete and dueDate is undefined', () => {
    const todo = { completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when incomplete and dueDate is an empty string', () => {
    const todo = { dueDate: '', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when completed and dueDate is in the past', () => {
    const todo = { dueDate: '2026-08-10', completed: 1 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when completed (boolean true) and dueDate is in the past', () => {
    const todo = { dueDate: '2026-08-10', completed: true };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('defaults referenceDate to now when not provided', () => {
    const pastTodo = { dueDate: '2000-01-01', completed: 0 };
    expect(isOverdue(pastTodo)).toBe(true);
  });

  it('does not mutate the todo object', () => {
    const todo = { dueDate: '2026-08-10', completed: 0 };
    const copy = { ...todo };
    isOverdue(todo, referenceDate);
    expect(todo).toEqual(copy);
  });
});
