import React from 'react';
import { ArrowLeft, Wallet, Building2, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { INITIAL_PAYOUTS } from '../../data/mockData';

export default function PayoutsView({ 
  currency, 
  availableBalance, 
  payouts = INITIAL_PAYOUTS, 
  onRequestPayout, 
  onBackToDashboard,
  minPayout = 500
}) {
  const statusPill = (status) => {
    if (status === 'Completed') {
      return (
        <span className="status-pill status-completed">
          <span className="status-dot green-dot" />
          <span>Paid</span>
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="status-pill status-pending">
          <span className="status-dot slate-dot" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="status-pill status-processing">
        <span className="status-dot amber-dot" />
        <span>Processing</span>
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
          <div className="summary-balance-number tabular-nums">
            {formatCurrency(availableBalance, currency)}
          </div>
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

        {/* Bank & Payment Information Card */}
        <div className="payout-summary-card bank-info-card">
          <div className="summary-card-header">
            <span className="summary-card-label">HOW PAYOUTS WORK</span>
            <Building2 size={18} className="text-gold" />
          </div>

          <div className="bank-details-block">
            <div className="bank-details-row">
              <span className="bank-label">1.</span>
              <strong className="bank-val">Commission is earned when your customer's order is completed.</strong>
            </div>
            <div className="bank-details-row">
              <span className="bank-label">2.</span>
              <strong className="bank-val">Request a payout with your bank account or UPI ID.</strong>
            </div>
            <div className="bank-details-row">
              <span className="bank-label">3.</span>
              <strong className="bank-val">Admin transfers the amount and adds the UTR reference here.</strong>
            </div>
          </div>

          <div className="account-verified-tag">
            <ShieldCheck size={14} className="text-green" />
            <span>Direct Bank & UPI Settlements</span>
          </div>
        </div>
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
              {payouts.length === 0 ? (
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
