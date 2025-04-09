"use client"

// Base domain for the API (updated to HTTPS endpoint)
const BASE_DOMAIN = 'https://api.anonchat.space';
// WebSocket base domain
const WS_BASE_DOMAIN = BASE_DOMAIN.replace(/^http/, 'ws'); // wss://api.anonchat.space

// API configuration
const API_CONFIG = {
  // Base URL for API requests (includes /api path)
  baseUrl: `${BASE_DOMAIN}/api`,

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    const cleanBase = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    const cleanWsBase = WS_BASE_DOMAIN.endsWith('/') ? WS_BASE_DOMAIN.slice(0, -1) : WS_BASE_DOMAIN;
    return `${cleanWsBase}/ws/${chatId}`;
  }
};

export default API_CONFIG;
