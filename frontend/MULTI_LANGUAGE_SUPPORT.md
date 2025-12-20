# Multi-Language Support (i18n) Documentation

## Overview

AstroAI now features a comprehensive internationalization (i18n) system supporting multiple languages. The system provides:

- **3 Languages**: English, Hindi (हिंदी), and Marathi (मराठी)
- **React Context API** for state management
- **localStorage** persistence for user preferences
- **Elegant Language Switcher** component
- **Comprehensive translations** for all UI elements
- **Type-safe** translation functions

## Supported Languages

| Language | Code | Flag | Native Name |
|----------|------|------|-------------|
| English  | `en` | 🇬🇧  | English     |
| Hindi    | `hi` | 🇮🇳  | हिंदी       |
| Marathi  | `mr` | 🇮🇳  | मराठी        |

## File Structure

```
frontend/
├── i18n/
│   ├── config.ts           # Language configuration
│   ├── index.ts            # Translation utilities
│   └── locales/
│       ├── en.json         # English translations
│       ├── hi.json         # Hindi translations
│       └── mr.json         # Marathi translations
├── app/
│   ├── contexts/
│   │   └── I18nContext.tsx # i18n Context Provider
│   ├── components/
│   │   └── LanguageSwitcher.tsx # Language switcher component
│   └── hooks/
│       └── useTranslations.ts   # Translation hook
```

## Quick Start

### 1. Using the Translation Hook

```tsx
'use client';

import { useTranslations } from '@/app/hooks/useTranslations';

export default function MyComponent() {
  const { t, common, nav, dashboard } = useTranslations();

  return (
    <div>
      {/* Direct translation */}
      <h1>{t('dashboard.title')}</h1>
      
      {/* Using namespace object */}
      <p>{common.loading}</p>
      <button>{common.save}</button>
      
      {/* Navigation items */}
      <nav>
        <Link href="/dashboard">{nav.dashboard}</Link>
        <Link href="/charts">{nav.charts}</Link>
      </nav>
    </div>
  );
}
```

### 2. Using the i18n Context Directly

```tsx
'use client';

import { useI18n } from '@/app/contexts/I18nContext';

export default function MyComponent() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div>
      <p>Current language: {locale}</p>
      <button onClick={() => setLocale('hi')}>
        {t('settings.language')}
      </button>
    </div>
  );
}
```

### 3. Adding the Language Switcher

```tsx
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      {/* With label */}
      <LanguageSwitcher showLabel={true} />
      
      {/* Icon only */}
      <LanguageSwitcher showLabel={false} />
      
      {/* Custom className */}
      <LanguageSwitcher className="ml-4" />
    </header>
  );
}
```

## Translation Namespaces

### Common
General UI elements used across the application:
- `loading`, `error`, `success`
- `save`, `cancel`, `delete`, `edit`
- `search`, `filter`, `clear`
- `back`, `next`, `previous`

### Navigation
Main navigation items:
- `dashboard`, `charts`, `predictions`
- `compatibility`, `numerology`
- `consultations`, `learning`
- `settings`, `help`, `logout`

### Dashboard
Dashboard-specific content:
- `title`, `welcome`, `quickStats`
- `recentActivity`, `upcomingEvents`
- `yourProfile`, `viewAll`

### Charts
Birth chart related translations:
- `title`, `subtitle`, `createNew`
- `planetPositions`, `housePositions`
- `aspects`, `yogas`, `dashas`

### Predictions
AI predictions interface:
- `title`, `generateBtn`, `loading`
- `accuracy`, `confidence`, `mlAnalysis`
- `timePeriod`, `aggressiveMode`

### Compatibility
Relationship compatibility analysis:
- `title`, `analyze`, `overallScore`
- `mentalCompatibility`, `physicalCompatibility`
- `emotionalCompatibility`

### Numerology
Numerology calculations:
- `title`, `calculate`, `lifePathNumber`
- `destinyNumber`, `soulNumber`
- `personalityNumber`

### Consultations
Expert consultation bookings:
- `title`, `bookNow`, `selectExpert`
- `selectDate`, `selectTime`, `duration`
- `myBookings`, `upcoming`, `past`

### Learning
Learning center content:
- `title`, `courses`, `articles`, `videos`
- `beginner`, `intermediate`, `advanced`

### Settings
User settings and preferences:
- `title`, `profile`, `account`
- `notifications`, `privacy`, `language`
- `updateProfile`, `changePassword`

### Errors
Error messages:
- `somethingWrong`, `tryAgain`
- `networkError`, `unauthorized`
- `notFound`, `serverError`

## Advanced Usage

### Format Dates by Locale

```tsx
import { formatDate } from '@/i18n';
import { useI18n } from '@/app/contexts/I18nContext';

export default function DateDisplay() {
  const { locale } = useI18n();
  const date = new Date();

  return (
    <div>
      {formatDate(locale, date, { 
        dateStyle: 'long',
        timeStyle: 'short'
      })}
    </div>
  );
}
```

### Format Numbers by Locale

