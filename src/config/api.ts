const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    ACTIVATE: `${API_URL}/api/auth/activate`,
    PROFILE: `${API_URL}/api/auth/profile`,
    LOGOUT: `${API_URL}/api/auth/logout`,
  },
  ORGANIZATION: {
    GET_ORGANIZATIONS: `${API_URL}/api/organizations`,
    GET_ORGANIZATION_PROFILES: `${API_URL}/api/organizations`,
    GET_ORGANIZATION_PROFILE_WALLETS: `${API_URL}/api/organizations/organization-profiles`,
    POST_WALLET_ASSETS_SUMMARY_PRODUCER: `${API_URL}/api/organizations/summary/wallet`,
    POST_WALLET_ASSETS_SUMMARY_TOTAL: `${API_URL}/api/organizations/summary/wallet`,
    POST_WALLET_ASSETS: `${API_URL}/api/organizations/grid/wallet`,
    GET_WALLET_TRANSACTION_HISTORY: `${API_URL}/api/organizations/organization-profile-wallets`,
    GET_EAC_ASSETS_SUMMARY: `${API_URL}/api/organizations/assets/summary`,
  },
  TRANSFER: {
    TRANSFER_TOKENS: `${API_URL}/api/transfer`,
    GET_NETWORK_MEMBERS: `${API_URL}/api/transfer/network`,
  },
  PAYMENT_METHODS: {
    GET_PAYMENT_METHODS: `${API_URL}/api/payment-methods`,
    ADD_PAYMENT_METHOD: `${API_URL}/api/payment-methods`,
    DELETE_PAYMENT_METHOD: `${API_URL}/api/payment-methods`,
    SET_DEFAULT_PAYMENT_METHOD: `${API_URL}/api/payment-methods`,
  },
  PAYMENTS: {
    CREATE_PAYMENT_INTENT: `${API_URL}/api/payments/create-payment-intent`,
    CONFIRM_PAYMENT: `${API_URL}/api/payments/confirm-payment`,
    GET_PAYMENT_INTENT: `${API_URL}/api/payments`,
  },
  KYB: {
    VERIFY: `${API_URL}/api/kyb/verify`,
    CHECK_STATUS: `${API_URL}/api/kyb/status`,
    HISTORY: `${API_URL}/api/kyb/history`,
    STATS: `${API_URL}/api/kyb/stats`,
  },
  BASE_URL: API_URL,
  // Add other API endpoints here as needed
} as const;

export default API_ENDPOINTS;
