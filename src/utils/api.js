/**
 * Shivi Manufacturer - Influencer Partner API Client
 * 
 * Handles authentication and partner API calls with ApiKey and Bearer tokens.
 */

const API_KEY = 'Zsgc-ejn2wpD22aTUmFPPVC6HFBCsu8rfyB925eh5rv7Sgr7JNnS3hchs-6Y6Rz-fdvdjvffvh-qwee';

// Determine Base API URL
function getBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  // If running in browser locally on Vite port, use Vite proxy /api
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api';
  }
  return 'https://shivimanufacturer.com/api';
}

const TOKEN_KEY = 'shivi_influencer_token';
const USER_KEY = 'shivi_influencer_user';

/**
 * Storage helpers for authentication session
 */
export const authStorage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },
  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveSession: (token, user) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  },
  clearSession: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear session from localStorage', e);
    }
  }
};

/**
 * Send OTP to Influencer Mobile Number
 * POST /api/v1/influencer-login
 * Body: { mobile: "9876543210" }
 */
export async function sendInfluencerOtp(mobile) {
  const cleanMobile = (mobile || '').replace(/\D/g, '').slice(-10);
  if (cleanMobile.length !== 10) {
    return {
      status: false,
      message: 'Please enter a valid 10-digit mobile number.'
    };
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/v1/influencer-login`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ApiKey': API_KEY
      },
      body: JSON.stringify({
        mobile: cleanMobile
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending influencer OTP:', error);
    return {
      status: false,
      message: error.message || 'Network error while sending OTP. Please try again.'
    };
  }
}

/**
 * Verify OTP and authenticate Influencer
 * POST /api/v1/influencer-verify-otp
 * Body: { mobile: "9876543210", otp: "123456" }
 */
export async function verifyInfluencerOtp(mobile, otp) {
  const cleanMobile = (mobile || '').replace(/\D/g, '').slice(-10);
  const cleanOtp = (otp || '').trim();

  if (cleanMobile.length !== 10) {
    return {
      status: false,
      message: 'Please enter a valid 10-digit mobile number.'
    };
  }

  if (!cleanOtp) {
    return {
      status: false,
      message: 'Please enter the verification OTP.'
    };
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/v1/influencer-verify-otp`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ApiKey': API_KEY
      },
      body: JSON.stringify({
        mobile: cleanMobile,
        otp: cleanOtp
      })
    });

    const data = await response.json();

    if (data.status && data.access_token) {
      authStorage.saveSession(data.access_token, data.user);
    }

    return data;
  } catch (error) {
    console.error('Error verifying influencer OTP:', error);
    return {
      status: false,
      message: error.message || 'Network error while verifying OTP.'
    };
  }
}

/**
 * Logout Influencer and invalidate session
 * POST /api/v1/influencer-logout
 */
export async function logoutInfluencer() {
  const token = authStorage.getToken();
  const user = authStorage.getUser();
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/v1/influencer-logout`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ApiKey': API_KEY,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        user_id: user?.id,
        mobile: user?.mobile
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging out influencer:', error);
    return {
      status: true,
      message: 'Logged out locally.'
    };
  } finally {
    authStorage.clearSession();
  }
}


/**
 * Authenticated request helper (ApiKey + Bearer token).
 * Returns parsed JSON. On 401 the session is cleared and { unauthorized: true } is returned.
 */
async function authedRequest(path, { method = 'GET', body, query } = {}) {
  const token = authStorage.getToken();
  const qs = query
    ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString()
    : '';
  const endpoint = `${getBaseUrl()}${path}${qs === '?' ? '' : qs}`;

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ApiKey': API_KEY,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });

    if (response.status === 401) {
      authStorage.clearSession();
      return { status: false, unauthorized: true, message: 'Session expired. Please log in again.' };
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok && data.status === undefined) {
      data.status = false;
    }
    // Laravel validation errors -> first message
    if (!response.ok && data.errors && !data.message) {
      const first = Object.values(data.errors)[0];
      data.message = Array.isArray(first) ? first[0] : String(first);
    }
    return data;
  } catch (error) {
    console.error(`API error ${path}:`, error);
    return { status: false, message: error.message || 'Network error. Please try again.' };
  }
}

/** GET /api/v1/influencer/dashboard -> { profile, metrics, recent_orders } */
export function fetchDashboard() {
  return authedRequest('/v1/influencer/dashboard');
}

/** GET /api/v1/influencer/orders -> { orders, commission_rate } */
export function fetchOrders(params = {}) {
  return authedRequest('/v1/influencer/orders', { query: params });
}

/** GET /api/v1/influencer/mapped-users -> { users, total } */
export function fetchMappedUsers() {
  return authedRequest('/v1/influencer/mapped-users');
}

/** GET /api/v1/influencer/payouts -> { payouts, available_balance, min_payout } */
export function fetchPayouts() {
  return authedRequest('/v1/influencer/payouts');
}

/** POST /api/v1/influencer/payout-request { amount, method: 'bank'|'upi', account_details } */
export function requestPayout(amount, method, accountDetails) {
  return authedRequest('/v1/influencer/payout-request', {
    method: 'POST',
    body: { amount: Number(amount), method, account_details: accountDetails || null }
  });
}
