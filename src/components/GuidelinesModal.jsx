import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Shield,
  Download
} from 'lucide-react';

export default function GuidelinesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window guidelines-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <BookOpen size={18} className="text-gold" />
            <h3 className="modal-title">Creator Partner Guidelines & Rules</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-pad guidelines-body">
          <div className="guideline-card">
            <div className="guideline-head">
              <Shield size={16} className="text-gold" />
              <h4>FTC & Social Media Disclosure</h4>
            </div>
            <p>
              Always state `#ad`, `#sponsored`, or `#partner` clearly within the top 3 lines of video descriptions or Instagram captions when sharing your link <code>ELENA-VIP25</code>.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-head">
              <CheckCircle size={16} className="text-green" />
              <h4>30-Day Cookie Attribution Window</h4>
            </div>
            <p>
              Clicks from your universal gateway store a 30-day tracking cookie. Once a user completes their first order, they are permanently mapped to your partner ledger.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-head">
              <AlertCircle size={16} className="text-gold" />
              <h4>Payout Schedule & Thresholds</h4>
            </div>
            <p>
              Payouts are disbursed every Friday for all settled commissions above the $50 minimum threshold. Wire transfers typically settle in 2 business days.
            </p>
          </div>

          <div className="guidelines-footer-actions">
            <button className="modal-secondary-btn" onClick={onClose}>
              Dismiss
            </button>
            <button 
              className="modal-primary-btn"
              onClick={() => {
                alert("Downloading Creator Brand Asset Kit (Logos, Banners, Product Render Assets)...");
              }}
            >
              <Download size={14} />
              <span>Download Brand Kit (ZIP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