```tsx
import { formatNumber } from '@/i18n';
import { useI18n } from '@/app/contexts/I18nContext';

export default function PriceDisplay({ amount }: { amount: number }) {
  const { locale } = useI18n();

  return (
    <div>
      {formatNumber(locale, amount, {
        style: 'currency',
        currency: 'INR'
      })}
    </div>
  );
}
```

### Get Full Namespace

```tsx
import { useI18n } from '@/app/contexts/I18nContext';

export default function FullNamespaceExample() {
  const { getNamespace } = useI18n();
  const predictions = getNamespace('predictions');

  return (
    <div>
      <h1>{predictions.title}</h1>
      <p>{predictions.subtitle}</p>
      <button>{predictions.generateBtn}</button>
    </div>
  );
}
```

### Listen to Language Changes

```tsx
'use client';

import { useEffect } from 'react';
import { useI18n } from '@/app/contexts/I18nContext';

export default function LanguageObserver() {
  const { locale } = useI18n();

  useEffect(() => {
    console.log('Language changed to:', locale);
    // Perform any action when language changes
    // e.g., reload data, update document title, etc.
  }, [locale]);

  return <div>Current language: {locale}</div>;
}
```

## Adding New Translations

### 1. Update Translation Files

Edit the JSON files in `i18n/locales/`:

**en.json:**
```json
{
  "myNewFeature": {
    "title": "My New Feature",
    "description": "This is a new feature"
  }
}
```

**hi.json:**
```json
{
  "myNewFeature": {
    "title": "मेरी नई सुविधा",
    "description": "यह एक नई सुविधा है"
  }
}
```

**mr.json:**
```json
{
  "myNewFeature": {
    "title": "माझे नवीन वैशिष्ट्य",
    "description": "हे एक नवीन वैशिष्ट्य आहे"
  }
}
```

### 2. Use in Components

```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function NewFeature() {
  const { t } = useTranslations();

  return (
    <div>
      <h1>{t('myNewFeature.title')}</h1>
      <p>{t('myNewFeature.description')}</p>
    </div>
  );
}
```

## Best Practices

### 1. Always Use Translation Keys
❌ **Don't:**
```tsx
<button>Save Changes</button>
```

✅ **Do:**
```tsx
<button>{common.save}</button>
```

### 2. Provide Fallbacks
```tsx
// Fallback to key if translation missing
{t('unknown.key', 'Fallback Text')}
```

### 3. Keep Keys Organized
- Use dot notation: `dashboard.title`
- Group by feature: `predictions.generateBtn`
- Use consistent naming: `loading`, not `isLoading`

### 4. Handle Plurals Gracefully
```tsx
// Instead of hardcoding plurals in English
const message = count === 1 
  ? t('chart.singular')
  : t('chart.plural');
```

### 5. Test All Languages
- Switch between languages to verify translations
- Check text overflow/wrapping
- Verify RTL layout (if adding Arabic, Urdu, etc.)

## Language Switcher Features

### Visual Feedback
- ✅ Current language highlighted
- ✅ Check mark indicator
- ✅ Flag emojis for visual identification
- ✅ Smooth animations

### User Experience
- Click outside to close
- Keyboard accessible
- Persistent selection (localStorage)
- Instant language switching
- Success notification on change

### Customization
```tsx
<LanguageSwitcher 
  className="ml-4"        // Custom positioning
  showLabel={true}        // Show language name
/>
```

## Integration Points

The i18n system is integrated at:

1. **Root Layout** (`app/layout.tsx`)
   - I18nProvider wraps entire app

2. **Dashboard Layout** (`app/dashboard/layout.tsx`)
   - LanguageSwitcher in header
   - Available alongside theme switcher

3. **All Components**
   - Use `useTranslations()` hook
   - Access translations via context

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- **Lazy Loading**: Translations loaded only when needed
- **Caching**: localStorage caches user preference
- **Bundle Size**: ~15KB per language file
- **No External Dependencies**: Pure React implementation

## Troubleshooting

### Translation Not Showing

1. Check if key exists in JSON file
2. Verify namespace is correct
3. Ensure component is wrapped in I18nProvider
4. Check browser console for errors

### Language Not Persisting

1. Check localStorage is enabled
2. Verify browser allows cookies
3. Clear localStorage and try again

### Component Not Re-rendering

1. Ensure using `useI18n()` hook
2. Check if component is inside I18nProvider
3. Verify locale state is updating

## Future Enhancements

- [ ] Add more languages (Sanskrit, Tamil, Telugu, Bengali)
- [ ] RTL support for Arabic/Urdu
- [ ] Translation management UI
- [ ] Automatic translation detection
- [ ] Plural form handling
- [ ] Number/date format customization
- [ ] Translation validation tools
- [ ] Missing translation reporter

## Contributing

To add a new language:

1. Create new JSON file in `i18n/locales/`
2. Add language code to `i18n/config.ts`
3. Add language name and flag
4. Translate all keys from `en.json`
5. Test thoroughly
6. Submit pull request

## Support

For issues or questions:
- Create GitHub issue
- Contact development team
- Check documentation updates

---

**Version**: 1.0.0  
**Last Updated**: December 20, 2024  
**Maintained By**: AstroAI Development Team
