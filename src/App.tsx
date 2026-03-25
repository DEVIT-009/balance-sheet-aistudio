import React, { useState, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useReceives } from './hooks/useReceives';
import { useToast } from './hooks/useToast';
import { downloadReport, downloadPDFReport } from './services/reportService';
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
import { FileSpreadsheet, FileText, Eye, Settings, Printer, ArrowLeft, X } from 'lucide-react';

import { Expense } from './types/expense';
import { Receive } from './types/receive';

export default function App() {
  const { expenses, totalExpense, addExpense, updateExpense, deleteExpense, loading: expensesLoading, error: expensesError } = useExpenses();
  const { receives, totalReceived, addReceive, updateReceive, deleteReceive, loading: receivesLoading, error: receivesError } = useReceives();
  const { toast, showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingReceive, setEditingReceive] = useState<Receive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [recStartDate, setRecStartDate] = useState('');
  const [recEndDate, setRecEndDate] = useState('');
  const [formError, setFormError] = useState('');
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    expenses: Expense[], 
    receives: Receive[], 
    totalExp: number, 
    totalRec: number, 
    balance: number 
  } | null>(null);

  const balance = totalReceived - totalExpense;
  const todayStr = formatDate(new Date().toISOString().split('T')[0]);

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
      if (!expStartDate || !expEndDate || !recStartDate || !recEndDate) {
        setFormError('Date Required');
        return;
      }
      setFormError('');
      
      filteredExpenses = expenses.filter(e => e.date >= expStartDate && e.date <= expEndDate);
      filteredReceives = receives.filter(r => r.date >= recStartDate && r.date <= recEndDate);
    }

    if (filteredExpenses.length === 0 && filteredReceives.length === 0) {
      showToast('No Data Exist', 'error');
      if (isAdvanced) setIsModalOpen(false);
      return;
    }

    const totalExp = filteredExpenses.reduce((sum, e) => sum + Number(e.total), 0);
    const totalRec = filteredReceives.reduce((sum, r) => sum + Number(r.receive), 0);
    const bal = totalRec - totalExp;

    if (type === 'excel') {
      downloadReport(filteredExpenses, filteredReceives, totalExp, totalRec, bal, showToast);
    } else {
      downloadPDFReport(filteredExpenses, filteredReceives, totalExp, totalRec, bal, showToast);
    }
  };

  const handleViewInvoice = (isAdvanced: boolean = false) => {
    let filteredExpenses = [...expenses];
    let filteredReceives = [...receives];

    if (isAdvanced) {
      if (!expStartDate || !expEndDate || !recStartDate || !recEndDate) {
        setFormError('Date Required');
        return;
      }
      setFormError('');
      filteredExpenses = expenses.filter(e => e.date >= expStartDate && e.date <= expEndDate);
      filteredReceives = receives.filter(r => r.date >= recStartDate && r.date <= recEndDate);
    }

    if (filteredExpenses.length === 0 && filteredReceives.length === 0) {
      showToast('No Data Exist', 'error');
      if (isAdvanced) setIsModalOpen(false);
      return;
    }

    const totalExp = filteredExpenses.reduce((sum, e) => sum + Number(e.total), 0);
    const totalRec = filteredReceives.reduce((sum, r) => sum + Number(r.receive), 0);
    
    setInvoiceData({
      expenses: filteredExpenses,
      receives: filteredReceives,
      totalExp,
      totalRec,
      balance: totalRec - totalExp
    });
    setIsViewingInvoice(true);
    setIsModalOpen(false);
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

  if (isViewingInvoice && invoiceData) {
    return (
      <div className="invoice-view">
        <div className="invoice-actions no-print">
          <button className="btn-cancel" onClick={() => setIsViewingInvoice(false)}>
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </button>
          <button className="btn-submit" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
        
        <div className="invoice-paper">
          <div className="invoice-header">
            <div>
              <h1>B_NIN Tracker Report</h1>
              <p>Financial Summary Statement</p>
            </div>
            <div className="invoice-meta">
              <p><strong>Generated on</strong></p>
              <p>{formatDate(new Date().toISOString().split('T')[0])}</p>
            </div>
          </div>

          <div className="invoice-summary-grid">
            <div className="summary-box">
              <label>Total Received</label>
              <div className="amt text-teal">${invoiceData.totalRec.toFixed(2)}</div>
            </div>
            <div className="summary-box">
              <label>Total Expense</label>
              <div className="amt text-orange">${invoiceData.totalExp.toFixed(2)}</div>
            </div>
            <div className="summary-box" style={{ borderLeft: '4px solid ' + (invoiceData.balance >= 0 ? 'var(--bal-pos)' : 'var(--bal-neg)') }}>
              <label>Current Balance</label>
              <div className={`amt ${invoiceData.balance >= 0 ? 'text-green' : 'text-red'}`}>
                ${invoiceData.balance.toFixed(2)}
              </div>
            </div>
          </div>

          <h2 className="invoice-section-title">Expenses Details</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>N</th>
                <th>Date</th>
                <th>Price</th>
                <th>Delivery</th>
                <th>Total</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.expenses.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(e.date)}</td>
                  <td>${Number(e.price).toFixed(2)}</td>
                  <td>${Number(e.delivery).toFixed(2)}</td>
                  <td>${Number(e.total).toFixed(2)}</td>
                  <td>{e.description}</td>
                </tr>
              ))}
              <tr className="invoice-total-row">
                <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL EXPENSE</td>
                <td>${invoiceData.totalExp.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <h2 className="invoice-section-title">Receive Cash Details</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>N</th>
                <th>Date</th>
                <th>Amount Received</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.receives.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(r.date)}</td>
                  <td>${Number(r.receive).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="invoice-total-row">
                <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL RECEIVED</td>
                <td>${invoiceData.totalRec.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="topbar">
        <h1>B_NIN Tracker</h1>
        <div className="topbar-right">
          <div className="download-group">
            <button className="btn-download excel" onClick={() => handleDownload('excel')} disabled={isLoading}>
              <FileSpreadsheet className="w-4 h-4" /> Download Excel
            </button>
            <button className="btn-download pdf" onClick={() => handleDownload('pdf')} disabled={isLoading}>
              <FileText className="w-4 h-4" /> Download PDF
            </button>
            <button className="btn-download view" onClick={() => handleViewInvoice()} disabled={isLoading}>
              <Eye className="w-4 h-4" /> View Invoice
            </button>
            <button className="btn-download advance" onClick={() => { setFormError(''); setIsModalOpen(true); }} disabled={isLoading}>
              <Settings className="w-4 h-4" /> Advance
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Advanced Report</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="advanced-form">
              <div className="filter-section">
                <h3>Expenses Period</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>From:</label>
                    <input type="date" value={expStartDate} onChange={e => setExpStartDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>To:</label>
                    <input type="date" value={expEndDate} onChange={e => setExpEndDate(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h3>Receives Period</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>From:</label>
                    <input type="date" value={recStartDate} onChange={e => setRecStartDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>To:</label>
                    <input type="date" value={recEndDate} onChange={e => setRecEndDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {formError && <div className="validation-alert">{formError}</div>}

              <div className="download-group" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                <button className="btn-submit flex items-center gap-2" onClick={() => handleDownload('excel', true)}>
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button className="btn-submit flex items-center gap-2" style={{ backgroundColor: '#d32f2f' }} onClick={() => handleDownload('pdf', true)}>
                  <FileText className="w-4 h-4" /> PDF
                </button>
                <button className="btn-submit flex items-center gap-2" style={{ backgroundColor: '#0f172a' }} onClick={() => handleViewInvoice(true)}>
                  <Eye className="w-4 h-4" /> View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
