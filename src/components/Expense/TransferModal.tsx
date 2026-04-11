import React, { useState, useRef } from 'react';
import { Expense } from '../../types/expense';
import { useImageUpload } from '../../hooks/useImageUpload';

interface TransferModalProps {
  expense: Expense;
  onClose: () => void;
  onSubmit: (updatedExpense: Expense) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ expense, onClose, onSubmit, showToast }) => {
  const [transferTo, setTransferTo] = useState(expense.transfer_to || '');
  const [transferAt, setTransferAt] = useState(expense.transfer_at || new Date().toISOString().split('T')[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { previewUrl, secureUrl, isUploading, uploadError, handleFileChange, resetImage } = useImageUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      showToast('Please wait for the image to finish uploading', 'error');
      return;
    }
    if (uploadError) {
      showToast('Fix the image upload error before submitting', 'error');
      return;
    }

    onSubmit({
      ...expense,
      is_transfer: true,
      transfer_to: transferTo,
      transfer_at: transferAt,
      transfer_image: secureUrl || expense.transfer_image || ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Transfer Expense</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="advanced-form">
          <div className="form-group">
            <label>Transfer To</label>
            <textarea
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Transfer Date</label>
            <input
              type="date"
              value={transferAt}
              onChange={(e) => setTransferAt(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Transfer Image <span className="label-optional">(optional)</span></label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="input-file"
              onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {isUploading && <p className="upload-status uploading">⏳ Uploading…</p>}
            {uploadError && <p className="upload-status error">⚠️ {uploadError}</p>}
            {previewUrl && !isUploading && !uploadError && (
              <div className="preview-container">
                <img src={previewUrl} alt="preview" className="img-preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => {
                    resetImage();
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            {!previewUrl && expense.transfer_image && (
              <div className="preview-container">
                <img src={expense.transfer_image} alt="preview" className="img-preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn-submit" disabled={isUploading}>Save Transfer</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Close</button>
            
            {expense.is_transfer && (
              <button 
                type="button" 
                className="btn-cancel text-red" 
                style={{ marginLeft: 'auto', borderColor: 'var(--bal-neg)' }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this transfer?')) {
                    onSubmit({
                      ...expense,
                      is_transfer: false,
                      transfer_at: '',
                      transfer_to: '',
                      transfer_image: ''
                    });
                  }
                }}
              >
                Cancel this transfer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
