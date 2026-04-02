import React, { useState, useEffect, useRef } from 'react';
import { Receive } from '../../types/receive';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ReceiveFormProps {
  editingReceive: Receive | null;
  onSubmit: (receive: Omit<Receive, 'id'> | Receive) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ReceiveForm: React.FC<ReceiveFormProps> = ({ editingReceive, onSubmit, onCancel, showToast }) => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const { previewUrl, secureUrl, isUploading, uploadError, handleFileChange, resetImage, setExistingImage } =
    useImageUpload();

  useEffect(() => {
    if (editingReceive) {
      setDate(editingReceive.date);
      setAmount(editingReceive.receive.toString());
      if (editingReceive.image) setExistingImage(editingReceive.image);
      else resetImage();
    } else {
      resetForm();
    }
  }, [editingReceive]);

  const resetForm = () => {
    setDate('');
    setAmount('');
    resetImage();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || amount === '') {
      showToast('Date and Amount are required', 'error');
      return;
    }
    if (isUploading) {
      showToast('Please wait for the image to finish uploading', 'error');
      return;
    }
    if (uploadError) {
      showToast('Fix the image upload error before submitting', 'error');
      return;
    }

    const receiveData = {
      date,
      receive: Number(amount),
      image: secureUrl,
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
          <div className="form-group">
            <label>Image <span className="label-optional">(optional)</span></label>
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
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isUploading}>
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
