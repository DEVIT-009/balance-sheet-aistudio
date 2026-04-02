import React, { useState, useEffect, useRef } from 'react';
import { Expense } from '../../types/expense';
import { formatCurrency } from '../../utils/format';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ExpenseFormProps {
  editingExpense: Expense | null;
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  onCancel: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ editingExpense, onSubmit, onCancel, showToast }) => {
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('0');
  const [description, setDescription] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const { previewUrl, secureUrl, isUploading, uploadError, handleFileChange, resetImage, setExistingImage } =
    useImageUpload();

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date);
      setPrice(editingExpense.price.toString());
      setDelivery(editingExpense.delivery.toString());
      setDescription(editingExpense.description);
      if (editingExpense.image) setExistingImage(editingExpense.image);
      else resetImage();
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDate('');
    setPrice('');
    setDelivery('0');
    setDescription('');
    resetImage();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || price === '') {
      showToast('Date and Price are required', 'error');
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

    const priceNum = Number(price);
    const deliveryNum = Number(delivery) || 0;

    const expenseData = {
      date,
      price: priceNum,
      delivery: deliveryNum,
      total: priceNum + deliveryNum,
      description,
      image: secureUrl, // empty string when no image chosen
    };

    if (editingExpense) {
      onSubmit({ ...expenseData, id: editingExpense.id });
      showToast('Expense updated successfully');
    } else {
      onSubmit(expenseData);
      showToast('Expense added successfully');
      resetForm();
    }
  };

  return (
    <div className="form-section">
      <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Delivery</label>
            <input type="number" step="0.01" value={delivery} onChange={e => setDelivery(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
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
        <div className="live-preview">
          Total = ${formatCurrency((Number(price) || 0) + (Number(delivery) || 0))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isUploading}>
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
