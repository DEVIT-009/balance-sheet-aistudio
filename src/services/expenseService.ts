import { Expense } from '../types/expense';

const API_URL = '/api/expenses';

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },
  
  create: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },
  
  update: async (id: string, updatedExpense: Expense): Promise<Expense> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExpense),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete expense');
  }
};
