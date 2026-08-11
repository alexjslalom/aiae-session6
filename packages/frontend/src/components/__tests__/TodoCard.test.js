import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue indicator', () => {
    const toISODate = (date) => date.toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    it('should render the overdue indicator for an incomplete todo with a past due date', () => {
      const overdueTodo = { ...mockTodo, dueDate: toISODate(yesterday), completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    });

    it('should not render the overdue indicator for a todo due today', () => {
      const dueTodayTodo = { ...mockTodo, dueDate: toISODate(today), completed: 0 };
      render(<TodoCard todo={dueTodayTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should not render the overdue indicator for a todo with a future due date', () => {
      const futureTodo = { ...mockTodo, dueDate: toISODate(tomorrow), completed: 0 };
      render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should not render the overdue indicator for a completed todo with a past due date', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: toISODate(yesterday), completed: 1 };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should remove the overdue indicator when a todo is toggled from incomplete to completed', () => {
      const overdueTodo = { ...mockTodo, dueDate: toISODate(yesterday), completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/Overdue/)).toBeInTheDocument();

      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('should not render the overdue indicator for an incomplete todo with no due date', () => {
      const noDueDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });
  });
});
