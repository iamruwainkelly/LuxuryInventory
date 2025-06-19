import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Extend jsPDF interface for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportData {
  title: string;
  data: any[];
  columns: { header: string; dataKey: string }[];
  summary?: { [key: string]: any };
}

export const generatePDFReport = (reportData: ReportData) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text(reportData.title, 20, 30);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
  
  // Create table
  const tableData = reportData.data.map(item => 
    reportData.columns.map(col => item[col.dataKey] || '')
  );
  
  doc.autoTable({
    head: [reportData.columns.map(col => col.header)],
    body: tableData,
    startY: 50,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Add summary if provided
  if (reportData.summary) {
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Summary', 20, finalY);
    
    let yPosition = finalY + 10;
    Object.entries(reportData.summary).forEach(([key, value]) => {
      doc.setFontSize(10);
      doc.text(`${key}: ${value}`, 20, yPosition);
      yPosition += 7;
    });
  }
  
  // Save the PDF
  doc.save(`${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateExcelReport = (reportData: ReportData) => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data for Excel
  const wsData = [
    reportData.columns.map(col => col.header), // Headers
    ...reportData.data.map(item => 
      reportData.columns.map(col => item[col.dataKey] || '')
    )
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  const colWidths = reportData.columns.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;
  
  // Style header row
  const headerRange = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: reportData.columns.length - 1, r: 0 } });
  for (let c = 0; c < reportData.columns.length; c++) {
    const cellAddress = XLSX.utils.encode_cell({ c, r: 0 });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "2980B9" } },
        color: { rgb: "FFFFFF" }
      };
    }
  }
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, reportData.title.substring(0, 31));
  
  // Add summary sheet if provided
  if (reportData.summary) {
    const summaryData = [
      ['Metric', 'Value'],
      ...Object.entries(reportData.summary).map(([key, value]) => [key, value])
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  }
  
  // Generate and save Excel file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};