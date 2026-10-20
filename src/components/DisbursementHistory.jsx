import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  FileCheck, 
  Download, 
  ExternalLink 
} from 'lucide-react';

export default function DisbursementHistory({ 
  disbursements, 
  onViewAll, 
  onDownloadTaxStatement,
  showToast 
}) {
  const handleDownload = () => {
    showToast("Generating official Partner Statement PDF...", "success");
    if (onDownloadTaxStatement) onDownloadTaxStatement();
  };

  return (
    <div className="bottom-card disbursements-card">
      <div className="bottom-card-header">
        <div className="bottom-card-title-wrap">
          <h3 className="bottom-card-title">Disbursement History</h3>
          <p className="bottom-card-subtitle">
            Settled wire & ACH bank transfers.
          </p>
        </div>

        <button 
          className="card-header-link-btn"
          onClick={onViewAll}
          id="disbursement-view-all-btn"
        >
          <span>View All</span>
        </button>
      </div>

      <div className="disbursements-list">
        {disbursements.map((item) => (
          <div key={item.id} className="disbursement-row">
            <div className="disbursement-left">
              <div className="bank-icon-wrap">
                <CheckCircle2 size={16} className="text-gold" />
              </div>
              <div className="disbursement-meta">
                <span className="disbursement-title">{item.title}</span>
                <span className="disbursement-sub">{item.dateId}</span>
              </div>
            </div>

            <div className="disbursement-right">
              <span className="disbursement-amount tabular-nums">
                {item.amount}
              </span>
              <span className="disbursement-badge-settled">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Tax Status Footer */}
      <div className="disbursement-tax-footer">
        <div className="tax-verified-info">
          <FileCheck size={14} className="text-gold" />
          <span className="tax-label">
            Tax Form 1099-NEC: <strong className="text-secondary font-medium">On File</strong> <span className="text-green font-medium">(Verified)</span>
          </span>
        </div>

        <button 
          className="download-statement-btn"
          onClick={handleDownload}
          id="download-statements-btn"
        >
          <span>Download Statements</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}
