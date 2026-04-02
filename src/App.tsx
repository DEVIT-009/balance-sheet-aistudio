import React, { useState, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useReceives } from './hooks/useReceives';
import { useToast } from './hooks/useToast';
import { downloadReport, downloadPDFReport } from './services/reportService';

import { Tabs } from './components/UI/Tabs';
import { Toast } from './components/UI/Toast';
import { Header } from './components/Layout/Header';
import { AdvancedReportModal } from './components/Reports/AdvancedReportModal';
import { InvoiceView } from './components/Reports/InvoiceView';
import { DashboardCards } from './components/Dashboard/DashboardCards';
import { RecentExpenses } from './components/Dashboard/RecentExpenses';
import { RecentReceives } from './components/Dashboard/RecentReceives';
import { ExpenseForm } from './components/Expense/ExpenseForm';
import { ExpenseTable } from './components/Expense/ExpenseTable';
import { ExpenseDetail } from './components/Expense/ExpenseDetail';
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
  const [viewingExpenseDetail, setViewingExpenseDetail] = useState<Expense | null>(null);
  const [editingReceive, setEditingReceive] = useState<Receive | null>(null);
  
  // Advanced Report States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expDates, setExpDates] = useState({ start: '', end: '' });
  const [recDates, setRecDates] = useState({ start: '', end: '' });
  const [formError, setFormError] = useState('');
  
  // Invoice View States
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    expenses: Expense[], 
    receives: Receive[], 
    totalExp: number, 
    totalRec: number, 
    balance: number 
  } | null>(null);

  const balance = totalReceived - totalExpense;

  useEffect(() => {
    const loadScript = (id: string, src: string) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        document.body.appendChild(script);
      }
    };
    loadScript('sheetjs-script', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    loadScript('jspdf-script', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    loadScript('jspdf-autotable-script', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js');
  }, []);

  const handleDownload = (type: 'excel' | 'pdf', isAdvanced: boolean = false) => {
    let filteredExpenses = [...expenses];
    let filteredReceives = [...receives];

    if (isAdvanced) {
      if (!expDates.start || !expDates.end || !recDates.start || !recDates.end) {
        setFormError('Date Required');
        return;
      }
      setFormError('');
      filteredExpenses = expenses.filter(e => e.date >= expDates.start && e.date <= expDates.end);
      filteredReceives = receives.filter(r => r.date >= recDates.start && r.date <= recDates.end);
    }

    if (filteredExpenses.length === 0 && filteredReceives.length === 0) {
      showToast('No Data Exist', 'error');
      if (isAdvanced) setIsModalOpen(false);
      return;
    }

    const tExp = filteredExpenses.reduce((sum, e) => sum + Number(e.total), 0);
    const tRec = filteredReceives.reduce((sum, r) => sum + Number(r.receive), 0);

    if (type === 'excel') {
      downloadReport(filteredExpenses, filteredReceives, tExp, tRec, tRec - tExp, showToast);
    } else {
      downloadPDFReport(filteredExpenses, filteredReceives, tExp, tRec, tRec - tExp, showToast);
    }
  };

  const handleViewInvoice = (isAdvanced: boolean = false) => {
    let filteredExpenses = [...expenses];
    let filteredReceives = [...receives];

    if (isAdvanced) {
      if (!expDates.start || !expDates.end || !recDates.start || !recDates.end) {
        setFormError('Date Required');
        return;
      }
      setFormError('');
      filteredExpenses = expenses.filter(e => e.date >= expDates.start && e.date <= expDates.end);
      filteredReceives = receives.filter(r => r.date >= recDates.start && r.date <= recDates.end);
    }

    if (filteredExpenses.length === 0 && filteredReceives.length === 0) {
      showToast('No Data Exist', 'error');
      if (isAdvanced) setIsModalOpen(false);
      return;
    }

    const tExp = filteredExpenses.reduce((sum, e) => sum + Number(e.total), 0);
    const tRec = filteredReceives.reduce((sum, r) => sum + Number(r.receive), 0);
    
    setInvoiceData({ expenses: filteredExpenses, receives: filteredReceives, totalExp: tExp, totalRec: tRec, balance: tRec - tExp });
    setIsViewingInvoice(true);
    setIsModalOpen(false);
  };

  const handleExpenseSubmit = async (data: Omit<Expense, 'id'> | Expense) => {
    'id' in data ? await updateExpense(data.id, data as Expense) : await addExpense(data);
    setEditingExpense(null);
  };

  const handleReceiveSubmit = async (data: Omit<Receive, 'id'> | Receive) => {
    'id' in data ? await updateReceive(data.id, data as Receive) : await addReceive(data);
    setEditingReceive(null);
  };

  const isLoading = expensesLoading || receivesLoading;
  const hasError = expensesError || receivesError;

  if (isViewingInvoice && invoiceData) {
    return <InvoiceView data={invoiceData} onClose={() => setIsViewingInvoice(false)} />;
  }

  return (
    <div className="app-container">
      <Header 
        onDownload={handleDownload} 
        onViewInvoice={() => handleViewInvoice(false)} 
        onOpenAdvance={() => { setFormError(''); setIsModalOpen(true); }}
        isLoading={isLoading} 
      />

      {isModalOpen && (
        <AdvancedReportModal 
          onClose={() => setIsModalOpen(false)}
          onDownload={handleDownload}
          onView={handleViewInvoice}
          expDates={expDates}
          setExpDates={setExpDates}
          recDates={recDates}
          setRecDates={setRecDates}
          error={formError}
        />
      )}

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {isLoading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>
        ) : hasError ? (
          <div className="error-state" style={{ textAlign: 'center', padding: '2rem' }}>{expensesError || receivesError}</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                <DashboardCards totalExpense={totalExpense} totalReceived={totalReceived} balance={balance} />
                <div className="panels">
                  <RecentExpenses expenses={expenses} setActiveTab={setActiveTab} />
                  <RecentReceives receives={receives} setActiveTab={setActiveTab} />
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                {viewingExpenseDetail ? (
                  <ExpenseDetail 
                    expense={viewingExpenseDetail} 
                    onBack={() => setViewingExpenseDetail(null)} 
                  />
                ) : (
                  <>
                    <ExpenseForm editingExpense={editingExpense} onSubmit={handleExpenseSubmit} onCancel={() => setEditingExpense(null)} showToast={showToast} />
                    <ExpenseTable 
                      expenses={expenses} 
                      totalExpense={totalExpense} 
                      editingId={editingExpense?.id || null} 
                      onEdit={(e) => { setEditingExpense(e); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      onDelete={deleteExpense} 
                      onViewDetail={(e) => setViewingExpenseDetail(e)}
                      showToast={showToast} 
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === 'receives' && (
              <div>
                <ReceiveForm editingReceive={editingReceive} onSubmit={handleReceiveSubmit} onCancel={() => setEditingReceive(null)} showToast={showToast} />
                <ReceiveTable receives={receives} totalReceived={totalReceived} editingId={editingReceive?.id || null} onEdit={(r) => { setEditingReceive(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={deleteReceive} showToast={showToast} />
              </div>
            )}
          </>
        )}
      </div>
      <Toast toast={toast} />
    </div>
  );
}

