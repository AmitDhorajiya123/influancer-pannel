import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Pencil, Smartphone } from 'lucide-react';

/**
 * Influencer's payout bank account / UPI.
 * Shows the saved (masked) details, or a form to add / edit them.
 */
export default function BankDetailsCard({ bankDetails, onSave }) {
  const hasAny = Boolean(bankDetails && (bankDetails.has_bank || bankDetails.has_upi));
  const [editing, setEditing] = useState(!hasAny);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    account_holder_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc: '',
    bank_name: '',
    upi_id: ''
  });

  useEffect(() => {
    setEditing(!hasAny);
    setForm({
      account_holder_name: bankDetails?.account_holder_name || '',
      account_number: '',
      confirm_account_number: '',
      ifsc: bankDetails?.ifsc || '',
      bank_name: bankDetails?.bank_name || '',
      upi_id: bankDetails?.upi_id || ''
    });
  }, [bankDetails, hasAny]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const bankStarted = form.account_holder_name || form.account_number || form.ifsc;
    if (!bankStarted && !form.upi_id.trim()) {
      setError('Enter bank account details or a UPI ID.');
      return;
    }
    if (form.account_number && form.account_number !== form.confirm_account_number) {
      setError('Account numbers do not match.');
      return;
    }

    setSaving(true);
    const res = await onSave({
      ...form,
      ifsc: form.ifsc.trim().toUpperCase(),
      upi_id: form.upi_id.trim()
    });
    setSaving(false);

    if (!res?.status) {
      setError(res?.message || 'Could not save bank details.');
      return;
    }
    setEditing(false);
  };

  return (
    <div className="payout-summary-card bank-info-card">
      <div className="summary-card-header">
        <span className="summary-card-label">PAYOUT ACCOUNT</span>
        {hasAny && !editing ? (
          <button type="button" className="back-nav-button" style={{ padding: '4px 10px' }} onClick={() => setEditing(true)}>
            <Pencil size={13} />
            <span>Edit</span>
          </button>
        ) : (
          <Building2 size={18} className="text-gold" />
        )}
      </div>

      {!editing && hasAny ? (
        <>
          <div className="bank-details-block">
            {bankDetails.has_bank && (
              <>
                <h4 className="bank-account-name">{bankDetails.bank_name || 'Bank Account'}</h4>
                <div className="bank-details-row">
                  <span className="bank-label">Name:</span>
                  <strong className="bank-val">{bankDetails.account_holder_name}</strong>
                </div>
                <div className="bank-details-row">
                  <span className="bank-label">Account No:</span>
                  <strong className="bank-val font-mono">{bankDetails.account_number_masked}</strong>
                </div>
                <div className="bank-details-row">
                  <span className="bank-label">IFSC Code:</span>
                  <strong className="bank-val font-mono">{bankDetails.ifsc}</strong>
                </div>
              </>
            )}
            {bankDetails.has_upi && (
              <div className="bank-details-row">
                <span className="bank-label">UPI ID:</span>
                <strong className="bank-val font-mono">{bankDetails.upi_id}</strong>
              </div>
            )}
          </div>
          <div className="account-verified-tag">
            <ShieldCheck size={14} className="text-green" />
            <span>Payouts are sent only to this account</span>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="bank-details-block" style={{ display: 'grid', gap: '10px' }}>
          <div>
            <label className="settings-field-label">Account Holder Name</label>
            <input className="simple-text-input" value={form.account_holder_name} onChange={set('account_holder_name')} placeholder="As per bank records" maxLength={120} />
          </div>
          <div>
            <label className="settings-field-label">
              Account Number {bankDetails?.has_bank && <span style={{ fontWeight: 400 }}>(leave empty to keep {bankDetails.account_number_masked})</span>}
            </label>
            <input className="simple-text-input font-mono" value={form.account_number} onChange={set('account_number')} inputMode="numeric" placeholder="9 to 18 digits" maxLength={18} autoComplete="off" />
          </div>
          {form.account_number && (
            <div>
              <label className="settings-field-label">Confirm Account Number</label>
              <input className="simple-text-input font-mono" value={form.confirm_account_number} onChange={set('confirm_account_number')} inputMode="numeric" maxLength={18} autoComplete="off" />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="settings-field-label">IFSC Code</label>
              <input className="simple-text-input font-mono" value={form.ifsc} onChange={set('ifsc')} placeholder="HDFC0001234" maxLength={11} style={{ textTransform: 'uppercase' }} />
            </div>
            <div>
              <label className="settings-field-label">Bank Name</label>
              <input className="simple-text-input" value={form.bank_name} onChange={set('bank_name')} placeholder="Optional" maxLength={120} />
            </div>
          </div>
          <div>
            <label className="settings-field-label"><Smartphone size={12} /> UPI ID (optional)</label>
            <input className="simple-text-input" value={form.upi_id} onChange={set('upi_id')} placeholder="yourname@okhdfcbank" maxLength={256} />
          </div>

          {error && (
            <div className="balance-notice-text" style={{ color: '#DC2626' }} role="alert">{error}</div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {hasAny && (
              <button type="button" className="modal-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            )}
            <button type="submit" className="primary-action-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save Payout Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
