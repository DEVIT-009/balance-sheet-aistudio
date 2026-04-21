import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'receives') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button 
        className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} 
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>
      <button 
        className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} 
        onClick={() => setActiveTab('expenses')}
      >
        Expenses
      </button>
      <button 
        className={`tab ${activeTab === 'receives' ? 'active' : ''}`} 
        onClick={() => setActiveTab('receives')}
      >
        Receive Cash
      </button>
    </div>
  );
};
