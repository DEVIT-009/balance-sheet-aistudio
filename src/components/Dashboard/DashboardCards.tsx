import React from 'react';
import { formatCurrency } from '../../utils/format';

interface DashboardCardsProps {
  totalExpense: number;
  totalReceived: number;
  balance: number;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ totalExpense, totalReceived, balance }) => {
  return (
    <div className="cards">
      <div className="card">
        <h3>Total Expense</h3>
        <p className="value text-orange">${formatCurrency(totalExpense)}</p>
      </div>
      <div className="card">
        <h3>Total Received</h3>
        <p className="value text-teal">${formatCurrency(totalReceived)}</p>
      </div>
      <div className="card">
        <h3>Balance</h3>
        <p className={`value ${balance >= 0 ? 'text-green' : 'text-red'}`}>
          ${formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};
