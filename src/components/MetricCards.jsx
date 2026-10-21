import React from 'react';
import { Coins, Wallet, ShoppingBag, Percent, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function MetricCards({
  metrics,
  currency,
  onWithdrawNow,
  commissionRate = 25,
  loading = false
}) {
  return (
    <div className="simple-metric-cards-grid">
      {/* 1. Total Earnings */}
      <div className="simple-metric-card">
        <div className="metric-header-row">
          <span className="metric-tag-label">TOTAL EARNINGS</span>
          <div className="metric-icon-bubble gold-bubble">
            <Coins size={16} />
          </div>
        </div>
        {loading ? (
          <span className="shimmer-bar shimmer-bar--lg" />
        ) : (
          <div className="metric-main-value tabular-nums">
            {formatCurrency(metrics.totalEarnings, currency)}
          </div>
        )}
        <span className="metric-footer-note">Lifetime commission earned</span>
      </div>

      {/* 2. Available for Payout */}
      <div className="simple-metric-card featured-payout-card">
        <div className="metric-header-row">
          <span className="metric-tag-label">AVAILABLE BALANCE</span>
          <div className="metric-icon-bubble green-bubble">
            <Wallet size={16} />
          </div>
        </div>
        <div className="metric-value-action-row">
          {loading ? (
            <span className="shimmer-bar shimmer-bar--lg" />
          ) : (
            <div className="metric-main-value text-gold tabular-nums">
              {formatCurrency(metrics.availablePayout, currency)}
            </div>
          )}
          <button
            className="withdraw-action-pill"
            onClick={onWithdrawNow}
            id="metric-withdraw-cta"
          >
            Withdraw
          </button>
        </div>
        <span className="metric-footer-note">Ready for instant payout to bank</span>
      </div>

      {/* 3. Total Referral Orders */}
      <div className="simple-metric-card">
        <div className="metric-header-row">
          <span className="metric-tag-label">TOTAL ORDERS</span>
          <div className="metric-icon-bubble purple-bubble">
            <ShoppingBag size={16} />
          </div>
        </div>
        {loading ? (
          <span className="shimmer-bar shimmer-bar--lg" />
        ) : (
          <div className="metric-main-value tabular-nums">
            {formatNumber(metrics.totalOrders)}
          </div>
        )}
        <span className="metric-footer-note">Purchases via your code / link</span>
      </div>

      {/* 4. Active Commission Rate */}
      <div className="simple-metric-card">
        <div className="metric-header-row">
          <span className="metric-tag-label">COMMISSION RATE</span>
          <div className="metric-icon-bubble blue-bubble">
            <Percent size={16} />
          </div>
        </div>
        {loading ? (
          <span className="shimmer-bar shimmer-bar--lg" />
        ) : (
          <div className="metric-main-value tabular-nums">
            {commissionRate}%
          </div>
        )}
        <span className="metric-footer-note">Earned on all customer orders</span>
      </div>
    </div>
  );
}
