import React, { useState } from 'react';
import { ArrowLeft, Search, Download, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function OrdersView({ 
  orders, 
  currency, 
  onBackToDashboard, 
  onExportCSV,
  commissionRate = 25 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.customer).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.items).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="status-pill status-completed">
            <span className="status-dot green-dot" />
            <span>Completed</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="status-pill status-processing">
            <span className="status-dot amber-dot" />
            <span>Processing</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-pill status-pending">
            <span className="status-dot slate-dot" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-pill status-pending">
            <span className="status-dot slate-dot" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="view-page-container animate-fade-in">
      <div className="view-page-header">
        <div>
          <h2 className="view-page-title">Referral Orders & Commission Ledger</h2>
          <p className="view-page-subtitle">
            Every purchase by customers mapped to your referral code. Commission is earned when an order is completed.
          </p>
        </div>

        <div className="header-action-buttons">
          <button className="back-nav-button" onClick={onBackToDashboard}>
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>
          <button className="export-csv-action-btn" onClick={onExportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="orders-section-card">
        {/* Table Filters Toolbar */}
        <div className="table-toolbar-row">
          <div className="table-search-input-wrap">
            <Search size={14} className="search-icon" />
            <input 
              type="text"
              placeholder="Search by customer, order ID, item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          <div className="status-filter-pills">
            {['ALL', 'COMPLETED', 'PROCESSING', 'PENDING', 'CANCELLED'].map((status) => (
              <button
                key={status}
                className={`filter-pill-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive-container">
          <table className="clean-orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>CUSTOMER</th>
                <th>PURCHASED ITEMS</th>
                <th>ORDER TOTAL</th>
                <th>YOUR COMMISSION ({commissionRate}%)</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        {searchTerm ? `No orders found matching "${searchTerm}".` : "No referral orders recorded yet."}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Orders placed by customers using your code will appear here automatically.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const comm = Number(order.commission ?? (order.orderAmount * (commissionRate / 100)));
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id-badge">{order.id}</span>
                      </td>
                      <td>
                        <span className="order-date-text">{order.date}</span>
                      </td>
                      <td>
                        <strong className="order-customer-name">{order.customer}</strong>
                      </td>
                      <td>
                        <span className="order-items-text">{order.items}</span>
                      </td>
                      <td className="tabular-nums font-semibold">
                        {formatCurrency(order.orderAmount, currency)}
                      </td>
                      <td className="tabular-nums font-bold text-gold">
                        {formatCurrency(comm, currency)}
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
