"use client"

// API configuration with hardcoded API URL
const API_CONFIG = {
  // Hardcoded base URL for the API
  baseUrl: "https://api.anonchat.space",

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    return `https://api.anonchat.space${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//api.anonchat.space/api/ws/${chatId}`;
  }
};

export default API_CONFIG;