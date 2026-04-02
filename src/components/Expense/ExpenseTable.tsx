import React, { useState, useEffect, useRef } from 'react';
import { Expense } from '../../types/expense';
import { formatDate, formatCurrency } from '../../utils/format';
import { MoreVertical, X } from 'lucide-react';
import { ImageModal } from '../UI/ImageModal';

interface ExpenseTableProps {
  expenses: Expense[];
  totalExpense: number;
  editingId: string | null;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onViewDetail: (expense: Expense) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, totalExpense, editingId, onEdit, onDelete, onViewDetail, showToast }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
      showToast('Expense deleted successfully');
    }
  };

  const handleMenuClick = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const closeMenu = () => {
    setActiveMenuId(null);
  };

  const stripDescription = (desc: string) => {
    return desc.length > 15 ? desc.substring(0, 15) + '...' : desc;
  };

  return (
    <div className="panel">
      {modalImageUrl && (
        <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />
      )}
      <div className="table-responsive" ref={menuRef}>
        <table>
          <thead>
            <tr>
              <th>N</th>
              <th className="date-col">Date</th>
              <th className="text-right">Price</th>
              <th className="text-right">Delivery</th>
              <th className="text-right">Total</th>
              <th>Description</th>
              <th>Image</th>
              <th className="action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan={8} className="empty-state">No entries yet. Add one above.</td></tr>
            ) : (
              expenses.map((exp, i) => (
                <tr key={`${exp.id}-${i}`} className={editingId === exp.id ? 'row-highlight' : ''}>
                  <td>{i + 1}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                  <td className="text-right">${formatCurrency(exp.price)}</td>
                  <td className="text-right">${formatCurrency(exp.delivery)}</td>
                  <td className="text-right">${formatCurrency(exp.total)}</td>
                  <td>{stripDescription(exp.description)}</td>
                  <td className="img-cell">
                    {exp.image
                      ? <div onClick={() => setModalImageUrl(exp.image)} style={{ cursor: 'pointer' }}>
                          <img src={exp.image} alt="receipt" className="img-thumb" />
                        </div>
                      : <span className="img-empty">—</span>}
                  </td>
                  <td className="action-col">
                    <div className="action-menu-container">
                      <button className="btn-icon-menu" onClick={() => handleMenuClick(exp.id)}>
                        <MoreVertical size={18} />
                      </button>
                      {activeMenuId === exp.id && (
                        <div className="action-dropdown">
                          <button onClick={() => { onViewDetail(exp); closeMenu(); }}>Detail</button>
                          <button onClick={() => { onEdit(exp); closeMenu(); }}>Edit</button>
                          <button className="text-red" onClick={() => { handleDelete(exp.id); closeMenu(); }}>Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
            {expenses.length > 0 && (
              <tr className="totals-row">
                <td colSpan={4} className="text-right">Total Expense:</td>
                <td className="text-right">${formatCurrency(totalExpense)}</td>
                <td colSpan={3}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
