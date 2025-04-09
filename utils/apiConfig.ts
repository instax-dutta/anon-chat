"use client"

// Base domain for the API
const BASE_DOMAIN = 'https://api.anonchat.space';
// WebSocket base domain
const WS_BASE_DOMAIN = BASE_DOMAIN.replace(/^http/, 'ws'); // Will become wss://api.anonchat.space

// API configuration
const API_CONFIG = {
  // Base URL for API requests (includes /api path)
  baseUrl: `${BASE_DOMAIN}/api`,

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    // Base URL already includes /api
    const cleanBase = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`; // Constructs https://api.anonchat.space/api/...
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    // Ensure no double slashes in the base WS domain
    const cleanWsBase = WS_BASE_DOMAIN.endsWith('/') ? WS_BASE_DOMAIN.slice(0, -1) : WS_BASE_DOMAIN;
    // Append the /api/ws/:chat_id path
    return `${cleanWsBase}/api/ws/${chatId}`; // Constructs wss://api.anonchat.space/api/ws/:chat_id
  }
};

export default API_CONFIG;
