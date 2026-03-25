import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { Expense } from '../../types/expense';
import { Receive } from '../../types/receive';

interface InvoiceViewProps {
  onClose: () => void;
  data: {
    expenses: Expense[];
    receives: Receive[];
    totalExp: number;
    totalRec: number;
    balance: number;
  };
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ onClose, data }) => {
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
            <div className="amt text-teal">${data.totalRec.toFixed(2)}</div>
          </div>
          <div className="summary-box">
            <label>Total Expense</label>
            <div className="amt text-orange">${data.totalExp.toFixed(2)}</div>
          </div>
          <div className="summary-box" style={{ borderLeft: '4px solid ' + (data.balance >= 0 ? 'var(--bal-pos)' : 'var(--bal-neg)') }}>
            <label>Current Balance</label>
            <div className={`amt ${data.balance >= 0 ? 'text-green' : 'text-red'}`}>
              ${data.balance.toFixed(2)}
            </div>
          </div>
        </div>

        <h2 className="invoice-section-title">Expenses Details</h2>
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
            {data.expenses.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>{formatDate(e.date)}</td>
                <td>${Number(e.price).toFixed(2)}</td>
                <td>${Number(e.delivery).toFixed(2)}</td>
                <td>${Number(e.total).toFixed(2)}</td>
                <td>{e.description}</td>
              </tr>
            ))}
            <tr className="invoice-total-row">
              <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL EXPENSE</td>
              <td>${data.totalExp.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <h2 className="invoice-section-title">Receive Cash Details</h2>
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>N</th>
              <th>Date</th>
              <th>Amount Received</th>
            </tr>
          </thead>
          <tbody>
            {data.receives.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{formatDate(r.date)}</td>
                <td>${Number(r.receive).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="invoice-total-row">
              <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL RECEIVED</td>
              <td>${data.totalRec.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
