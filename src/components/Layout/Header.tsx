import React from 'react';
import { Eye, LogOut } from 'lucide-react';

interface HeaderProps {
  onViewInvoice: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onViewInvoice, 
  onLogout,
  isLoading 
}) => {
  return (
    <div className="topbar">
      <h1>B_NIN Tracker</h1>
      <div className="topbar-right">
        <div className="download-group">
          <button className="btn-download view" onClick={onViewInvoice} disabled={isLoading}>
            <Eye className="w-4 h-4" /> View Invoice
          </button>
          <button className="btn-download logout" onClick={onLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
