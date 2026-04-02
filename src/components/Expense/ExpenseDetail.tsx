import React from 'react';
import { Expense } from '../../types/expense';
import { formatDate, formatCurrency } from '../../utils/format';
import { Calendar, Tag, DollarSign, Truck, Wallet, ChevronLeft, Image as ImageIcon } from 'lucide-react';

interface ExpenseDetailProps {
  expense: Expense;
  onBack: () => void;
}

export const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ expense, onBack }) => {
  return (
    <div className="detail-view">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          <ChevronLeft size={20} /> Back to List
        </button>
        <h2>Expense Details</h2>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          <div className="detail-item">
            <div className="icon-box bg-blue">
              <Calendar size={24} className="text-white" />
            </div>
            <div className="detail-info">
              <span className="detail-label">Date</span>
              <span className="detail-value">{formatDate(expense.date)}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-box bg-purple">
              <Tag size={24} className="text-white" />
            </div>
            <div className="detail-info">
              <span className="detail-label">Description</span>
              <span className="detail-value">{expense.description || '—'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-box bg-orange">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="detail-info">
              <span className="detail-label">Price</span>
              <span className="detail-value text-xl font-bold">${formatCurrency(expense.price)}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-box bg-teal">
              <Truck size={24} className="text-white" />
            </div>
            <div className="detail-info">
              <span className="detail-label">Delivery</span>
              <span className="detail-value font-semibold">${formatCurrency(expense.delivery)}</span>
            </div>
          </div>

          <div className="detail-item highlight-total">
            <div className="icon-box bg-green">
              <Wallet size={24} className="text-white" />
            </div>
            <div className="detail-info">
              <span className="detail-label text-green-dark">Total</span>
              <span className="detail-value text-2xl font-bold text-green-dark">${formatCurrency(expense.total)}</span>
            </div>
          </div>
        </div>

        <div className="detail-image-section">
          <h3>
            <ImageIcon size={20} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Receipt Image
          </h3>
          <div className="image-large-container">
            {expense.image ? (
              <img src={expense.image} alt="Receipt Details" className="detail-image-large" />
            ) : (
              <div className="detail-no-image">
                <span>— No Image Provided —</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
