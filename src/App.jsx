import React, { useState, useEffect, useCallback } from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  INFLUENCER_PROFILE, 
  INITIAL_METRICS, 
  REFERRAL_ORDERS, 
  INITIAL_PAYOUTS 
} from './data/mockData';
import {
  authStorage,
  logoutInfluencer,
  fetchDashboard,
  fetchOrders,
  fetchPayouts,
  requestPayout
} from './utils/api';

// Core Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import PayoutModal from './components/PayoutModal';

// Dashboard View Components
import ReferralShareCard from './components/ReferralShareCard';
import MetricCards from './components/MetricCards';
import RecentOrdersTable from './components/RecentOrdersTable';

// Sub-view Pages
import ReferralLinksView from './components/views/ReferralLinksView';
import OrdersView from './components/views/OrdersView';
import PayoutsView from './components/views/PayoutsView';

import './App.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = authStorage.getUser();
  const savedToken = authStorage.getToken();

  const [currentUser, setCurrentUser] = useState(savedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(savedUser && savedToken));
  const [currency] = useState('INR');
  const [commissionRate, setCommissionRate] = useState(savedUser?.commission_rate ?? 0);
  const [minPayout, setMinPayout] = useState(500);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return sessionStorage.getItem('shivi_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('shivi_sidebar_collapsed', String(sidebarCollapsed));
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }, [sidebarCollapsed]);

  // Dynamic Live State
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [orders, setOrders] = useState(REFERRAL_ORDERS);
  const [recentOrders, setRecentOrders] = useState(REFERRAL_ORDERS);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);

  // Modal & Toast State
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  // Sync document title
  useEffect(() => {
    document.body.classList.remove('dark-theme');
    if (!isAuthenticated) {
      document.title = 'Shivi Manufacturer | Influencer Login';
    } else {
      const influencerName = currentUser?.name ? ` | ${currentUser.name}` : '';
      document.title = `Shivi Manufacturer | Influencer Portal${influencerName}`;
    }
  }, [isAuthenticated, currentUser]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Session expired / not an influencer -> back to login
  const forceLogout = useCallback((message) => {
    authStorage.clearSession();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setMetrics(INITIAL_METRICS);
    setOrders([]);
    setRecentOrders([]);
    setPayouts([]);
    if (message) showToast(message, 'error');
    navigate('/influancer/login', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Load all live data from the backend
  const loadPortalData = useCallback(async () => {
    const [dash, ord, pay] = await Promise.all([fetchDashboard(), fetchOrders(), fetchPayouts()]);

    const failed = [dash, ord, pay].find(r => r && (r.unauthorized || r.status === false));
    if (failed?.unauthorized) {
      forceLogout(failed.message);
      return;
    }

    if (dash?.status) {
      setMetrics(prev => ({ ...prev, ...dash.metrics }));
      setCommissionRate(dash.metrics?.commissionRate ?? 0);
      setMinPayout(dash.metrics?.minPayout ?? 500);
      setRecentOrders(dash.recent_orders || []);
      if (dash.profile) {
        setCurrentUser(prev => {
          const merged = { ...(prev || {}), ...dash.profile };
          authStorage.saveSession(null, merged);
          return merged;
        });
      }
    }
    if (ord?.status) setOrders(ord.orders || []);
    if (pay?.status) setPayouts(pay.payouts || []);

    if (failed && !failed.unauthorized) {
      showToast(failed.message || 'Unable to load portal data.', 'error');
    }
  }, [forceLogout]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortalData();
    }
  }, [isAuthenticated, loadPortalData]);

  // Handle successful API login -> redirect to /influancer/dashboard
  const handleLogin = (user, token) => {
    authStorage.saveSession(token, user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user?.name || 'Partner'}!`, 'success');
    navigate('/influancer/dashboard', { replace: true });
  };

  // Handle logout -> redirect to /influancer/login
  const handleLogout = async () => {
    await logoutInfluencer();
    setCurrentUser(null);
    setIsAuthenticated(false);
    showToast('You have been signed out.', 'info');
    navigate('/influancer/login', { replace: true });
  };

  // Handle payout submission (real API). Returns the API result to the modal.
  const handlePayoutSubmit = async ({ amount, method, accountDetails }) => {
    const res = await requestPayout(amount, method, accountDetails);
    if (res?.unauthorized) {
      forceLogout(res.message);
      return res;
    }
    if (res?.status) {
      showToast(`Withdrawal of ₹${Number(amount).toLocaleString('en-IN')} requested successfully!`, 'success');
      loadPortalData();
    } else {
      showToast(res?.message || 'Unable to request payout.', 'error');
    }
    return res;
  };

  // CSV Export for Orders Ledger
  const handleExportCSV = () => {
    const csvSafe = (v) => String(v ?? '').replace(/"/g, '""');
    const headers = [`Order ID,Date,Customer,Items,Order Value,Commission Rate,Commission,Status`];
    const rows = orders.map(o => 
      `"${csvSafe(o.id)}","${csvSafe(o.date)}","${csvSafe(o.customer)}","${csvSafe(o.items)}",${o.orderAmount},${o.commissionRate ?? commissionRate}%,${Number(o.commission ?? 0).toFixed(2)},"${csvSafe(o.status)}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shivi_influencer_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Referral orders CSV exported successfully!`, "success");
  };

  // Dashboard View Component
  const DashboardView = (
    <div className="dashboard-main-view animate-fade-in">
      {/* 1. Referral Share Card */}
      <ReferralShareCard 
        showToast={showToast}
        commissionRate={commissionRate}
        currentUser={currentUser}
      />

      {/* 2. Core Metrics (4 Cards) */}
      <MetricCards 
        metrics={metrics}
        currency={currency}
        onWithdrawNow={() => setPayoutModalOpen(true)}
        commissionRate={commissionRate}
      />

      {/* 3. Recent Referral Orders Table */}
      <RecentOrdersTable 
        orders={recentOrders}
        currency={currency}
        onViewAllOrders={() => navigate('/influancer/orders')}
        commissionRate={commissionRate}
      />
    </div>
  );

  return (
    <>
      {/* Global Toast Notification */}
      {toast.visible && (
        <div className={`toast-banner toast-${toast.type} animate-slide-down`}>
          <span>{toast.message}</span>
        </div>
      )}

      <Routes>
        {/* Public Login Route with /influancer prefix */}
        <Route 
          path="/influancer/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/influancer/dashboard" replace />
            ) : (
              <LoginPage 
                onLogin={handleLogin}
                showToast={showToast}
              />
            )
          } 
        />
        <Route path="/influencer/login" element={<Navigate to="/influancer/login" replace />} />
        <Route path="/login" element={<Navigate to="/influancer/login" replace />} />

        {/* Authenticated Portal Layout & Routes with /influancer prefix */}
        <Route 
          path="/influancer/*" 
          element={
            !isAuthenticated ? (
              <Navigate to="/influancer/login" replace />
            ) : (
              <div className={`app-layout-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Sidebar */}
                <Sidebar 
                  onRequestPayout={() => setPayoutModalOpen(true)}
                  onLogout={handleLogout}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  collapsed={sidebarCollapsed}
                />

                {/* Main Content Area */}
                <div className="main-content-wrapper">
                  <Header 
                    onRequestPayout={() => setPayoutModalOpen(true)}
                    onLogout={handleLogout}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    currentUser={currentUser}
                  />

                  <main className="content-container">
                    <Routes>
                      <Route path="dashboard" element={DashboardView} />
                      <Route 
                        path="referrals" 
                        element={
                          <ReferralLinksView 
                            onBackToDashboard={() => navigate('/influancer/dashboard')}
                            showToast={showToast}
                            commissionRate={commissionRate}
                            currentUser={currentUser}
                          />
                        } 
                      />
                      <Route 
                        path="orders" 
                        element={
                          <OrdersView 
                            orders={orders}
                            currency={currency}
                            onBackToDashboard={() => navigate('/influancer/dashboard')}
                            onExportCSV={handleExportCSV}
                            commissionRate={commissionRate}
                          />
                        } 
                      />
                      <Route 
                        path="payouts" 
                        element={
                          <PayoutsView 
                            currency={currency}
                            availableBalance={metrics.availablePayout}
                            minPayout={minPayout}
                            payouts={payouts}
                            onRequestPayout={() => setPayoutModalOpen(true)}
                            onBackToDashboard={() => navigate('/influancer/dashboard')}
                          />
                        } 
                      />
                      <Route path="" element={<Navigate to="/influancer/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/influancer/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>

                {/* Payout Withdrawal Modal */}
                <PayoutModal 
                  isOpen={payoutModalOpen}
                  onClose={() => setPayoutModalOpen(false)}
                  availableBalance={metrics.availablePayout}
                  minPayout={minPayout}
                  currency={currency}
                  onSubmitPayout={handlePayoutSubmit}
                />
              </div>
            )
          } 
        />

        {/* Catch-all & Legacy Route Redirects */}
        <Route path="/influencer/*" element={<Navigate to="/influancer/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/influancer/dashboard" replace />} />
        <Route path="/referrals" element={<Navigate to="/influancer/referrals" replace />} />
        <Route path="/orders" element={<Navigate to="/influancer/orders" replace />} />
        <Route path="/payouts" element={<Navigate to="/influancer/payouts" replace />} />
        <Route path="/settings" element={<Navigate to="/influancer/dashboard" replace />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/influancer/dashboard" : "/influancer/login"} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/influancer/dashboard" : "/influancer/login"} replace />} />
      </Routes>
    </>
  );
}
