import React from 'react';
import { ArrowLeft, Wallet, Zap } from 'lucide-react';
import BankDetailsCard from '../BankDetailsCard';
import TableSkeletonRows from '../TableSkeletonRows';
import { formatCurrency } from '../../utils/formatters';
import { INITIAL_PAYOUTS } from '../../data/mockData';

export default function PayoutsView({
  currency,
  availableBalance,
  payouts = INITIAL_PAYOUTS,
  onRequestPayout,
  onBackToDashboard,
  minPayout = 1,
  bankDetails = null,
  onSaveBankDetails,
  loading = false
}) {
  const statusPill = (status) => {
    const map = {
      Completed: ['status-completed', 'green-dot', 'Paid'],
      Processing: ['status-processing', 'amber-dot', 'Processing'],
      Requested: ['status-processing', 'amber-dot', 'Requested'],
      Failed: ['status-pending', 'slate-dot', 'Failed'],
      Rejected: ['status-pending', 'slate-dot', 'Rejected']
    };
    const [cls, dot, label] = map[status] || map.Requested;
    return (
      <span className={`status-pill ${cls}`}>
        <span className={`status-dot ${dot}`} />
        <span>{label}</span>
      </span>
    );
  };

  return (
    <div className="view-page-container animate-fade-in">
      <div className="view-page-header">
        <div>
          <h2 className="view-page-title">Payouts & Disbursements</h2>
          <p className="view-page-subtitle">
            Manage your withdrawals, connected bank accounts, and settlement history.
          </p>
        </div>

        <div className="header-action-buttons">
          <button className="back-nav-button" onClick={onBackToDashboard}>
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>
          <button className="primary-action-button" onClick={onRequestPayout}>
            <Zap size={15} />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      <div className="payout-overview-grid">
        {/* Available Balance Card */}
        <div className="payout-summary-card balance-card">
          <div className="summary-card-header">
            <span className="summary-card-label">AVAILABLE FOR WITHDRAWAL</span>
            <Wallet size={18} className="text-gold" />
          </div>
          {loading ? (
            <span className="shimmer-bar shimmer-bar--lg" />
          ) : (
            <div className="summary-balance-number tabular-nums">
              {formatCurrency(availableBalance, currency)}
            </div>
          )}
          <p className="summary-sub-note">
            Minimum withdrawal: {formatCurrency(minPayout, currency)}. Paid by Shivi Manufacturer after approval.
          </p>
          <button 
            className="card-withdraw-btn"
            onClick={onRequestPayout}
          >
            <Zap size={14} />
            <span>Withdraw to Bank Account</span>
          </button>
        </div>

        {/* Payout bank account / UPI */}
        <BankDetailsCard bankDetails={bankDetails} onSave={onSaveBankDetails} />
      </div>

      {/* Payout History Table */}
      <div className="orders-section-card mt-6">
        <div className="orders-header-row">
          <div>
            <h3 className="orders-section-title">Past Payout Disbursements</h3>
            <p className="orders-section-subtitle">
              Record of settled payouts transferred directly to your bank account.
            </p>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="clean-orders-table">
            <thead>
              <tr>
                <th>PAYOUT ID</th>
                <th>DATE</th>
                <th>TRANSFER METHOD</th>
                <th>AMOUNT</th>
                <th>REFERENCE / UTR</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows columns={6} rows={5} />
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        No payout disbursements recorded yet.
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        When you request a payout, withdrawal details and UTR reference will be listed here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="order-id-badge">{p.id}</span>
                    </td>
                    <td>
                      <span className="order-date-text">{p.date}</span>
                    </td>
                    <td>
                      <span className="payout-method-text">{p.method}</span>
                      {p.account_details && (
                        <div className="order-date-text">{p.account_details}</div>
                      )}
                    </td>
                    <td className="tabular-nums font-bold text-gold">
                      {formatCurrency(p.amount, currency)}
                    </td>
                    <td>
                      <span className="utr-ref-chip font-mono">{p.ref}</span>
                    </td>
                    <td>
                      {statusPill(p.status)}
                      {p.note && (
                        <div className="order-date-text" style={{ maxWidth: 220, whiteSpace: 'normal' }}>{p.note}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
