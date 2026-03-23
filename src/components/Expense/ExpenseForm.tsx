import React, { useState, useEffect } from 'react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/format';

interface ExpenseFormProps {
  editingExpense: Expense | null;
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ editingExpense, onSubmit, onCancel, showToast }) => {
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('0');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date);
      setPrice(editingExpense.price.toString());
      setDelivery(editingExpense.delivery.toString());
      setDescription(editingExpense.description);
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDate('');
    setPrice('');
    setDelivery('0');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || price === '') {
      showToast('Date and Price are required', 'error');
      return;
    }

    const priceNum = Number(price);
    const deliveryNum = Number(delivery) || 0;

    const expenseData = {
      date,
      price: priceNum,
      delivery: deliveryNum,
      total: priceNum + deliveryNum,
      description
    };

    if (editingExpense) {
      onSubmit({ ...expenseData, id: editingExpense.id });
      showToast('Expense updated successfully');
    } else {
      onSubmit(expenseData);
      showToast('Expense added successfully');
      resetForm();
    }
  };

  return (
    <div className="form-section">
      <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Delivery</label>
            <input type="number" step="0.01" value={delivery} onChange={e => setDelivery(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="live-preview">
          Total = ${formatCurrency((Number(price) || 0) + (Number(delivery) || 0))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
