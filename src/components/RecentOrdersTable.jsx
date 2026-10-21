import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import TableSkeletonRows from './TableSkeletonRows';

export default function RecentOrdersTable({
  orders,
  currency,
  onViewAllOrders,
  commissionRate = 25,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(o.customer).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(o.items).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="orders-section-card">
      <div className="orders-header-row">
        <div>
          <h3 className="orders-section-title">Recent Referral Orders</h3>
          <p className="orders-section-subtitle">
            Customer purchases credited to your referral code & link.
          </p>
        </div>

        <div className="orders-header-actions">
          <div className="table-search-input-wrap">
            <Search size={14} className="search-icon" />
            <input 
              type="text"
              placeholder="Search customer or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          {onViewAllOrders && (
            <button 
              className="view-all-orders-btn"
              onClick={onViewAllOrders}
              id="view-all-orders-link"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="clean-orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>ITEMS PURCHASED</th>
              <th>ORDER VALUE</th>
              <th>COMMISSION ({commissionRate}%)</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows columns={7} rows={5} />
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      {searchTerm ? `No referral orders found matching "${searchTerm}".` : "No referral orders recorded yet."}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Share your referral link or coupon code with your audience to start earning {commissionRate}% commission.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const commission = Number(order.commission ?? (order.orderAmount * (commissionRate / 100)));
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
                      {formatCurrency(commission, currency)}
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
  );
}
