"use client"

// Use the working API endpoint
const BASE_URL = 'http://161.97.172.209:3000/api';
const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws');

// API configuration
const API_CONFIG = {
  // Base URL for API requests
  baseUrl: BASE_URL,

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    // Ensure no double slashes
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    // Ensure no double slashes
    const cleanWsBase = WS_BASE_URL.endsWith('/') ? WS_BASE_URL.slice(0, -1) : WS_BASE_URL;
    return `${cleanWsBase}/ws/${chatId}`;
  }
};

export default API_CONFIG;
