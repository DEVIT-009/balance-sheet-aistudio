import { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense } from '../types/expense';
import { expenseService } from '../services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalExpense = useMemo(() => 
    expenses.reduce((sum, exp) => sum + Number(exp.total), 0), 
  [expenses]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await expenseService.create(expense);
      setExpenses(prev => [...prev, newExpense]);
    } catch (err) {
      console.error('Failed to add expense', err);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expense: Expense) => {
    try {
      const updated = await expenseService.update(id, expense);
      setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    } catch (err) {
      console.error('Failed to update expense', err);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  }, []);

  return { expenses, totalExpense, addExpense, updateExpense, deleteExpense, loading, error };
};
