import React, { useMemo, useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { Expense } from '../../types/expense';
import { Receive } from '../../types/receive';

interface InvoiceViewProps {
  onClose: () => void;
  expenses: Expense[];
  receives: Receive[];
}

const isWithinRange = (date: string, start: string, end: string) => {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const InvoiceView: React.FC<InvoiceViewProps> = ({ onClose, expenses, receives }) => {
  const [expenseFilter, setExpenseFilter] = useState({ start: '', end: '' });
  const [receiveFilter, setReceiveFilter] = useState({ start: '', end: '' });

  const filteredExpenses = useMemo(
    () => expenses.filter((expense) => isWithinRange(expense.date, expenseFilter.start, expenseFilter.end)),
    [expenses, expenseFilter.start, expenseFilter.end]
  );

  const filteredReceives = useMemo(
    () => receives.filter((receive) => isWithinRange(receive.date, receiveFilter.start, receiveFilter.end)),
    [receives, receiveFilter.start, receiveFilter.end]
  );

  const totalExpense = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + Number(expense.total), 0),
    [filteredExpenses]
  );

  const totalReceive = useMemo(
    () => filteredReceives.reduce((sum, receive) => sum + Number(receive.receive), 0),
    [filteredReceives]
  );

  const balance = totalReceive - totalExpense;

  return (
    <div className="invoice-view">
      <div className="invoice-actions no-print">
        <button className="btn-cancel" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" /> Back to Tracker
        </button>
        <button className="btn-submit" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print / PDF
        </button>
      </div>
      
      <div className="invoice-paper">
        <div className="invoice-header">
          <div>
            <h1>B_NIN Tracker Report</h1>
            <p>Financial Summary Statement</p>
          </div>
          <div className="invoice-meta">
            <p><strong>Generated on</strong></p>
            <p>{formatDate(new Date().toISOString().split('T')[0])}</p>
          </div>
        </div>

        <div className="invoice-summary-grid">
          <div className="summary-box">
            <label>Total Received</label>
            <div className="amt text-teal">${formatCurrency(totalReceive)}</div>
          </div>
          <div className="summary-box">
            <label>Total Expense</label>
            <div className="amt text-orange">${formatCurrency(totalExpense)}</div>
          </div>
          <div className="summary-box" style={{ borderLeft: '4px solid ' + (balance >= 0 ? 'var(--bal-pos)' : 'var(--bal-neg)') }}>
            <label>Current Balance</label>
            <div className={`amt ${balance >= 0 ? 'text-green' : 'text-red'}`}>
              ${formatCurrency(balance)}
            </div>
          </div>
        </div>

        <h2 className="invoice-section-title">Expenses Details</h2>
        <div className="invoice-filter-grid no-print">
          <div className="invoice-filter-card">
            <div className="invoice-filter-header">
              <strong>Expense Filter</strong>
              <button
                type="button"
                className="btn-cancel invoice-filter-reset"
                onClick={() => setExpenseFilter({ start: '', end: '' })}
              >
                Reset
              </button>
            </div>
            <div className="invoice-filter-fields">
              <label className="form-group">
                <span>Start Date</span>
                <input
                  type="date"
                  value={expenseFilter.start}
                  onChange={(event) => setExpenseFilter((current) => ({ ...current, start: event.target.value }))}
                />
              </label>
              <label className="form-group">
                <span>End Date</span>
                <input
                  type="date"
                  value={expenseFilter.end}
                  onChange={(event) => setExpenseFilter((current) => ({ ...current, end: event.target.value }))}
                />
              </label>
            </div>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>N</th>
              <th>Date</th>
              <th>Price</th>
              <th>Delivery</th>
              <th>Total</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">No expense data in this date range.</td>
              </tr>
            ) : (
              filteredExpenses.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(e.date)}</td>
                  <td>${Number(e.price).toFixed(2)}</td>
                  <td>${Number(e.delivery).toFixed(2)}</td>
                  <td>${Number(e.total).toFixed(2)}</td>
                  <td>{e.description}</td>
                </tr>
              ))
            )}
            <tr className="invoice-total-row">
              <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL EXPENSE</td>
              <td>${formatCurrency(totalExpense)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <h2 className="invoice-section-title">Receive Cash Details</h2>
        <div className="invoice-filter-grid no-print">
          <div className="invoice-filter-card">
            <div className="invoice-filter-header">
              <strong>Receive Filter</strong>
              <button
                type="button"
                className="btn-cancel invoice-filter-reset"
                onClick={() => setReceiveFilter({ start: '', end: '' })}
              >
                Reset
              </button>
            </div>
            <div className="invoice-filter-fields">
              <label className="form-group">
                <span>Start Date</span>
                <input
                  type="date"
                  value={receiveFilter.start}
                  onChange={(event) => setReceiveFilter((current) => ({ ...current, start: event.target.value }))}
                />
              </label>
              <label className="form-group">
                <span>End Date</span>
                <input
                  type="date"
                  value={receiveFilter.end}
                  onChange={(event) => setReceiveFilter((current) => ({ ...current, end: event.target.value }))}
                />
              </label>
            </div>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>N</th>
              <th>Date</th>
              <th>Amount Received</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceives.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-state">No receive data in this date range.</td>
              </tr>
            ) : (
              filteredReceives.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(r.date)}</td>
                  <td>${Number(r.receive).toFixed(2)}</td>
                </tr>
              ))
            )}
            <tr className="invoice-total-row">
              <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL RECEIVED</td>
              <td>${formatCurrency(totalReceive)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
