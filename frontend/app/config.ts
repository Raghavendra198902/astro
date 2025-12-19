// API Configuration - Use empty string to make requests relative to current origin
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// WebSocket URL
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://192.168.0.102:8000';

// Log configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[CONFIG] API_URL:', API_URL);
  console.log('[CONFIG] WS_URL:', WS_URL);
}
