import { Expense } from '../types/expense';
import { API_BASE_URL, getHeaders, getHeadersWithoutContentType } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/expenses`;

const convertToExpense = (data: any): Expense => ({
  ...data,
  price: Number(data.price) || 0,
  delivery: Number(data.delivery) || 0,
  total: Number(data.total) || 0,
});

const convertToExpensePayload = (expense: Omit<Expense, 'id'> | Expense) => {
  const { id, ...data } = expense as any;
  return {
    ...data,
    price: String(expense.price),
    delivery: String(expense.delivery),
    total: String(expense.total),
  };
};

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeadersWithoutContentType(),
    });
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const result = await response.json();
    const dataArray = Array.isArray(result) ? result : (result.data && Array.isArray(result.data) ? result.data : []);
    return dataArray.map(convertToExpense);
  },
  
  create: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(convertToExpensePayload(expense)),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    const result = await response.json();
    const data = result.data ? result.data : result;
    return convertToExpense(data);
  },
  
  update: async (id: string, updatedExpense: Expense): Promise<Expense> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(convertToExpensePayload(updatedExpense)),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    const result = await response.json();
    const data = result.data ? result.data : result;
    return convertToExpense(data);
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeadersWithoutContentType(),
    });
    if (!response.ok) throw new Error('Failed to delete expense');
  }
};
