import { Transaction, BudgetConfig } from '../types';

export function exportTransactionsToCSV(transactions: Transaction[], month = 'May 2025') {
  const headers = ['Transaction ID', 'Date', 'Time', 'Description', 'Category', 'Amount (INR)', 'Payment Method', 'Notes', 'Merchant'];
  
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.time}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.amount.toFixed(2),
    `"${t.paymentMethod}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    `"${(t.merchant || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SpendWise_${month.replace(/\s+/g, '_')}_Statement.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printFinancialReport(transactions: Transaction[], budget: BudgetConfig) {
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remaining = budget.targetBudget - totalSpent;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return;
  }

  const rowsHtml = transactions
    .slice(0, 50)
    .map(
      (t) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${t.date} ${t.time}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${t.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><span style="background: #e2e8f0; padding: 2px 8px; border-radius: 9999px; font-size: 12px;">${t.category}</span></td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${t.paymentMethod}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">₹${t.amount.toLocaleString('en-IN')}.00</td>
    </tr>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SpendWise - ${budget.month} Statement</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0b1c30; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #004ac6; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #004ac6; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; background: #eff4ff; padding: 20px; border-radius: 12px; }
          .card h4 { margin: 0 0 5px; font-size: 12px; color: #434655; text-transform: uppercase; }
          .card p { margin: 0; font-size: 20px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
          th { text-align: left; background: #f8f9ff; padding: 10px 8px; border-bottom: 2px solid #cbd5e1; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SpendWise Financial Statement</div>
            <div>User: Rahul Sharma (Verified Account)</div>
            <div>Period: ${budget.month}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #737686;">Generated on: ${new Date().toLocaleDateString()}</div>
            <button class="no-print" style="margin-top: 10px; padding: 8px 16px; background: #004ac6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="window.print()">Print or Save as PDF</button>
          </div>
        </div>

        <div class="summary">
          <div class="card">
            <h4>Total Target Budget</h4>
            <p>₹${budget.targetBudget.toLocaleString('en-IN')}</p>
          </div>
          <div class="card">
            <h4>Total Spent</h4>
            <p style="color: #ba1a1a;">₹${totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div class="card">
            <h4>Remaining Balance</h4>
            <p style="color: #004ac6;">₹${remaining.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <h3>Transaction Audit Ledger (${transactions.length} items)</h3>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Description</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
}
