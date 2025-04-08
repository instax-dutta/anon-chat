"use client"

// API configuration with hardcoded API URL
const API_CONFIG = {
  // Updated base URL for the Tor hidden service API
  baseUrl: "http://thmvke5ga7fpm5m23w7hz72fjvnhd3zpeepzk4z7pd7pamjqjml3sead.onion/api",

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    return `http://thmvke5ga7fpm5m23w7hz72fjvnhd3zpeepzk4z7pd7pamjqjml3sead.onion/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    // Explicitly use ws:// for Tor hidden service
    return `ws://thmvke5ga7fpm5m23w7hz72fjvnhd3zpeepzk4z7pd7pamjqjml3sead.onion/api/ws/${chatId}`;
  }
};

export default API_CONFIG;
