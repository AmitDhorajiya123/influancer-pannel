import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  QrCode, 
  Wand2, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  MessageCircle,
  ExternalLink,
  Zap,
  Globe2
} from 'lucide-react';
import { CREATOR_PROFILE } from '../data/mockData';

// Clean SVG Social Icons
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function HeroBanner({ 
  onOpenLinkBuilder, 
  onOpenQRCode, 
  onOpenGuidelines,
  showToast 
}) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(CREATOR_PROFILE.primaryLink);
    setCopied(true);
    showToast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2400);
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(CREATOR_PROFILE.primaryCode);
    setCodeCopied(true);
    showToast(`Code ${CREATOR_PROFILE.primaryCode} copied!`, "success");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const text = `Exclusive 25% OFF discount using code ${CREATOR_PROFILE.primaryCode} at ${CREATOR_PROFILE.primaryLink}`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      handleCopyLink();
      showToast(`Link & caption copied for ${platform}!`, "success");
    }
  };

  const progressPercent = ((CREATOR_PROFILE.tierProgress / CREATOR_PROFILE.tierTarget) * 100).toFixed(1);

  return (
    <section className="hero-banner-grid">
      {/* Left Card: Live Performance & Sprint */}
      <div className="hero-card hero-performance-card">
        <div className="hero-top-badge-row">
          <div className="sprint-status-chip">
            <span className="live-dot" />
            <span className="sprint-status-text">Live Performance</span>
            <span className="sprint-separator">•</span>
            <span className="sprint-campaign-name">Q4 Affiliate Sprint</span>
          </div>
        </div>

        <div className="hero-welcome-content">
          <h2 className="hero-greeting">
            Welcome back, <br />
            <span className="hero-name-gradient">{CREATOR_PROFILE.name}</span>
          </h2>
          <p className="hero-description">
            Your community traffic surged <strong className="text-highlight">+24%</strong> after the latest tech review. You are currently <strong className="text-gold">{CREATOR_PROFILE.usersNeeded} conversions</strong> away from unlocking the Tier 4 Creator bonus.
          </p>
        </div>

        {/* Sprint progress meter */}
        <div className="sprint-progress-container">
          <div className="sprint-progress-header">
            <span className="sprint-progress-label">Tier 4 Creator Bonus Unlock</span>
            <span className="sprint-progress-count">
              <strong>{CREATOR_PROFILE.tierProgress}</strong> / {CREATOR_PROFILE.tierTarget} Mapped
            </span>
          </div>
          <div className="progress-track-bar">
            <div 
              className="progress-fill-bar" 
              style={{ width: `${progressPercent}%` }}
            >
              <span className="progress-pulse-head" />
            </div>
          </div>
        </div>

        <div className="hero-footer-status">
          <div className="status-live-indicator">
            <span className="live-dot" />
            <span className="status-text">Current Status:</span>
            <strong className="status-highlight">Active & Tracking</strong>
          </div>

          <button 
            className="view-guidelines-btn"
            onClick={onOpenGuidelines}
            id="view-guidelines-btn"
          >
            <span>View Guidelines</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Right Card: Primary Partner Link & Code */}
      <div className="hero-card hero-gateway-card">
        <div className="gateway-header-row">
          <div className="gateway-title-box">
            <span className="gateway-eyebrow">PRIMARY PARTNER LINK & CODE</span>
            <h3 className="gateway-title">Universal Referral Gateway</h3>
          </div>

          <div className="gateway-action-pills">
            <button 
              className="gateway-pill-btn"
              onClick={onOpenLinkBuilder}
              id="hero-link-builder-btn"
              title="Open Link & UTM Builder"
            >
              <Wand2 size={13} />
              <span>Link Builder</span>
            </button>
            <button 
              className="gateway-pill-btn"
              onClick={onOpenQRCode}
              id="hero-qr-code-btn"
              title="Generate QR Code"
            >
              <QrCode size={13} />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Link Display Box */}
        <div className="gateway-link-container">
          <button 
            type="button"
            className="gateway-code-chip"
            onClick={handleCopyCode}
            title="Click to copy promo code"
          >
            <span>{codeCopied ? 'COPIED' : CREATOR_PROFILE.primaryCode}</span>
          </button>
          
          <div className="gateway-url-display">
            <span className="url-text" title={CREATOR_PROFILE.primaryLink}>
              {CREATOR_PROFILE.primaryLink}
            </span>
          </div>

          <button 
            className={`copy-link-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
            id="copy-universal-link-btn"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Share Row */}
        <div className="gateway-bottom-row">
          <div className="quick-share-group">
            <span className="quick-share-label">Quick Share:</span>
            <div className="share-icons-wrap">
              <button 
                className="social-share-btn"
                onClick={() => handleShare('instagram')}
                title="Share to Instagram"
                id="share-instagram-btn"
              >
                <InstagramIcon />
              </button>
              <button 
                className="social-share-btn"
                onClick={() => handleShare('tiktok')}
                title="Share to TikTok"
                id="share-tiktok-btn"
              >
                <Share2 size={14} />
              </button>
              <button 
                className="social-share-btn"
                onClick={() => handleShare('youtube')}
                title="Share to YouTube"
                id="share-youtube-btn"
              >
                <YoutubeIcon />
              </button>
              <button 
                className="social-share-btn"
                onClick={() => handleShare('twitter')}
                title="Share to X (Twitter)"
                id="share-twitter-btn"
              >
                <TwitterIcon />
              </button>
              <button 
                className="social-share-btn"
                onClick={() => handleShare('whatsapp')}
                title="Share to WhatsApp"
                id="share-whatsapp-btn"
              >
                <MessageCircle size={14} />
              </button>
            </div>
          </div>

          <div className="gateway-clicks-stat">
            <span className="live-dot" />
            <span className="clicks-text">
              <strong>{CREATOR_PROFILE.todayClicks.toLocaleString()}</strong> clicks today ({CREATOR_PROFILE.todayCtr} CTR)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
