"use client"

// Determine the API base URL based on the environment
const getBaseUrl = () => {
  // For development environment, use the environment variable or fallback to localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }
  
  // For production with Tor, use the onion address
  // This will be used when accessing through Tor Browser
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onion')) {
    return `http://${window.location.hostname}/api`;
  }
  
  // For regular web access in production
  // Use the provided IP address as the fallback
  return process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'http://161.97.172.209:3000/api';
};

// API configuration with dynamic URL determination
const API_CONFIG = {
  // Get the base URL for API requests
  get baseUrl() {
    return getBaseUrl();
  },

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    const base = getBaseUrl();
    // Ensure no double slashes
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    const base = getBaseUrl();
    // Replace http:// with ws:// or https:// with wss://
    const wsBase = base.replace(/^http/, 'ws');
    // Ensure no double slashes
    const cleanWsBase = wsBase.endsWith('/') ? wsBase.slice(0, -1) : wsBase;
    return `${cleanWsBase}/ws/${chatId}`;
  }
};

export default API_CONFIG;
