import React from 'react';
import { Receive } from '../../types/receive';
import { formatDate, formatCurrency } from '../../utils/format';

interface RecentReceivesProps {
  receives: Receive[];
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'receives') => void;
}

export const RecentReceives: React.FC<RecentReceivesProps> = ({ receives, setActiveTab }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Recent Receives</h2>
        <span className="link" onClick={() => setActiveTab('receives')}>View All</span>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th className="date-col">Date</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receives.length === 0 ? (
              <tr><td colSpan={2} className="empty-state">No entries yet. Add one above.</td></tr>
            ) : (
              [...receives].slice(-5).reverse().map((rec, i) => (
                <tr key={`${rec.id}-${i}`}>
                  <td>{formatDate(rec.date)}</td>
                  <td className="text-right">${formatCurrency(rec.receive)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
