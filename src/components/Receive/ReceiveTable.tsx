import React from 'react';
import { Receive } from '../../types/receive';
import { formatDate, formatCurrency } from '../../utils/format';

interface ReceiveTableProps {
  receives: Receive[];
  totalReceived: number;
  editingId: string | null;
  onEdit: (receive: Receive) => void;
  onDelete: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ReceiveTable: React.FC<ReceiveTableProps> = ({ receives, totalReceived, editingId, onEdit, onDelete, showToast }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this receive entry?')) {
      onDelete(id);
      showToast('Receive deleted successfully');
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
              <th className="text-right">Amount Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receives.length === 0 ? (
              <tr><td colSpan={4} className="empty-state">No entries yet. Add one above.</td></tr>
            ) : (
              receives.map((rec, i) => (
                <tr key={rec.id} className={editingId === rec.id ? 'row-highlight' : ''}>
                  <td>{i + 1}</td>
                  <td>{formatDate(rec.date)}</td>
                  <td className="text-right">${formatCurrency(rec.receive)}</td>
                  <td>
                    <button className="btn-icon" onClick={() => onEdit(rec)}>Edit</button>
                    <button className="btn-icon delete" onClick={() => handleDelete(rec.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
            {receives.length > 0 && (
              <tr className="totals-row">
                <td colSpan={2} className="text-right">Total Received:</td>
                <td className="text-right">${formatCurrency(totalReceived)}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
