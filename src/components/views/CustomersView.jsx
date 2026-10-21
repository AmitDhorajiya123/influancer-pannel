import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Users, UserCheck, ShoppingBag, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

/**
 * Customers who registered with this influencer's referral code.
 * Data: GET /api/v1/influencer/mapped-users (paginated, filtered server-side)
 */
export default function CustomersView({
  customers = [],
  currency,
  referralCode,
  loading = false,
  onBackToDashboard,
  showToast,
  summary = { total_customers: 0, active_customers: 0, total_spend: 0, total_commission: 0 },
  page = 1,
  perPage = 10,
  total = 0,
  lastPage = 1,
  onPageChange,
  searchTerm = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusChange
}) {
  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (searchInput === searchTerm) return;
    const timer = setTimeout(() => onSearchChange?.(searchInput), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleExport = () => {
    const safe = (v) => String(v ?? '').replace(/"/g, '""');
    const rows = [
      'Customer,Firm,Mobile,Joined,Orders,Spend,Commission,Earned,Status',
      ...customers.map((c) =>
        `"${safe(c.name)}","${safe(c.firm_name)}","${safe(c.mobile)}","${safe(c.mappedDate)}",${c.ordersCount},${c.userSpend},${c.commission},${c.earnedCommission},"${safe(c.status)}"`
      )
    ];
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    link.download = `shivi_mapped_customers_page${page}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Customers CSV exported.', 'success');
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * perPage + 1;
  const rangeEnd = Math.min(page * perPage, total);

  return (
    <div className="view-page-container animate-fade-in">
      <div className="view-page-header">
        <div>
          <h2 className="view-page-title">Mapped Customers</h2>
          <p className="view-page-subtitle">
            Customers who registered with your referral code{referralCode ? <> <strong>{referralCode}</strong></> : null}.
          </p>
        </div>

        <div className="header-action-buttons">
          <button className="back-nav-button" onClick={onBackToDashboard}>
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>
          <button className="export-csv-action-btn" onClick={handleExport} disabled={!customers.length}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="simple-metric-cards-grid">
        <div className="simple-metric-card">
          <div className="metric-header-row">
            <span className="metric-tag-label">MAPPED CUSTOMERS</span>
            <div className="metric-icon-bubble purple-bubble"><Users size={16} /></div>
          </div>
          <div className="metric-main-value tabular-nums">{summary.total_customers}</div>
          <span className="metric-footer-note">Registered with your code</span>
        </div>
        <div className="simple-metric-card">
          <div className="metric-header-row">
            <span className="metric-tag-label">ACTIVE BUYERS</span>
            <div className="metric-icon-bubble green-bubble"><UserCheck size={16} /></div>
          </div>
          <div className="metric-main-value tabular-nums">{summary.active_customers}</div>
          <span className="metric-footer-note">Placed at least one order</span>
        </div>
        <div className="simple-metric-card">
          <div className="metric-header-row">
            <span className="metric-tag-label">TOTAL SPEND</span>
            <div className="metric-icon-bubble blue-bubble"><ShoppingBag size={16} /></div>
          </div>
          <div className="metric-main-value tabular-nums">{formatCurrency(summary.total_spend, currency)}</div>
          <span className="metric-footer-note">Excluding cancelled orders</span>
        </div>
        <div className="simple-metric-card">
          <div className="metric-header-row">
            <span className="metric-tag-label">COMMISSION</span>
            <div className="metric-icon-bubble gold-bubble"><ShoppingBag size={16} /></div>
          </div>
          <div className="metric-main-value text-gold tabular-nums">{formatCurrency(summary.total_commission, currency)}</div>
          <span className="metric-footer-note">Earned + pending</span>
        </div>
      </div>

      <div className="orders-section-card mt-6">
        <div className="table-toolbar-row">
          <div className="table-search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, firm or mobile..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="table-search-input"
            />
          </div>

          <div className="status-filter-pills">
            {['ALL', 'ACTIVE', 'INACTIVE'].map((s) => (
              <button
                key={s}
                className={`filter-pill-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => onStatusChange?.(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="clean-orders-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>MOBILE</th>
                <th>JOINED</th>
                <th>ORDERS</th>
                <th>SPEND</th>
                <th>COMMISSION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading customers...</div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        {searchTerm ? `No customers found matching "${searchTerm}".` : 'No customers mapped yet.'}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Customers appear here when they register in the app with your referral code.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={c.avatar}
                          alt=""
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', background: '#f1f5f9' }}
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                        />
                        <div>
                          <strong className="order-customer-name">{c.name}</strong>
                          {c.firm_name && <div className="order-date-text">{c.firm_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="order-date-text font-mono">{c.mobile}</span></td>
                    <td><span className="order-date-text">{c.mappedDate}</span></td>
                    <td className="tabular-nums">{c.ordersCount}</td>
                    <td className="tabular-nums font-semibold">{formatCurrency(c.userSpend, currency)}</td>
                    <td className="tabular-nums font-bold text-gold">
                      {formatCurrency(c.commission, currency)}
                      {Number(c.earnedCommission) > 0 && Number(c.earnedCommission) < Number(c.commission) && (
                        <div className="order-date-text">{formatCurrency(c.earnedCommission, currency)} earned</div>
                      )}
                    </td>
                    <td>
                      {c.status === 'Active' ? (
                        <span className="status-pill status-completed"><span className="status-dot green-dot" /><span>Active</span></span>
                      ) : (
                        <span className="status-pill status-pending"><span className="status-dot slate-dot" /><span>No orders yet</span></span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="table-pagination-footer">
            <div className="pagination-count-text">
              Showing <strong>{rangeStart}-{rangeEnd}</strong> of <strong>{total}</strong> mapped customers
            </div>
            <div className="pagination-buttons-row">
              <button
                className="pagination-btn"
                disabled={page <= 1 || loading}
                onClick={() => onPageChange?.(page - 1)}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <span className="pagination-count-text">Page {page} of {lastPage}</span>
              <button
                className="pagination-btn"
                disabled={page >= lastPage || loading}
                onClick={() => onPageChange?.(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
