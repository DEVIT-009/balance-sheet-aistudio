import React from 'react';
import { Expense } from '../../types/expense';
import { formatDate, formatCurrency } from '../../utils/format';

interface RecentExpensesProps {
  expenses: Expense[];
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'receives') => void;
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses, setActiveTab }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Recent Expenses</h2>
        <span className="link" onClick={() => setActiveTab('expenses')}>View All</span>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th className="date-col">Date</th>
              <th className="text-right">Total</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan={3} className="empty-state">No entries yet. Add one above.</td></tr>
            ) : (
              [...expenses].slice(-5).reverse().map((exp, i) => (
                <tr key={`${exp.id}-${i}`}>
                  <td>{formatDate(exp.date)}</td>
                  <td className="text-right">${formatCurrency(exp.total)}</td>
                  <td>{exp.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
