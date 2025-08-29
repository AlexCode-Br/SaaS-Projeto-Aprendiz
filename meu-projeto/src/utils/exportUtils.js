import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { unparse } from 'papaparse';

/**
 * Exporta dados para um arquivo CSV.
 * @param {Array<Object>} data - Os dados a serem exportados.
 * @param {Array<{label: string, key: string}>} headers - Os cabeçalhos das colunas.
 * @param {string} filename - O nome do arquivo (sem extensão).
 */
export const exportToCSV = (data, headers, filename) => {
    const csvData = data.map(row => {
        let newRow = {};
        headers.forEach(header => {
            newRow[header.label] = row[header.key];
        });
        return newRow;
    });

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exporta dados para um arquivo PDF.
 * @param {Array<Object>} data - Os dados a serem exportados.
 * @param {Array<{label: string, key: string}>} headers - Os cabeçalhos das colunas.
 * @param {string} title - O título do documento PDF.
 */
export const exportToPDF = (data, headers, title) => {
    const doc = new jsPDF();
    
    doc.text(title, 14, 16);
    
    const tableColumn = headers.map(h => h.label);
    const tableRows = data.map(row => headers.map(h => row[h.key]));

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });
    
    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};