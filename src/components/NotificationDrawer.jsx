import React from 'react';
import { 
  X, 
  Bell, 
  Coins, 
  Award, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll 
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Bell size={18} className="text-gold" />
            <h3 className="drawer-title">Live Partner Alerts</h3>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Close Alerts"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <CheckCircle2 size={32} className="text-muted mb-2" />
              <p>No new unread alerts.</p>
            </div>
          ) : (
            <div className="notification-cards-list">
              {notifications.map((n) => (
                <div key={n.id} className="notification-card">
                  <div className="notif-header-row">
                    <span className="notif-type-tag">{n.tag}</span>
                    <span className="notif-time-text">{n.time}</span>
                  </div>
                  <h4 className="notif-card-title">{n.title}</h4>
                  <p className="notif-card-desc">{n.desc}</p>
                  {n.amount && (
                    <div className="notif-card-amount text-gold tabular-nums">
                      {n.amount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button 
            className="drawer-clear-btn"
            onClick={onClearAll}
          >
            Mark All as Read
          </button>
        </div>
      </aside>
    </div>
  );
}
