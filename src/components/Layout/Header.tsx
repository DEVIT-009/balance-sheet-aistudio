import React from 'react';
import { FileSpreadsheet, FileText, Eye, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onDownload: (type: 'excel' | 'pdf') => void;
  onViewInvoice: () => void;
  onOpenAdvance: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onDownload, 
  onViewInvoice, 
  onOpenAdvance, 
  onLogout,
  isLoading 
}) => {
  return (
    <div className="topbar">
      <h1>B_NIN Tracker</h1>
      <div className="topbar-right">
        <div className="download-group">
          <button className="btn-download excel" onClick={() => onDownload('excel')} disabled={isLoading}>
            <FileSpreadsheet className="w-4 h-4" /> Download Excel
          </button>
          <button className="btn-download pdf" onClick={() => onDownload('pdf')} disabled={isLoading}>
            <FileText className="w-4 h-4" /> Download PDF
          </button>
          <button className="btn-download view" onClick={onViewInvoice} disabled={isLoading}>
            <Eye className="w-4 h-4" /> View Invoice
          </button>
          <button className="btn-download advance" onClick={onOpenAdvance} disabled={isLoading}>
            <Settings className="w-4 h-4" /> Advance
          </button>
          <button className="btn-download logout" onClick={onLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
