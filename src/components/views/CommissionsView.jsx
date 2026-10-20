import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CommissionsView({ 
  currency, 
  onBackToDashboard, 
  onExportCSV, 
  commissionRate = 25 
}) {
  const transactions = [
    { id: "TX-9021", date: "Oct 11, 2024", user: "Marcus Thorne", type: "Annual Pro Plan", spend: 1240.00, status: "Settled" },
    { id: "TX-9020", date: "Oct 10, 2024", user: "Sophia Lin", type: "Bulk Creator Pack", spend: 980.00, status: "Settled" },
    { id: "TX-9019", date: "Oct 09, 2024", user: "Julian Miller", type: "Monthly Subscription", spend: 760.00, status: "Settled" },
    { id: "TX-9018", date: "Oct 08, 2024", user: "Amara Chen", type: "Studio License", spend: 640.90, status: "Settled" },
    { id: "TX-9017", date: "Oct 07, 2024", user: "Kieran Ross", type: "Pro Render Add-on", spend: 520.00, status: "Settled" },
    { id: "TX-9016", date: "Oct 06, 2024", user: "Chloe Dupont", type: "Annual Starter", spend: 480.00, status: "Settled" },
    { id: "TX-9015", date: "Oct 05, 2024", user: "David Okafor", type: "Monthly Sub", spend: 390.00, status: "Settled" }
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div>
          <h2 className="view-title">Attribution & Commission Ledger</h2>
          <p className="view-subtitle">
            Dynamic revshare calculation currently tracking at <strong className="text-gold">{commissionRate}%</strong>.
          </p>
        </div>
        <div className="flex-gap-2">
          <button className="view-back-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
          <button className="header-secondary-btn" onClick={onExportCSV}>
            <Download size={14} />
            <span>Export Ledger CSV</span>
          </button>
        </div>
      </div>

      <div className="campaigns-table-card">
        <div className="table-scroll-wrapper">
          <table className="mapped-table">
            <thead>
              <tr>
                <th>TRANSACTION ID</th>
                <th>DATE</th>
                <th>MAPPED USER</th>
                <th>PRODUCT TYPE</th>
                <th>USER SPEND</th>
                <th>REVSHARE RATE</th>
                <th>YOUR COMMISSION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const dynamicComm = tx.spend * (commissionRate / 100);
                return (
                  <tr key={tx.id}>
                    <td><span className="user-id-chip">{tx.id}</span></td>
                    <td>{tx.date}</td>
                    <td><strong className="user-name-text">{tx.user}</strong></td>
                    <td>{tx.type}</td>
                    <td className="tabular-nums">{formatCurrency(tx.spend, currency)}</td>
                    <td><span className="table-campaign-chip">{commissionRate}%</span></td>
                    <td className="tabular-nums text-gold font-bold">{formatCurrency(dynamicComm, currency)}</td>
                    <td>
                      <span className="user-status-pill status-active">
                        <span className="live-dot" />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
