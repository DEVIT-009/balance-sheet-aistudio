import React, { useState, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useReceives } from './hooks/useReceives';
import { useToast } from './hooks/useToast';
import { downloadReport } from './services/reportService';
import { formatDate } from './utils/format';

import { Tabs } from './components/UI/Tabs';
import { Toast } from './components/UI/Toast';
import { DashboardCards } from './components/Dashboard/DashboardCards';
import { RecentExpenses } from './components/Dashboard/RecentExpenses';
import { RecentReceives } from './components/Dashboard/RecentReceives';
import { ExpenseForm } from './components/Expense/ExpenseForm';
import { ExpenseTable } from './components/Expense/ExpenseTable';
import { ReceiveForm } from './components/Receive/ReceiveForm';
import { ReceiveTable } from './components/Receive/ReceiveTable';

import { Expense } from './types/expense';
import { Receive } from './types/receive';

export default function App() {
  const { expenses, totalExpense, addExpense, updateExpense, deleteExpense, loading: expensesLoading, error: expensesError } = useExpenses();
  const { receives, totalReceived, addReceive, updateReceive, deleteReceive, loading: receivesLoading, error: receivesError } = useReceives();
  const { toast, showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingReceive, setEditingReceive] = useState<Receive | null>(null);

  const balance = totalReceived - totalExpense;
  const todayStr = formatDate(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!document.getElementById('sheetjs-script')) {
      const script = document.createElement('script');
      script.id = 'sheetjs-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      document.body.appendChild(script);
    }
  }, []);

  const handleDownload = () => {
    downloadReport(expenses, receives, totalExpense, totalReceived, balance, showToast);
  };

  const handleExpenseSubmit = async (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData) {
      await updateExpense(expenseData.id, expenseData as Expense);
    } else {
      await addExpense(expenseData);
    }
    setEditingExpense(null);
  };

  const handleReceiveSubmit = async (receiveData: Omit<Receive, 'id'> | Receive) => {
    if ('id' in receiveData) {
      await updateReceive(receiveData.id, receiveData as Receive);
    } else {
      await addReceive(receiveData);
    }
    setEditingReceive(null);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditReceive = (receive: Receive) => {
    setEditingReceive(receive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    if (editingExpense?.id === id) setEditingExpense(null);
  };

  const handleDeleteReceive = async (id: string) => {
    await deleteReceive(id);
    if (editingReceive?.id === id) setEditingReceive(null);
  };

  const isLoading = expensesLoading || receivesLoading;
  const hasError = expensesError || receivesError;

  return (
    <div className="app-container">
      <div className="topbar">
        <h1>B_NIN Tracker</h1>
        <div className="topbar-right">
          <span className="date-display">{todayStr}</span>
          <button className="btn-download" onClick={handleDownload} disabled={isLoading}>⬇ Download Report</button>
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {isLoading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Loading data...
          </div>
        ) : hasError ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '2rem', color: '#b52b2b' }}>
            {expensesError || receivesError}
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                <DashboardCards 
                  totalExpense={totalExpense} 
                  totalReceived={totalReceived} 
                  balance={balance} 
                />
                <div className="panels">
                  <RecentExpenses expenses={expenses} setActiveTab={setActiveTab} />
                  <RecentReceives receives={receives} setActiveTab={setActiveTab} />
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <ExpenseForm 
                  editingExpense={editingExpense} 
                  onSubmit={handleExpenseSubmit} 
                  onCancel={() => setEditingExpense(null)} 
                  showToast={showToast}
                />
                <ExpenseTable 
                  expenses={expenses} 
                  totalExpense={totalExpense} 
                  editingId={editingExpense?.id || null}
                  onEdit={handleEditExpense} 
                  onDelete={handleDeleteExpense} 
                  showToast={showToast}
                />
              </div>
            )}

            {activeTab === 'receives' && (
              <div>
                <ReceiveForm 
                  editingReceive={editingReceive} 
                  onSubmit={handleReceiveSubmit} 
                  onCancel={() => setEditingReceive(null)} 
                  showToast={showToast}
                />
                <ReceiveTable 
                  receives={receives} 
                  totalReceived={totalReceived} 
                  editingId={editingReceive?.id || null}
                  onEdit={handleEditReceive} 
                  onDelete={handleDeleteReceive} 
                  showToast={showToast}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
}
