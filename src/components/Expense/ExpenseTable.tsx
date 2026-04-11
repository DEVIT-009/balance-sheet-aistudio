import React, { useState, useEffect, useRef } from 'react';
import { Expense } from '../../types/expense';
import { formatDate, formatCurrency } from '../../utils/format';
import { MoreVertical, Eye, Pencil, Send, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ImageModal } from '../UI/ImageModal';
import { TransferModal } from './TransferModal';

interface ExpenseTableProps {
  expenses: Expense[];
  totalExpense: number;
  editingId: string | null;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onViewDetail: (expense: Expense) => void;
  onTransfer: (expense: Expense) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, totalExpense, editingId, onEdit, onDelete, onViewDetail, onTransfer, showToast }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [transferringExpense, setTransferringExpense] = useState<Expense | null>(null);
  const [sortKey, setSortKey] = useState<'date' | 'price' | 'delivery' | 'total' | 'status' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'transfered' | 'not yet'>('all');
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

  let displayExpenses = [...expenses];
  if (filterStatus !== 'all') {
    displayExpenses = displayExpenses.filter(e => filterStatus === 'transfered' ? e.is_transfer : !e.is_transfer);
  }

  if (sortKey) {
    displayExpenses.sort((a, b) => {
      let aVal: any = a[sortKey as keyof Expense];
      let bVal: any = b[sortKey as keyof Expense];
      if (sortKey === 'status') {
        aVal = a.is_transfer ? 1 : 0;
        bVal = b.is_transfer ? 1 : 0;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: 'date' | 'price' | 'delivery' | 'total' | 'status') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown size={14} style={{ display: 'inline', marginLeft: '4px', opacity: 0.4 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={14} style={{ display: 'inline', marginLeft: '4px', color: 'var(--tab-active)' }} /> 
                               : <ArrowDown size={14} style={{ display: 'inline', marginLeft: '4px', color: 'var(--tab-active)' }} />;
  };

  return (
    <div className="panel">
      {modalImageUrl && (
        <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />
      )}
      {transferringExpense && (
        <TransferModal
          expense={transferringExpense}
          onClose={() => setTransferringExpense(null)}
          onSubmit={async (updatedExpense) => {
            try {
              await Promise.resolve(onTransfer(updatedExpense));
              setTransferringExpense(null);
              showToast(updatedExpense.is_transfer ? 'Expense transferred successfully' : 'Transfer cancelled successfully', 'success');
            } catch (err) {
              showToast('Error processing transfer', 'error');
            }
          }}
          showToast={showToast}
        />
      )}
      {expenses.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total Expense:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>${formatCurrency(totalExpense)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', background: 'white' }}
            >
              <option value="all">All Status</option>
              <option value="transfered">Transfered</option>
              <option value="not yet">Not Yet</option>
            </select>
          </div>
        </div>
      )}
      <div className="table-responsive" ref={menuRef}>
        <table className="table-zebra">
          <thead>
            <tr>
              <th>N</th>
              <th className="date-col" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('date')}>Date {getSortIcon('date')}</th>
              <th className="text-right" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('price')}>Price {getSortIcon('price')}</th>
              <th className="text-right" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('delivery')}>Delivery {getSortIcon('delivery')}</th>
              <th className="text-right" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('total')}>Total {getSortIcon('total')}</th>
              <th>Description</th>
              <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th className="text-center">Image</th>
              <th className="action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayExpenses.length === 0 ? (
              <tr><td colSpan={9} className="empty-state">No entries found.</td></tr>
            ) : (
              displayExpenses.map((exp, i) => (
                <tr key={`${exp.id}-${i}`} className={editingId === exp.id ? 'row-highlight' : ''}>
                  <td>{i + 1}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                  <td className="text-right">${formatCurrency(exp.price)}</td>
                  <td className="text-right">${formatCurrency(exp.delivery)}</td>
                  <td className="text-right">${formatCurrency(exp.total)}</td>
                  <td>{stripDescription(exp.description)}</td>
                  <td>
                    {
                      exp.is_transfer 
                      ? <span className="badge badge-success">transfered</span>
                      : <span className="badge badge-error">not yet</span>
                    }
                  </td>
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
                          <button onClick={() => { onViewDetail(exp); closeMenu(); }}>
                            <Eye size={16} /> Detail
                          </button>
                          <button onClick={() => { onEdit(exp); closeMenu(); }}>
                            <Pencil size={16} /> Edit
                          </button>
                          <button onClick={() => { setTransferringExpense(exp); closeMenu(); }}>
                            <Send size={16} /> Transfered
                          </button>
                          <button className="btn-delete-menu" onClick={() => { handleDelete(exp.id); closeMenu(); }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
