import React from 'react';
import { FileSpreadsheet, FileText, Eye, X } from 'lucide-react';

interface AdvancedReportModalProps {
  onClose: () => void;
  onDownload: (type: 'excel' | 'pdf', advanced: boolean) => void;
  onView: (advanced: boolean) => void;
  expDates: { start: string; end: string };
  setExpDates: (dates: { start: string; end: string }) => void;
  recDates: { start: string; end: string };
  setRecDates: (dates: { start: string; end: string }) => void;
  error: string;
}

export const AdvancedReportModal: React.FC<AdvancedReportModalProps> = ({
  onClose,
  onDownload,
  onView,
  expDates,
  setExpDates,
  recDates,
  setRecDates,
  error
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Advanced Report</h2>
          <button className="btn-close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="advanced-form">
          <div className="filter-section">
            <h3>Expenses Period</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>From:</label>
                <input 
                  type="date" 
                  value={expDates.start} 
                  onChange={e => setExpDates({ ...expDates, start: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>To:</label>
                <input 
                  type="date" 
                  value={expDates.end} 
                  onChange={e => setExpDates({ ...expDates, end: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>Receives Period</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>From:</label>
                <input 
                  type="date" 
                  value={recDates.start} 
                  onChange={e => setRecDates({ ...recDates, start: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>To:</label>
                <input 
                  type="date" 
                  value={recDates.end} 
                  onChange={e => setRecDates({ ...recDates, end: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {error && <div className="validation-alert">{error}</div>}

          <div className="download-group" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn-submit flex items-center gap-2" 
              onClick={() => onDownload('excel', true)}
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button 
              className="btn-submit flex items-center gap-2" 
              style={{ backgroundColor: '#d32f2f' }} 
              onClick={() => onDownload('pdf', true)}
            >
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button 
              className="btn-submit flex items-center gap-2" 
              style={{ backgroundColor: '#0f172a' }} 
              onClick={() => onView(true)}
            >
              <Eye className="w-4 h-4" /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
