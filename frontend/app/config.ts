// API Configuration
// In development: Use localhost:8000 for backend
// In production: Use empty string for same-origin requests or set NEXT_PUBLIC_API_URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : '');

// WebSocket URL
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 
  (typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? 'ws://localhost:8000'
    : 'ws://192.168.0.102:8000');

// Log configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[CONFIG] API_URL:', API_URL);
  console.log('[CONFIG] WS_URL:', WS_URL);
  console.log('[CONFIG] NODE_ENV:', process.env.NODE_ENV);
}
