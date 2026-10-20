import React from 'react';
import { TIERS_LADDER } from '../../data/mockData';
import { Sparkles, Check, Zap, ArrowLeft } from 'lucide-react';

export default function TiersView({ 
  onBackToDashboard, 
  commissionRate = 25, 
  onSetCommissionRate, 
  showToast 
}) {
  const handleSelectTier = (item) => {
    const rateNum = parseInt(item.revShare, 10);
    if (onSetCommissionRate) {
      onSetCommissionRate(rateNum);
    }
    if (showToast) {
      showToast(`Dynamic commission updated to ${rateNum}% (${item.name})!`, "success");
    }
  };

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div>
          <h2 className="view-title">Partner Tier Ladder & Dynamic Commission</h2>
          <p className="view-subtitle">
            Scale your community volume or test dynamic commission rates (from 15% to 35%).
          </p>
        </div>
        <button className="view-back-btn" onClick={onBackToDashboard}>
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="tiers-grid">
        {TIERS_LADDER.map((item) => {
          const rateNum = parseInt(item.revShare, 10);
          const isCurrent = rateNum === commissionRate;

          return (
            <div 
              key={item.tier} 
              className={`tier-card ${isCurrent ? 'current-tier' : ''}`}
            >
              {isCurrent && (
                <div className="tier-current-tag">
                  <Sparkles size={11} />
                  <span>ACTIVE COMMISSION TIER</span>
                </div>
              )}

              <div className="tier-header">
                <span className="tier-pill-label">Tier {item.tier}</span>
                <h3 className="tier-title">{item.name}</h3>
                <div className="tier-rate text-gold">
                  {item.revShare} <span className="rate-sub">RevShare</span>
                </div>
                <div className="tier-threshold">
                  Threshold: <strong>{item.threshold}</strong>
                </div>
              </div>

              <div className="tier-perks-list">
                <span className="perks-label">Included Perks:</span>
                <ul>
                  {item.perks.map((perk, idx) => (
                    <li key={idx}>
                      <Check size={14} className="text-green" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tier-footer-action">
                <button
                  className={`tier-select-btn ${isCurrent ? 'tier-btn-active' : ''}`}
                  onClick={() => handleSelectTier(item)}
                >
                  <Zap size={14} />
                  <span>{isCurrent ? `Active Tier (${item.revShare})` : `Set Dynamic Rate (${item.revShare})`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
