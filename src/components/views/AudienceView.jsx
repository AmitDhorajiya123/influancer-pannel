import React from 'react';
import { Users, Globe2, Smartphone, Monitor, TrendingUp } from 'lucide-react';

export default function AudienceView({ onBackToDashboard }) {
  const geoData = [
    { country: "United States", share: "48%", users: "685 users", flag: "🇺🇸" },
    { country: "United Kingdom", share: "18%", users: "257 users", flag: "🇬🇧" },
    { country: "India", share: "15%", users: "214 users", flag: "🇮🇳" },
    { country: "Germany", share: "10%", users: "142 users", flag: "🇩🇪" },
    { country: "Canada & Others", share: "9%", users: "130 users", flag: "🇨🇦" }
  ];

  return (
    <div className="view-container animate-fade-in">
      <div className="view-header">
        <div>
          <h2 className="view-title">Audience Demographics & Retention</h2>
          <p className="view-subtitle">
            Geographical dispersion, device affinities, and retention cohort analytics.
          </p>
        </div>
        <button className="view-back-btn" onClick={onBackToDashboard}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="audience-grid">
        {/* Top Countries */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">TOP GEOGRAPHICAL REGIONS</span>
            <Globe2 size={16} className="text-gold" />
          </div>
          <div className="geo-list mt-3">
            {geoData.map((g) => (
              <div key={g.country} className="geo-item-row">
                <div className="geo-name-wrap">
                  <span className="geo-flag">{g.flag}</span>
                  <span className="geo-country">{g.country}</span>
                </div>
                <div className="geo-stats">
                  <span className="geo-users">{g.users}</span>
                  <strong className="geo-share text-gold">{g.share}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices Breakdown */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-title">DEVICE ATTRIBUTION</span>
            <Smartphone size={16} className="text-gold" />
          </div>
          <div className="device-stats-wrap mt-4">
            <div className="device-stat-box">
              <Smartphone size={24} className="text-gold mb-2" />
              <h3 className="device-pct">64%</h3>
              <span className="device-sub">Mobile / Tablets (914 users)</span>
            </div>
            <div className="device-stat-box">
              <Monitor size={24} className="text-gold mb-2" />
              <h3 className="device-pct">36%</h3>
              <span className="device-sub">Desktop Web (514 users)</span>
            </div>
          </div>
          <div className="retention-info-box mt-4">
            <TrendingUp size={15} className="text-green" />
            <span>90-Day Retention Rate: <strong className="text-green">86.4%</strong> (Top 5% Partner Network)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
