// Force HTTPS for production - Cache buster v3
export const API_URL = 'https://192.168.0.102';

// Log on module load
if (typeof window !== 'undefined') {
  console.log('[CONFIG v3] API_URL (HTTPS ENFORCED):', API_URL);
}
