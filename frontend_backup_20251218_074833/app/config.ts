// HARDCODED - Force correct URL
const FORCED_API_URL = 'https://192.168.0.102';
export const API_URL = FORCED_API_URL;
console.log('[CONFIG FORCED] API_URL:', API_URL);
console.log('[CONFIG FORCED] This should NOT have port 8000!');
if (API_URL.includes('8000')) {
  console.error('ERROR: API_URL still contains port 8000! Clear your browser cache!');
}
