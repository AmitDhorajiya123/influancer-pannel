import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/formatters';

export default function PayoutModal({ 
  isOpen, 
  onClose, 
  availableBalance, 
  currency, 
  onSubmitPayout,
  minPayout = 500,
  bankDetails = null,
  onAddBankDetails
}) {
  const [withdrawAmount, setWithdrawAmount] = useState(availableBalance);
  const [method, setMethod] = useState('bank');
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hasBank = Boolean(bankDetails?.has_bank);
  const hasUpi = Boolean(bankDetails?.has_upi);
  const bankLabel = hasBank
    ? `${bankDetails.bank_name ? bankDetails.bank_name + ' ' : ''}${bankDetails.account_number_masked || ''}`
    : 'Add bank account on the Payouts page';
  const destinationLabel = method === 'upi' ? (bankDetails?.upi_id || '') : bankLabel;

  // Reset the amount and pick an available method each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setWithdrawAmount(availableBalance);
      setError('');
      setMethod(hasBank || !hasUpi ? 'bank' : 'upi');
    }
  }, [isOpen, availableBalance, hasBank, hasUpi]);

  if (!isOpen) return null;

  const amountNum = Number(withdrawAmount) || 0;
  const invalidAmount = amountNum < minPayout || amountNum > availableBalance;

  const handlePercentage = (pct) => {
    setWithdrawAmount(Math.round(availableBalance * (pct / 100)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invalidAmount || submitting) return;
    if ((method === 'bank' && !hasBank) || (method === 'upi' && !hasUpi)) {
      setError(method === 'upi' ? 'Please add your UPI ID first.' : 'Please add your bank account first.');
      return;
    }

    setSubmitting(true);
    setError('');
    const res = onSubmitPayout
      ? await onSubmitPayout({ amount: amountNum, method })
      : { status: false, message: 'Payout is not available.' };
    setSubmitting(false);

    if (!res?.status) {
      setError(res?.message || 'Unable to request payout.');
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D97706', '#F59E0B', '#10B981', '#FFFFFF']
      });
    } catch (err) {}

    setReferenceId(res.payout?.id || '');
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-window payout-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Coins size={18} className="text-gold" />
            <h3 className="modal-title">Request Payout Withdrawal</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={handleClose}
            aria-label="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="payout-success-state animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle size={44} className="text-green" />
            </div>
            <h4 className="success-title">Withdrawal Request Received!</h4>
            <p className="success-description">
              Your request for <strong className="text-gold">{formatCurrency(amountNum, currency)}</strong> has been sent to Shivi Manufacturer. You will see the UTR here once it is paid.
            </p>
            
            <div className="success-receipt-card">
              <div className="receipt-row">
                <span>Payout ID:</span>
                <strong className="font-mono text-gold">{referenceId}</strong>
              </div>
              <div className="receipt-row">
                <span>Destination:</span>
                <span>{method === 'bank' ? 'Bank Transfer' : 'UPI'} · {destinationLabel}</span>
              </div>
              <div className="receipt-row">
                <span>Status:</span>
                <span className="text-green font-semibold">Requested (Processing)</span>
              </div>
            </div>

            <button 
              className="primary-action-button w-full mt-4"
              onClick={handleClose}
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            {/* Balance Overview Card */}
            <div className="balance-summary-box">
              <span className="balance-sub-label">Available for Withdrawal</span>
              <h2 className="balance-big-amount text-gold tabular-nums">
                {formatCurrency(availableBalance, currency)}
              </h2>
              <span className="balance-notice-text">
                <ShieldCheck size={13} className="text-green" />
                No processing or convenience fee
              </span>
            </div>

            {/* Amount input */}
            <div className="form-group-item mt-3">
              <label className="settings-field-label">Withdrawal Amount (₹)</label>
              <div className="input-with-action">
                <input 
                  type="number" 
                  step="1"
                  min={minPayout}
                  max={availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="simple-text-input tabular-nums font-semibold"
                  required
                />
                <button 
                  type="button" 
                  className="max-pill-btn"
                  onClick={() => setWithdrawAmount(availableBalance)}
                >
                  MAX
                </button>
              </div>

              {/* Quick Presets */}
              <div className="preset-amounts-row mt-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className="preset-pill"
                    onClick={() => handlePercentage(pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Method */}
            <div className="form-group-item mt-3">
              <label className="settings-field-label">Select Destination</label>
              <div className="method-selector-grid">
                <label className={`method-choice-card ${method === 'bank' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payoutMethod" 
                    value="bank" 
                    checked={method === 'bank'} 
                    onChange={() => setMethod('bank')}
                    disabled={!hasBank}
                  />
                  <div className="method-info">
                    <span className="method-name">Bank Transfer (NEFT/IMPS)</span>
                    <span className="method-sub">{bankLabel}</span>
                  </div>
                  <Building2 size={16} className="text-gold" />
                </label>

                <label className={`method-choice-card ${method === 'upi' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payoutMethod" 
                    value="upi" 
                    checked={method === 'upi'} 
                    onChange={() => setMethod('upi')}
                    disabled={!hasUpi}
                  />
                  <div className="method-info">
                    <span className="method-name">Instant UPI</span>
                    <span className="method-sub">{hasUpi ? bankDetails.upi_id : 'Add UPI ID on the Payouts page'}</span>
                  </div>
                  <Smartphone size={16} className="text-gold" />
                </label>
              </div>
            </div>

            {/* Saved payout account */}
            <div className="form-group-item mt-3">
              {(!hasBank && !hasUpi) ? (
                <div className="balance-notice-text" style={{ color: '#B45309' }}>
                  Add your bank account or UPI ID before requesting a payout.{' '}
                  {onAddBankDetails && (
                    <button type="button" className="max-pill-btn" onClick={onAddBankDetails}>Add payout account</button>
                  )}
                </div>
              ) : (
                <span className="balance-notice-text">
                  Paid to your saved {method === 'upi' ? 'UPI ID' : 'bank account'}: <strong>{destinationLabel}</strong>
                </span>
              )}
              <span className="balance-notice-text mt-2">
                Minimum withdrawal: {formatCurrency(minPayout, currency)}
              </span>
            </div>

            {error && (
              <div className="balance-notice-text mt-3" style={{ color: '#DC2626' }} role="alert">
                {error}
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-actions-row mt-5">
              <button 
                type="button" 
                className="modal-cancel-btn" 
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="primary-action-button"
                disabled={invalidAmount || submitting}
              >
                <span>{submitting ? 'Submitting...' : 'Confirm Withdrawal'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
