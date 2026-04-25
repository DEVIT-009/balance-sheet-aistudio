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

  // Create a combined data array for a single sheet report
  const reportData: any[][] = [];

  // Title and Date
  reportData.push(['B_NIN TRACKER - FINANCIAL REPORT']);
  reportData.push(['Generated on:', formatDate(new Date().toISOString().split('T')[0])]);
  reportData.push([]);

  // 1. EXPENSES SECTION
  reportData.push(['EXPENSES DETAILS']);
  reportData.push(['N', 'Date', 'Price ($)', 'Delivery ($)', 'Total ($)', 'Description']);
  expenses.forEach((e, i) => {
    reportData.push([
      i + 1,
      formatDate(e.date),
      Number(e.price),
      Number(e.delivery),
      Number(e.total),
      e.description
    ]);
  });
  reportData.push(['', '', '', 'TOTAL EXPENSE', Number(totalExpense), '']);
  reportData.push([]);
  reportData.push([]);

  // 2. RECEIVES SECTION
  reportData.push(['RECEIVE CASH DETAILS']);
  reportData.push(['N', 'Date', 'Amount Received ($)']);
  receives.forEach((r, i) => {
    reportData.push([
      i + 1,
      formatDate(r.date),
      Number(r.receive)
    ]);
  });
  reportData.push(['', 'TOTAL RECEIVED', Number(totalReceived)]);
  reportData.push([]);
  reportData.push([]);

  // 3. FINAL SUMMARY
  reportData.push(['OVERALL SUMMARY']);
  reportData.push(['Category', 'Total Amount ($)']);
  reportData.push(['Total Received', Number(totalReceived)]);
  reportData.push(['Total Expense', Number(totalExpense)]);
  reportData.push(['BALANCE', Number(balance)]);

  const ws = XLSX.utils.aoa_to_sheet(reportData);

  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 6 },   // N
    { wch: 15 },  // Date
    { wch: 20 },  // Price / Amount Received
    { wch: 15 },  // Delivery
    { wch: 15 },  // Total
    { wch: 35 }   // Description
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Financial Report');

  const filename = `B_NIN_Tracker_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const downloadPDFReport = (
  expenses: Expense[],
  receives: Receive[],
  totalExpense: number,
  totalReceived: number,
  balance: number,
  showToast: (msg: string, type?: 'success' | 'error') => void
) => {
  if (!(window as any).jspdf) {
    showToast('PDF library is loading. Please try again.', 'error');
    return;
  }
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(12, 61, 110);
  doc.text('B_NIN TRACKER - FINANCIAL REPORT', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 28);
  doc.text('------------------------------------------------------------------------------------------------------------------------', 14, 32);

  // Summary
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('OVERALL SUMMARY', 14, 42);
  
  const summaryData = [
    ['Description', 'Value ($)'],
    ['Total Received', `$${totalReceived.toFixed(2)}`],
    ['Total Expense', `$${totalExpense.toFixed(2)}`],
    ['BALANCE', `$${balance.toFixed(2)}`]
  ];

  (doc as any).autoTable({
    startY: 45,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'plain',
    headStyles: { fontStyle: 'bold' },
    styles: { fontSize: 11 },
    margin: { left: 14 }
  });

  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

  // Expenses Table
  let expStartY = (doc as any).lastAutoTable.finalY + 15;
  if (expStartY > pageHeight - 20) {
    doc.addPage();
    expStartY = 20;
  }
  
  doc.setTextColor(12, 61, 110);
  doc.text('EXPENSES DETAILS', 14, expStartY);
  
  const expRows = expenses.map((e, i) => [
    i + 1,
    formatDate(e.date),
    `$${Number(e.price).toFixed(2)}`,
    `$${Number(e.delivery).toFixed(2)}`,
    `$${Number(e.total).toFixed(2)}`,
    e.description
  ]);
  expRows.push(['', '', '', 'TOTAL', `$${totalExpense.toFixed(2)}`, '']);

  (doc as any).autoTable({
    startY: expStartY + 5,
    head: [['N', 'Date', 'Price', 'Delivery', 'Total', 'Description']],
    body: expRows,
    theme: 'striped',
    headStyles: { fillColor: [12, 61, 110], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20, fontStyle: 'bold' },
      5: { cellWidth: 'auto' }
    }
  });

  // Receives Table
  let recStartY = (doc as any).lastAutoTable.finalY + 15;
  if (recStartY > pageHeight - 20) {
    doc.addPage();
    recStartY = 20;
  }

  doc.setTextColor(15, 122, 90);
  doc.text('RECEIVE CASH DETAILS', 14, recStartY);

  const recRows = receives.map((r, i) => [
    i + 1,
    formatDate(r.date),
    `$${Number(r.receive).toFixed(2)}`
  ]);
  recRows.push(['', 'TOTAL', `$${totalReceived.toFixed(2)}`]);

  (doc as any).autoTable({
    startY: recStartY + 5,
    head: [['N', 'Date', 'Amount Received']],
    body: recRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 122, 90], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { cellWidth: 'auto', fontStyle: 'bold' }
    }
  });

  const filename = `B_NIN_Tracker_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};


