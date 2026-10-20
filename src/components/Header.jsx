import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Zap, 
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Header({
  onRequestPayout,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser
}) {
  const location = useLocation();

  const getViewTitle = () => {
    if (location.pathname.includes('/referrals')) return 'Referral Links & Codes';
    if (location.pathname.includes('/orders')) return 'Orders & Commission Ledger';
    if (location.pathname.includes('/payouts')) return 'Payouts & Bank Accounts';
    return 'Influencer Dashboard';
  };

  return (
    <header className="main-header-bar">
      <div className="header-left-section">
        <button
          type="button"
          className="desktop-sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-controls="portal-sidebar"
          aria-expanded={!sidebarCollapsed}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          id="desktop-sidebar-toggle"
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Menu"
          aria-controls="portal-sidebar"
          aria-expanded={sidebarOpen}
          id="mobile-menu-toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="header-breadcrumbs">
          <h1 className="header-current-view-title">{getViewTitle()}</h1>
        </div>
      </div>

      <div className="header-right-actions">
        {/* Influencer Profile / Logout */}
        <div className="header-profile-wrap">
          <div 
            className="header-user-avatar-circle" 
            title={currentUser?.name || "Influencer Profile"}
          >
            <User size={16} className="text-gold" />
          </div>
          {currentUser?.name && (
            <span 
              className="header-user-name" 
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'inherit' }}
            >
              {currentUser.name}
            </span>
          )}
          <button 
            className="header-logout-btn"
            onClick={onLogout}
            title="Sign Out"
            id="header-logout"
          >
            <LogOut size={15} />
            <span className="logout-btn-text">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
