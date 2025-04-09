"use client"

// Use the production API endpoint
const BASE_URL = 'https://api.anonchat.space/api';
// Derive WebSocket base URL by replacing the protocol of the API base URL
const WS_BASE_URL = BASE_URL.replace(/^http/, 'ws'); // Will become wss://api.anonchat.space/api

// API configuration
const API_CONFIG = {
  // Base URL for API requests
  baseUrl: BASE_URL,

  // Get the full API URL for a specific endpoint
  getApiUrl: (endpoint: string) => {
    // Ensure no double slashes
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`; // Constructs https://api.anonchat.space/api/...
  },

  // Get the WebSocket URL for a specific chat ID
  getWebSocketUrl: (chatId: string) => {
    // Ensure no double slashes in the base WS URL
    const cleanWsBase = WS_BASE_URL.endsWith('/') ? WS_BASE_URL.slice(0, -1) : WS_BASE_URL;
    // Append the correct path as defined in the backend
    return `${cleanWsBase}/ws/${chatId}`; // Constructs wss://api.anonchat.space/api/ws/:chat_id (Correct)
  }
};

export default API_CONFIG;
