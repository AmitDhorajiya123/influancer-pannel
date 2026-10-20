import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link2, 
  ShoppingBag, 
  CreditCard, 
  Users,
  LogOut, 
  Zap
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function Sidebar({ 
  setActiveView, 
  onRequestPayout, 
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  collapsed
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', path: '/influancer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'referrals', path: '/influancer/referrals', label: 'Referral Links', icon: Link2 },
    { id: 'customers', path: '/influancer/customers', label: 'Mapped Customers', icon: Users },
    { id: 'orders', path: '/influancer/orders', label: 'Orders & Commission', icon: ShoppingBag },
    { id: 'payouts', path: '/influancer/payouts', label: 'Payouts', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay-backdrop" 
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        id="portal-sidebar"
        className={`main-sidebar ${collapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <button
            type="button"
            className="sidebar-brand-home"
            onClick={() => navigate('/influancer/dashboard')}
            aria-label="Go to dashboard"
          >
            <span className="sidebar-logo-wrap">
              <img 
                src={logo} 
                alt="" 
                className="sidebar-shivi-logo"
                onError={(e) => {
                  e.target.src = "https://shivimanufacturer.com/storage/images/settings/logo-6abe91be75972.png";
                }}
              />
            </span>
            <span className="sidebar-brand-text">
              <span className="brand-main-title">SM Portal</span>
              <span className="brand-sub-title">SHIVI MANUFACTURER</span>
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-container">
          <ul className="nav-menu-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.id === 'dashboard' && (location.pathname === '/influancer' || location.pathname === '/influancer/' || location.pathname === '/'));
              return (
                <li key={item.id} className="nav-menu-item">
                  <button
                    className={`nav-menu-button ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                    onClick={() => {
                      if (setActiveView) setActiveView(item.id);
                      navigate(item.path);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    id={`sidebar-nav-${item.id}`}
                  >
                    <Icon size={18} className="nav-menu-icon" />
                    <span className="nav-menu-text">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom-actions">
          <button 
            className="sidebar-withdraw-button"
            onClick={onRequestPayout}
            id="sidebar-request-payout"
            title="Request Payout"
          >
            <Zap size={15} />
            <span>Request Payout</span>
          </button>

          <button 
            className="sidebar-logout-button"
            onClick={onLogout}
            id="sidebar-logout"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
