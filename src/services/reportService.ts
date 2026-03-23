import { Expense } from '../types/expense';
import { Receive } from '../types/receive';
import { formatDate } from '../utils/format';

export const downloadReport = (
  expenses: Expense[],
  receives: Receive[],
  totalExpense: number,
  totalReceived: number,
  balance: number,
  showToast: (msg: string, type?: 'success' | 'error') => void
) => {
  if (!(window as any).XLSX) {
    showToast('Excel library is loading. Please try again.', 'error');
    return;
  }
  const XLSX = (window as any).XLSX;
  const wb = XLSX.utils.book_new();

  // Sheet 1: Expenses
  const expHeader = [['N', 'Date', 'Price ($)', 'Delivery ($)', 'Total ($)', 'Description']];
  const expData = expenses.map((e, i) => [i + 1, formatDate(e.date), Number(e.price), Number(e.delivery), Number(e.total), e.description]);
  expData.push([]);
  expData.push(['', '', '', 'TOTAL EXPENSE', Number(totalExpense), '']);
  const wsExpenses = XLSX.utils.aoa_to_sheet([...expHeader, ...expData]);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

  // Sheet 2: Receive Cash
  const recHeader = [['N', 'Date', 'Amount Received ($)']];
  const recData = receives.map((r, i) => [i + 1, formatDate(r.date), Number(r.receive)]);
  recData.push([]);
  recData.push(['', 'TOTAL RECEIVED', Number(totalReceived)]);
  const wsReceives = XLSX.utils.aoa_to_sheet([...recHeader, ...recData]);
  XLSX.utils.book_append_sheet(wb, wsReceives, 'Receive Cash');

  // Sheet 3: Summary
  const summaryData = [
    ['B_NIN Financial Report'],
    ['Date Generated', formatDate(new Date().toISOString().split('T')[0])],
    [],
    ['Total Expense', Number(totalExpense)],
    ['Total Received', Number(totalReceived)],
    ['Balance', Number(balance)]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  const filename = `B_NIN_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};
