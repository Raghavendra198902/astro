# Fix for Turbopack Runtime Error

## Error
```
Cannot find module '../chunks/ssr/[turbopack]_runtime.js'
```

## Root Cause
1. Corrupted Turbopack cache in `.next` directory
2. Using `require()` for JSON imports (not compatible with Next.js 16 + Turbopack)

## Solution Applied

### 1. Fixed i18n Code ✅
Changed from `require()` to ES6 imports in `/frontend/i18n/index.ts`:

**Before:**
```typescript
const translations: Record<Locale, any> = {
  en: require('./locales/en.json'),
  hi: require('./locales/hi.json'),
  mr: require('./locales/mr.json')
};
```

**After:**
```typescript
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import mrTranslations from './locales/mr.json';

const translations: Record<Locale, any> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations
};
```

### 2. Restart Development Server

**If running in Docker:**
```bash
docker-compose down
docker-compose up -d
```

**If running locally:**
```bash
cd /home/rrd/astro/frontend
rm -rf .next
npm run dev
```

**If files are locked (permission denied):**
```bash
# Stop the running process first
sudo pkill -9 -f "next dev"

# Then clean and restart
cd /home/rrd/astro/frontend
sudo rm -rf .next
npm run dev
```

## Verification

After restarting, you should see:
```
✓ Starting...
✓ Ready in X.Xs
```

The multi-language system will now work correctly with:
- Language switcher in dashboard header
- 3 languages supported (English, Hindi, Marathi)
- No runtime errors

## Status
- ✅ Code fixed
- ⏳ Awaiting server restart
