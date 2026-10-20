import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, MessageCircle, ExternalLink, Sparkles, QrCode } from 'lucide-react';
import { INFLUENCER_PROFILE } from '../../data/mockData';

export default function ReferralLinksView({ onBackToDashboard, showToast, commissionRate = 25, currentUser }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const referralCode = currentUser?.referral_code || INFLUENCER_PROFILE.referralCode;
  const referralLink = referralCode 
    ? `https://shivimanufacturer.com/?ref=${referralCode}` 
    : INFLUENCER_PROFILE.referralLink;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast(`Code ${referralCode} copied!`, "success");
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const message = `Check out ethnic collection from Shivi Manufacturer! Use my code *${referralCode}* for 25% OFF: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="view-page-container animate-fade-in">
      <div className="view-page-header">
        <div>
          <h2 className="view-page-title">Referral Links & Coupon Codes</h2>
          <p className="view-page-subtitle">
            Share these with your audience to track orders and earn {commissionRate}% commission.
          </p>
        </div>
        <button className="back-nav-button" onClick={onBackToDashboard}>
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="referral-cards-grid">
        {/* Main Referral Code */}
        <div className="referral-detail-card">
          <div className="card-top-header">
            <span className="card-label-badge">PRIMARY COUPON CODE</span>
            <span className="discount-pill">25% Discount to Customer</span>
          </div>

          <div className="code-display-banner">
            <span className="highlight-code">{referralCode}</span>
            <button 
              className={`copy-banner-btn ${copiedCode ? 'copied' : ''}`}
              onClick={handleCopyCode}
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="card-help-text">
            Tell your followers to enter this code during checkout at <strong>shivimanufacturer.com</strong>.
          </p>
        </div>

        {/* Main Referral Link */}
        <div className="referral-detail-card">
          <div className="card-top-header">
            <span className="card-label-badge">DIRECT STORE LINK</span>
            <span className="discount-pill">Auto-Applies Code</span>
          </div>

          <div className="link-display-banner">
            <span className="highlight-link">{referralLink}</span>
            <button 
              className={`copy-banner-btn ${copiedLink ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <p className="card-help-text">
            Add this link in your Instagram Bio, YouTube video descriptions, or WhatsApp broadcasts.
          </p>
        </div>
      </div>

      {/* Sharing Guidelines Card */}
      <div className="guidelines-simple-card">
        <h3 className="guidelines-card-title">How to maximize your affiliate earnings:</h3>
        <ul className="guidelines-list">
          <li>
            <strong className="text-gold">1. Instagram Bio & Stories:</strong> Paste your direct referral link in your bio and share swipe-up story links with coupon code <code>{referralCode}</code>.
          </li>
          <li>
            <strong className="text-gold">2. YouTube Video Description:</strong> Include your link at the very top of your video descriptions when reviewing or styling Shivi Manufacturer outfits.
          </li>
          <li>
            <strong className="text-gold">3. WhatsApp Direct Share:</strong> Share recommendations with friends and shopping groups using one-click WhatsApp sharing.
          </li>
        </ul>

        <div className="guidelines-action-row">
          <button 
            className="whatsapp-share-button"
            onClick={handleWhatsAppShare}
          >
            <MessageCircle size={15} />
            <span>Share on WhatsApp Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
