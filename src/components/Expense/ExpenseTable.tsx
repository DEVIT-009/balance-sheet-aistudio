import React from 'react';
import { Expense } from '../../types/expense';
import { formatDate, formatCurrency } from '../../utils/format';

interface ExpenseTableProps {
  expenses: Expense[];
  totalExpense: number;
  editingId: string | null;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, totalExpense, editingId, onEdit, onDelete, showToast }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
      showToast('Expense deleted successfully');
    }
  };

  return (
    <div className="panel">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>N</th>
              <th className="date-col">Date</th>
              <th className="text-right">Price</th>
              <th className="text-right">Delivery</th>
              <th className="text-right">Total</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">No entries yet. Add one above.</td></tr>
            ) : (
              expenses.map((exp, i) => (
                <tr key={exp.id} className={editingId === exp.id ? 'row-highlight' : ''}>
                  <td>{i + 1}</td>
                  <td>{formatDate(exp.date)}</td>
                  <td className="text-right">${formatCurrency(exp.price)}</td>
                  <td className="text-right">${formatCurrency(exp.delivery)}</td>
                  <td className="text-right">${formatCurrency(exp.total)}</td>
                  <td>{exp.description}</td>
                  <td>
                    <button className="btn-icon" onClick={() => onEdit(exp)}>Edit</button>
                    <button className="btn-icon delete" onClick={() => handleDelete(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
            {expenses.length > 0 && (
              <tr className="totals-row">
                <td colSpan={4} className="text-right">Total Expense:</td>
                <td className="text-right">${formatCurrency(totalExpense)}</td>
                <td colSpan={2}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
