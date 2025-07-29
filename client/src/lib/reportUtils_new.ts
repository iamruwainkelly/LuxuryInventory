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
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(reportData.title, 20, 30);
    
    // Add generation date and time
    doc.setFontSize(10);
    doc.setTextColor(100);
    const generatedAt = new Date().toLocaleString();
    doc.text(`Generated on: ${generatedAt}`, 20, 40);
    
    // Add luxury branding
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text('LuxuryInventory Management System', 20, 50);
    
    // Reset color for table
    doc.setTextColor(40);
    
    // Create table data
    const tableData = reportData.data.map(item => 
      reportData.columns.map(col => {
        const value = item[col.dataKey];
        return value !== null && value !== undefined ? String(value) : '';
      })
    );
    
    doc.autoTable({
      head: [reportData.columns.map(col => col.header)],
      body: tableData,
      startY: 60,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        halign: 'left',
      },
      headStyles: {
        fillColor: [128, 0, 128], // Purple header
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [248, 248, 255], // Light purple
      },
      columnStyles: {
        // Right-align numeric columns
        3: { halign: 'right' }, // Usually quantity or amount columns
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
    });

    // Add summary if provided
    if (reportData.summary && Object.keys(reportData.summary).length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      
      // Summary section header
      doc.setFontSize(14);
      doc.setTextColor(128, 0, 128);
      doc.text('Summary', 20, finalY);
      
      // Summary box background
      doc.setFillColor(248, 248, 255);
      doc.rect(20, finalY + 5, 170, Object.keys(reportData.summary).length * 7 + 10, 'F');
      
      let yPosition = finalY + 15;
      Object.entries(reportData.summary).forEach(([key, value]) => {
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text(`${key}:`, 25, yPosition);
        doc.setTextColor(0);
        doc.text(String(value), 100, yPosition);
        yPosition += 7;
      });
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
      doc.text('LuxuryInventory © 2025', 170, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    const filename = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    console.log(`PDF report generated: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    alert('Error generating PDF report. Please try again.');
    return false;
  }
};

export const generateExcelReport = (reportData: ReportData) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare main data for Excel
    const wsData = [
      // Title row
      [reportData.title],
      [`Generated on: ${new Date().toLocaleString()}`],
      ['LuxuryInventory Management System'],
      [], // Empty row
      // Headers
      reportData.columns.map(col => col.header),
      // Data rows
      ...reportData.data.map(item => 
        reportData.columns.map(col => {
          const value = item[col.dataKey];
          return value !== null && value !== undefined ? value : '';
        })
      )
    ];
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const colWidths = reportData.columns.map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;
    
    // Style title row
    const titleCell = 'A1';
    if (ws[titleCell]) {
      ws[titleCell].s = {
        font: { bold: true, sz: 16, color: { rgb: "800080" } },
        alignment: { horizontal: 'center' }
      };
    }
    
    // Merge title cells
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: reportData.columns.length - 1 } }
    ];
    
    // Style header row (row 5, 0-indexed as row 4)
    const headerRowIndex = 4;
    for (let c = 0; c < reportData.columns.length; c++) {
      const cellAddress = XLSX.utils.encode_cell({ c, r: headerRowIndex });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "800080" } },
          alignment: { horizontal: 'center' }
        };
      }
    }
    
    // Add worksheet to workbook
    const sheetName = reportData.title.substring(0, 31).replace(/[\/\\\?\*\[\]]/g, '_');
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Add summary sheet if provided
    if (reportData.summary && Object.keys(reportData.summary).length > 0) {
      const summaryData = [
        ['Summary Report'],
        [`Generated on: ${new Date().toLocaleString()}`],
        [], // Empty row
        ['Metric', 'Value'],
        ...Object.entries(reportData.summary).map(([key, value]) => [key, String(value)])
      ];
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Style summary sheet
      summaryWs['!cols'] = [{ wch: 30 }, { wch: 20 }];
      if (summaryWs['A1']) {
        summaryWs['A1'].s = {
          font: { bold: true, sz: 14, color: { rgb: "800080" } }
        };
      }
      
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    }
    
    // Generate and save Excel file
    const filename = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    console.log(`Excel report generated: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error generating Excel report:', error);
    alert('Error generating Excel report. Please try again.');
    return false;
  }
};

export const generateCSVReport = (reportData: ReportData) => {
  try {
    // Create CSV content
    let csvContent = '';
    
    // Add title and metadata
    csvContent += `"${reportData.title}"\n`;
    csvContent += `"Generated on: ${new Date().toLocaleString()}"\n`;
    csvContent += `"LuxuryInventory Management System"\n`;
    csvContent += '\n'; // Empty line
    
    // Add headers
    csvContent += reportData.columns.map(col => `"${col.header}"`).join(',') + '\n';
    
    // Add data rows
    reportData.data.forEach(item => {
      const row = reportData.columns.map(col => {
        const value = item[col.dataKey];
        const stringValue = value !== null && value !== undefined ? String(value) : '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Add summary if provided
    if (reportData.summary && Object.keys(reportData.summary).length > 0) {
      csvContent += '\n'; // Empty line
      csvContent += '"Summary"\n';
      Object.entries(reportData.summary).forEach(([key, value]) => {
        csvContent += `"${key}","${value}"\n`;
      });
    }
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, filename);
    
    console.log(`CSV report generated: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error generating CSV report. Please try again.');
    return false;
  }
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
