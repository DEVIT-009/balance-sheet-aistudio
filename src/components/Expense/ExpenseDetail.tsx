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
            <Truck size={20} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Transfer Status
          </h3>
          <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {expense.is_transfer ? (
              <>
                <p style={{ fontWeight: 600, color: 'var(--bal-pos)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  ✓ Item is transfered.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div className="detail-label">Transfer Date</div>
                    <div className="detail-value">{expense.transfer_at ? formatDate(expense.transfer_at) : '—'}</div>
                  </div>
                  <div>
                    <div className="detail-label">Transfer To</div>
                    <div className="detail-value">{expense.transfer_to || '—'}</div>
                  </div>
                </div>
                {expense.transfer_image && (
                  <div style={{ marginTop: '2rem' }}>
                    <div className="detail-label" style={{ marginBottom: '0.5rem' }}>Transfer Image</div>
                    <div className="image-large-container">
                      <img src={expense.transfer_image} alt="Transfer Details" className="detail-image-large" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Item is NOT transfer yet.</p>
            )}
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
