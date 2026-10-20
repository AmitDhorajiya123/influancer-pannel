import React from 'react';
import { REVENUE_STREAMS, CREATOR_PROFILE } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { ShieldAlert, Award, Sparkles, ChevronRight } from 'lucide-react';

export default function RevenueStreams({ currency, onOpenTiers }) {
  const percentComplete = ((CREATOR_PROFILE.tierProgress / CREATOR_PROFILE.tierTarget) * 100).toFixed(1);

  return (
    <div className="revenue-streams-card">
      <div className="streams-header-row">
        <h3 className="streams-title">Revenue Streams</h3>
        <span className="breakdown-badge">Breakdown</span>
      </div>

      {/* Stream Progress Bars */}
      <div className="streams-list">
        {REVENUE_STREAMS.map((stream) => (
          <div key={stream.id} className="stream-item">
            <div className="stream-item-header">
              <div className="stream-name-wrap">
                <span 
                  className="stream-dot" 
                  style={{ backgroundColor: stream.color }} 
                />
                <span className="stream-name">{stream.name}</span>
              </div>
              <div className="stream-values">
                <span className="stream-percent">{stream.percentage}%</span>
                <span className="stream-amount tabular-nums">
                  ({formatCurrency(stream.amount, currency)})
                </span>
              </div>
            </div>

            <div className="stream-bar-track">
              <div 
                className="stream-bar-fill" 
                style={{ 
                  width: `${stream.percentage}%`,
                  backgroundColor: stream.color,
                  boxShadow: `0 0 10px ${stream.color}50`
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Milestone Unlock Status Box */}
      <div className="tier-milestone-box">
        <div className="milestone-box-header">
          <div className="milestone-title-wrap">
            <Award size={14} className="milestone-trophy-icon text-gold" />
            <span className="milestone-title">
              LEVEL {CREATOR_PROFILE.nextTierLevel} UNLOCKED AT {CREATOR_PROFILE.tierTarget.toLocaleString()}
            </span>
          </div>
          <span className="milestone-count tabular-nums">
            {CREATOR_PROFILE.tierProgress} / {CREATOR_PROFILE.tierTarget}
          </span>
        </div>

        {/* Dual-tone Progress Bar */}
        <div className="milestone-progress-track">
          <div 
            className="milestone-progress-fill" 
            style={{ width: `${percentComplete}%` }}
          >
            <div className="milestone-head-glow" />
          </div>
        </div>

        <div className="milestone-footer-row">
          <span className="milestone-perk-text">
            Next Perk: <strong className="text-gold">{CREATOR_PROFILE.nextTierRate}% RevShare</strong>
          </span>
          <span className="milestone-remaining-text">
            <strong>{CREATOR_PROFILE.usersNeeded}</strong> users left
          </span>
        </div>
      </div>
    </div>
  );
}
