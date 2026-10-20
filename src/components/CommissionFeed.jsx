import React from 'react';
import { 
  ShoppingCart, 
  RotateCw, 
  Award, 
  RefreshCcw, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CommissionFeed({ 
  feedItems, 
  onSimulateSale, 
  currency 
}) {
  const getFeedIcon = (type) => {
    if (type === 'sale') {
      return (
        <div className="feed-icon-wrap icon-cart">
          <ShoppingCart size={15} />
        </div>
      );
    }
    if (type === 'recurring') {
      return (
        <div className="feed-icon-wrap icon-refresh">
          <RotateCw size={15} />
        </div>
      );
    }
    return (
      <div className="feed-icon-wrap icon-award">
        <Award size={15} />
      </div>
    );
  };

  return (
    <div className="bottom-card feed-card">
      <div className="bottom-card-header">
        <div className="bottom-card-title-wrap">
          <h3 className="bottom-card-title">Real-Time Commission Feed</h3>
          <p className="bottom-card-subtitle">
            Direct attribution events from tracked referrals.
          </p>
        </div>

        <div className="feed-header-actions">
          <button 
            className="feed-simulate-btn"
            onClick={onSimulateSale}
            title="Simulate incoming referral commission"
            id="feed-simulate-btn"
          >
            <Zap size={13} />
            <span>Simulate Sale</span>
          </button>
          
          <button 
            className="feed-refresh-btn"
            onClick={() => onSimulateSale()}
            aria-label="Refresh Commission Feed"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      <div className="feed-items-list">
        {feedItems.map((item) => (
          <div key={item.id} className="feed-item-row animate-fade-in">
            <div className="feed-item-left">
              {getFeedIcon(item.type)}
              <div className="feed-item-info">
                <span className="feed-item-title">{item.title}</span>
                <span className="feed-item-desc">{item.desc}</span>
              </div>
            </div>

            <div className="feed-item-right">
              <span className="feed-item-amount tabular-nums">
                {item.amount}
              </span>
              <span className="feed-item-share">{item.share}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
