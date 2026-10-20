import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { sendInfluencerOtp, verifyInfluencerOtp } from '../utils/api';

const getOtpLength = (response) => {
  const payload = response?.data ?? response;
  const configuredLength = Number(
    payload?.otp_length ?? payload?.otpLength ?? payload?.otp_digits ?? payload?.otpDigits
  );

  return Number.isInteger(configuredLength) && configuredLength > 0 && configuredLength <= 12
    ? configuredLength
    : 6;
};

export default function LoginPage({ onLogin, showToast }) {
  // Mobile & OTP State
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLength, setOtpLength] = useState(6);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Loading State
  const [loading, setLoading] = useState(false);

  // Resend Timer Countdown
  useEffect(() => {
    let interval = null;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      const msg = 'Please enter a valid 10-digit mobile number';
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await sendInfluencerOtp(cleanMobile);
      setLoading(false);

      if (res.status) {
        setOtpSent(true);
        setOtpCode('');
        setOtpLength(getOtpLength(res));
        setResendTimer(30);
        setCanResend(false);
        const msg = res.message || `OTP sent successfully to +91 ${cleanMobile}`;
        if (showToast) showToast(msg, 'success');
      } else {
        const errorMsg = res.message || 'Failed to send OTP. Please try again.';
        setErrorMessage(errorMsg);
        if (showToast) showToast(errorMsg, 'error');
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err.message || 'Server connection error. Please try again.';
      setErrorMessage(errorMsg);
      if (showToast) showToast(errorMsg, 'error');
    }
  };

  // Handle Verify OTP & Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== otpLength) {
      const msg = `Please enter the ${otpLength}-digit verification OTP`;
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyInfluencerOtp(mobileNumber, cleanOtp);
      setLoading(false);

      if (res.status && res.access_token) {
        if (showToast) showToast(res.message || 'Login successful!', 'success');
        if (onLogin) {
          onLogin(res.user, res.access_token);
        }
      } else {
        const errorMsg = res.message || 'Invalid or expired OTP. Please try again.';
        setErrorMessage(errorMsg);
        if (showToast) showToast(errorMsg, 'error');
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err.message || 'Verification failed. Please try again.';
      setErrorMessage(errorMsg);
      if (showToast) showToast(errorMsg, 'error');
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (!canResend || loading) return;
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await sendInfluencerOtp(mobileNumber);
      setLoading(false);

      if (res.status) {
        const nextOtpLength = getOtpLength(res);
        setOtpLength(nextOtpLength);
        setOtpCode((currentOtp) => currentOtp.slice(0, nextOtpLength));
        setResendTimer(30);
        setCanResend(false);
        const msg = res.message || `New OTP sent to +91 ${mobileNumber}`;
        if (showToast) showToast(msg, 'info');
      } else {
        const errorMsg = res.message || 'Failed to resend OTP.';
        setErrorMessage(errorMsg);
        if (showToast) showToast(errorMsg, 'error');
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err.message || 'Network error. Could not resend OTP.';
      setErrorMessage(errorMsg);
      if (showToast) showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="login-screen-wrap">
      <div className="login-box-card animate-fade-in">
        {/* Shivi Logo Header */}
        <div className="login-logo-container">
          <div className="login-logo-badge">
            <img 
              src={logo} 
              alt="Shivi Manufacturer" 
              className="login-shivi-logo"
              onError={(e) => {
                e.target.src = "https://shivimanufacturer.com/storage/images/settings/logo-6abe91be75972.png";
              }}
            />
          </div>
          <h1 className="login-brand-heading">SHIVI MANUFACTURER</h1>
          <p className="login-portal-badge">INFLUENCER PARTNER PORTAL</p>
        </div>

        {/* Inline Error Alert */}
        {errorMessage && (
          <div className="login-inline-error mb-3" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.85rem',
            lineHeight: '1.4'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mobile & OTP Authentication */}
        {!otpSent ? (
          // Step 1: Mobile Number Entry
          <form onSubmit={handleSendOtp} className="simple-auth-form mt-2">
            <div className="form-field-group">
              <label className="form-field-label" htmlFor="login-mobile-input">Registered Mobile Number</label>
              <div className="form-input-container phone-input-box">
                <div className="phone-prefix-badge">
                  <span>🇮🇳 +91</span>
                </div>
                <input 
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    setErrorMessage('');
                    setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  }}
                  placeholder="Enter 10-digit number"
                  className="simple-text-input tabular-nums font-medium"
                  id="login-mobile-input"
                  autoFocus
                />
              </div>
              <span className="field-helper-text">
                Enter your registered influencer mobile number to receive an OTP
              </span>
            </div>

            <button 
              type="submit" 
              className="login-submit-button mt-4"
              disabled={loading || mobileNumber.length < 10}
              id="send-otp-button"
            >
              {loading ? "Sending OTP..." : "Get OTP on Mobile"}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          // Step 2: OTP Entry
          <form onSubmit={handleVerifyOtp} className="simple-auth-form mt-2 animate-fade-in">
            <div className="otp-destination-row">
              <div className="otp-dest-text">
                <span>Code sent to <strong>+91 {mobileNumber}</strong></span>
              </div>
              <button 
                type="button" 
                className="change-mobile-link"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode('');
                  setErrorMessage('');
                }}
              >
                Edit Number
              </button>
            </div>

            <div className="form-field-group mt-3">
                <label className="form-field-label" htmlFor="login-otp-input">Enter {otpLength}-Digit Verification OTP</label>
              <div className="form-input-container">
                <KeyRound size={16} className="form-field-icon" />
                <input 
                  type="text" 
                  required
                  maxLength={otpLength}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => {
                    setErrorMessage('');
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, otpLength));
                  }}
                  placeholder={Array(otpLength).fill('•').join(' ')}
                  className="simple-text-input tabular-nums text-center tracking-widest font-mono text-lg font-bold"
                  id="login-otp-input"
                  autoFocus
                />
              </div>
              <div className="otp-helper-row" style={{ justifyContent: 'flex-end', marginTop: '6px' }}>
                {canResend ? (
                  <button 
                    type="button" 
                    onClick={handleResend}
                    className="resend-otp-btn"
                    disabled={loading}
                  >
                    <RefreshCw size={12} />
                    Resend OTP
                  </button>
                ) : (
                  <span className="resend-countdown-text">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="login-submit-button mt-4"
              disabled={loading || otpCode.length !== otpLength}
              id="verify-otp-button"
            >
              {loading ? "Verifying OTP..." : "Verify OTP & Sign In"}
              <CheckCircle2 size={16} />
            </button>

            <button 
              type="button" 
              className="back-step-btn mt-2"
              onClick={() => {
                setOtpSent(false);
                setOtpCode('');
                setErrorMessage('');
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Mobile Entry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
