import React from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Tag, 
  DollarSign, 
  Coins, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function UserDetailModal({ 
  user, 
  onClose, 
  currency, 
  showToast 
}) {
  if (!user) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window user-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <UserCheck size={18} className="text-gold" />
            <h3 className="modal-title">Mapped Partner Attribution</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-pad">
          {/* User profile row */}
          <div className="user-detail-profile-card">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="user-detail-avatar" 
            />
            <div className="user-detail-info">
              <h4 className="user-detail-name">{user.name}</h4>
              <span className="user-detail-handle">{user.handle} • {user.email}</span>
              <div className="user-detail-tag-row">
                <span className="user-status-pill status-active">
                  <span className="live-dot" />
                  <span>{user.status}</span>
                </span>
                <span className="user-id-chip">ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Attribution summary metrics */}
          <div className="user-metrics-grid">
            <div className="user-metric-box">
              <span className="box-label">Total Spend</span>
              <span className="box-val tabular-nums">
                {formatCurrency(user.userSpend, currency)}
              </span>
            </div>
            <div className="user-metric-box">
              <span className="box-label">Your Share (25%)</span>
              <span className="box-val text-gold tabular-nums">
                {formatCurrency(user.commission, currency)}
              </span>
            </div>
            <div className="user-metric-box">
              <span className="box-label">Orders Placed</span>
              <span className="box-val">{user.ordersCount || 4} orders</span>
            </div>
          </div>

          {/* Attribution Metadata */}
          <div className="attribution-meta-card">
            <div className="meta-row">
              <span className="meta-label">
                <Calendar size={14} /> Mapped On:
              </span>
              <span className="meta-value">{user.mappedDate}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">
                <Tag size={14} /> Attributed Campaign:
              </span>
              <span className="meta-value text-gold">{user.campaign}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">
                <ShieldCheck size={14} /> Partner Lock:
              </span>
              <span className="meta-value text-green">Permanent Attribution Active</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions-row mt-4">
            <button 
              className="modal-secondary-btn"
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                showToast(`Referral token copied!`, "success");
              }}
            >
              <span>Copy Referral Token</span>
            </button>
            <a 
              href={`mailto:${user.email}`} 
              className="modal-primary-btn"
            >
              <Mail size={14} />
              <span>Contact Referrer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
