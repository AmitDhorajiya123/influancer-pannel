import React, { useState } from 'react';
import { 
  X, 
  Wand2, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ExternalLink 
} from 'lucide-react';
import { CREATOR_PROFILE } from '../data/mockData';

export default function LinkBuilderModal({ 
  isOpen, 
  onClose, 
  initialTab = 'link',
  showToast 
}) {
  const [activeModalTab, setActiveModalTab] = useState(initialTab);
  const [campaignName, setCampaignName] = useState('youtube-review');
  const [source, setSource] = useState('youtube');
  const [medium, setMedium] = useState('video-description');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedUrl = `https://creatorapex.is/join?ref=elena&utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaignName}&code=ELENA-VIP25`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    showToast("Custom campaign link copied!", "success");
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownloadQR = () => {
    showToast("QR code downloaded as high-res PNG image!", "success");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window link-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tabs-header">
            <button 
              className={`modal-tab-toggle ${activeModalTab === 'link' ? 'active' : ''}`}
              onClick={() => setActiveModalTab('link')}
            >
              <Wand2 size={15} />
              <span>UTM Link Builder</span>
            </button>
            <button 
              className={`modal-tab-toggle ${activeModalTab === 'qr' ? 'active' : ''}`}
              onClick={() => setActiveModalTab('qr')}
            >
              <QrCode size={15} />
              <span>QR Code Studio</span>
            </button>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-pad">
          {activeModalTab === 'link' ? (
            <div className="link-builder-view">
              <p className="modal-subtitle-text">
                Generate tailored tracking links with automatic 25% VIP checkout attribution.
              </p>

              <div className="form-group">
                <label className="form-label">Campaign Tag / Title</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="form-input"
                  placeholder="e.g. tech-review-q4"
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Traffic Source</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="form-select"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="x-twitter">X (Twitter)</option>
                    <option value="podcast">Podcast</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Placement / Medium</label>
                  <select 
                    value={medium} 
                    onChange={(e) => setMedium(e.target.value)}
                    className="form-select"
                  >
                    <option value="video-description">Video Description</option>
                    <option value="bio-link">Bio Link</option>
                    <option value="story-swipe">Story Sticker</option>
                    <option value="pinned-comment">Pinned Comment</option>
                    <option value="banner">Banner Ad</option>
                  </select>
                </div>
              </div>

              {/* Generated Result Box */}
              <div className="generated-link-card">
                <div className="gen-label-row">
                  <span className="gen-label">Generated Partner Link</span>
                  <span className="gen-code-badge">Code: ELENA-VIP25</span>
                </div>
                <div className="gen-url-text">{generatedUrl}</div>
                <div className="gen-actions-row">
                  <button 
                    className={`modal-primary-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy Tracking Link'}</span>
                  </button>
                  <button 
                    className="modal-secondary-btn"
                    onClick={() => setActiveModalTab('qr')}
                  >
                    <QrCode size={14} />
                    <span>View QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="qr-code-studio-view">
              <p className="modal-subtitle-text">
                Scan to instantly open Elena Vance's VIP referral landing page with auto-applied discount.
              </p>

              {/* QR Code Canvas Mockup */}
              <div className="qr-preview-container">
                <div className="qr-svg-card">
                  <svg viewBox="0 0 160 160" width="160" height="160" className="qr-svg">
                    {/* Outer dark rect */}
                    <rect width="160" height="160" fill="#FFFFFF" rx="12" />
                    {/* Top-Left Finder */}
                    <rect x="15" y="15" width="40" height="40" rx="6" fill="#14151B" />
                    <rect x="23" y="23" width="24" height="24" rx="4" fill="#FFFFFF" />
                    <rect x="29" y="29" width="12" height="12" rx="2" fill="#E5A869" />

                    {/* Top-Right Finder */}
                    <rect x="105" y="15" width="40" height="40" rx="6" fill="#14151B" />
                    <rect x="113" y="23" width="24" height="24" rx="4" fill="#FFFFFF" />
                    <rect x="119" y="29" width="12" height="12" rx="2" fill="#E5A869" />

                    {/* Bottom-Left Finder */}
                    <rect x="15" y="105" width="40" height="40" rx="6" fill="#14151B" />
                    <rect x="23" y="113" width="24" height="24" rx="4" fill="#FFFFFF" />
                    <rect x="29" y="119" width="12" height="12" rx="2" fill="#E5A869" />

                    {/* QR Code Dots Matrix */}
                    <rect x="65" y="20" width="8" height="8" rx="2" fill="#14151B" />
                    <rect x="80" y="20" width="12" height="8" rx="2" fill="#14151B" />
                    <rect x="65" y="35" width="25" height="8" rx="2" fill="#14151B" />
                    <rect x="20" y="65" width="30" height="8" rx="2" fill="#14151B" />
                    <rect x="60" y="60" width="38" height="38" rx="8" fill="#14151B" />
                    <text x="79" y="83" fill="#E5A869" fontSize="12" fontWeight="800" textAnchor="middle">SM</text>
                    <rect x="110" y="65" width="30" height="8" rx="2" fill="#14151B" />
                    <rect x="65" y="110" width="8" height="16" rx="2" fill="#14151B" />
                    <rect x="80" y="110" width="20" height="8" rx="2" fill="#14151B" />
                    <rect x="110" y="110" width="35" height="18" rx="2" fill="#14151B" />
                    <rect x="80" y="130" width="12" height="12" rx="2" fill="#14151B" />
                  </svg>
                </div>
                <div className="qr-info-meta">
                  <div className="qr-code-text">Code: <strong>{CREATOR_PROFILE.primaryCode}</strong></div>
                  <div className="qr-link-text">{CREATOR_PROFILE.primaryLink}</div>
                  <div className="qr-perk-text">Includes: 25% VIP Discount + Partner Mapping</div>
                </div>
              </div>

              <div className="qr-actions-row">
                <button 
                  className="modal-primary-btn"
                  onClick={handleDownloadQR}
                >
                  <Download size={15} />
                  <span>Download High-Res PNG</span>
                </button>
                <button 
                  className="modal-secondary-btn"
                  onClick={handleCopy}
                >
                  <Copy size={15} />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
