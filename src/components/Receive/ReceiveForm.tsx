import React, { useState, useEffect } from 'react';
import { Receive } from '../../types/receive';

interface ReceiveFormProps {
  editingReceive: Receive | null;
  onSubmit: (receive: Omit<Receive, 'id'> | Receive) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ReceiveForm: React.FC<ReceiveFormProps> = ({ editingReceive, onSubmit, onCancel, showToast }) => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (editingReceive) {
      setDate(editingReceive.date);
      setAmount(editingReceive.receive.toString());
    } else {
      resetForm();
    }
  }, [editingReceive]);

  const resetForm = () => {
    setDate('');
    setAmount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || amount === '') {
      showToast('Date and Amount are required', 'error');
      return;
    }

    const receiveData = {
      date,
      receive: Number(amount)
    };

    if (editingReceive) {
      onSubmit({ ...receiveData, id: editingReceive.id });
      showToast('Receive updated successfully');
    } else {
      onSubmit(receiveData);
      showToast('Receive added successfully');
      resetForm();
    }
  };

  return (
    <div className="form-section">
      <h2>{editingReceive ? 'Edit Receive' : 'Add New Receive'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Amount Received *</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingReceive ? 'Update Receive' : 'Add Receive'}
          </button>
          {editingReceive && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
