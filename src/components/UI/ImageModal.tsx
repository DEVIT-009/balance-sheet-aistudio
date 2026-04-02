import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content image-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ marginBottom: 0 }}>Image Preview</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="image-preview-container">
          <img src={imageUrl} alt="Full screen preview" />
        </div>
      </div>
    </div>
  );
};
