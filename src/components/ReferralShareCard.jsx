import React, { useState } from 'react';
import { Copy, Check, Share2, Sparkles, ExternalLink } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { INFLUENCER_PROFILE } from '../data/mockData';

export default function ReferralShareCard({ showToast, commissionRate = 25, currentUser }) {
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
    showToast(`Coupon code ${referralCode} copied!`, "success");
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const message = `Hey! Use my exclusive code *${referralCode}* to get 25% OFF on designer kurtis, sarees & ethnic wear at Shivi Manufacturer: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="referral-share-card">
      <div className="share-card-header">
        <div className="share-header-left">
          <div className="share-badge-pill">
            <Sparkles size={13} className="text-gold" />
            <span>YOUR EXCLUSIVE REFERRAL DETAILS</span>
          </div>
          <h2 className="share-card-title">Share & Earn Commission</h2>
        </div>

        <button 
          className="whatsapp-share-button"
          onClick={handleWhatsAppShare}
          id="share-whatsapp-btn"
        >
          <WhatsAppIcon size={16} />
        </button>
      </div>

      <div className="share-boxes-grid">
        {/* Referral Code Box */}
        <div className="share-action-box">
          <span className="share-box-label">Coupon Code</span>
          <div className="code-display-row">
            <strong className="promo-code-text">{referralCode}</strong>
            <button 
              className={`copy-pill-button ${copiedCode ? 'copied' : ''}`}
              onClick={handleCopyCode}
              id="copy-code-btn"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <span className="share-box-sub">Gives 25% instant discount at checkout</span>
        </div>

        {/* Referral Link Box */}
        <div className="share-action-box">
          <span className="share-box-label">Direct Referral Link</span>
          <div className="link-display-row">
            <span className="direct-link-text">{referralLink}</span>
            <button 
              className={`copy-pill-button ${copiedLink ? 'copied' : ''}`}
              onClick={handleCopyLink}
              id="copy-link-btn"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
          <span className="share-box-sub">Auto-applies your promo code on visit</span>
        </div>
      </div>
    </div>
  );
}
