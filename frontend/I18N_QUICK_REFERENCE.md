# i18n Quick Reference Card

## 🚀 Quick Start

```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

function MyComponent() {
  const { t, common, nav } = useTranslations();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button>{common.save}</button>
    </div>
  );
}
```

## 📚 Common Translations

| Key | English | Hindi | Marathi |
|-----|---------|-------|---------|
| `common.loading` | Loading... | लोड हो रहा है... | लोड होत आहे... |
| `common.save` | Save | सहेजें | जतन करा |
| `common.cancel` | Cancel | रद्द करें | रद्द करा |
| `common.delete` | Delete | हटाएं | हटवा |
| `common.edit` | Edit | संपादित करें | संपादित करा |
| `common.search` | Search | खोजें | शोधा |
| `common.back` | Back | वापस | मागे |
| `common.next` | Next | अगला | पुढे |
| `common.yes` | Yes | हां | होय |
| `common.no` | No | नहीं | नाही |

## 🎯 Usage Patterns

### 1. Direct Translation
```tsx
{t('predictions.title')}
```

### 2. With Fallback
```tsx
{t('unknown.key', 'Default Text')}
```

### 3. Namespace Object
```tsx
const { common } = useTranslations();
<button>{common.save}</button>
```

### 4. Current Locale
```tsx
const { locale } = useTranslations();
console.log(locale); // "en" | "hi" | "mr"
```

### 5. Change Language
```tsx
const { setLocale } = useI18n();
<button onClick={() => setLocale('hi')}>हिंदी</button>
```

## 📦 Available Namespaces

```tsx
const {
  common,         // UI elements
  nav,           // Navigation
  dashboard,     // Dashboard
  charts,        // Birth charts
  predictions,   // Predictions
  compatibility, // Compatibility
  numerology,    // Numerology
  consultations, // Consultations
  learning,      // Learning
  settings,      // Settings
  profile,       // Profile
  notifications, // Notifications
  errors,        // Errors
} = useTranslations();
```

## 🎨 Components

### Language Switcher
```tsx
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

<LanguageSwitcher />                    // Default
<LanguageSwitcher showLabel={false} />  // Icon only
<LanguageSwitcher className="ml-4" />   // Custom class
```

## 🔧 Utility Functions

### Format Date
```tsx
import { formatDate } from '@/i18n';
import { useI18n } from '@/app/contexts/I18nContext';

const { locale } = useI18n();
formatDate(locale, new Date(), { dateStyle: 'long' })
```

### Format Number
```tsx
import { formatNumber } from '@/i18n';

formatNumber(locale, 1234.56, { 
  style: 'currency', 
  currency: 'INR' 
})
```

## 🎯 Translation Keys - Quick Lookup

### Navigation
```
nav.dashboard      - Dashboard / डैशबोर्ड / डॅशबोर्ड
nav.charts         - Birth Charts / जन्म कुंडली / जन्म कुंडली
nav.predictions    - Predictions / भविष्यवाणियां / भविष्यवाणी
nav.compatibility  - Compatibility / अनुकूलता / सुसंगतता
nav.settings       - Settings / सेटिंग्स / सेटिंग्ज
```

### Dashboard
```
dashboard.title          - Dashboard
dashboard.welcome        - Welcome back
dashboard.quickStats     - Quick Stats
dashboard.recentActivity - Recent Activity
dashboard.viewAll        - View All
```

### Charts
```
charts.title           - Birth Charts
charts.createNew       - Create New Chart
charts.planetPositions - Planet Positions
charts.housePositions  - House Positions
```

### Predictions
```
predictions.title       - AI-Powered Life Predictions
predictions.generateBtn - Generate AI Predictions
predictions.accuracy    - Accuracy
predictions.confidence  - Confidence
```

### Errors
```
errors.somethingWrong - Something went wrong
errors.tryAgain       - Please try again
errors.networkError   - Network error
errors.unauthorized   - Unauthorized
errors.notFound       - Page not found
```

## 🔍 Debugging

### Check Current Locale
```tsx
const { locale } = useI18n();
console.log('Current locale:', locale);
```

### Check Translation Value
```tsx
const { t } = useTranslations();
console.log(t('common.save')); // "Save" or "सहेजें" or "जतन करा"
```

### List All Keys in Namespace
```tsx
const { common } = useTranslations();
console.log(Object.keys(common));
```

## ⚡ Performance Tips

1. **Use Namespace Objects** (faster than t() calls)
   ```tsx
   // Good
   const { common } = useTranslations();
   <button>{common.save}</button>
   
   // Slower
   <button>{t('common.save')}</button>
   ```

2. **Extract at Component Level** (not in loops)
   ```tsx
   // Good
   const { common } = useTranslations();
   items.map(item => <div>{common.loading}</div>)
   
   // Bad
   items.map(item => {
     const { common } = useTranslations();
     return <div>{common.loading}</div>
   })
   ```

3. **Memoize Translated Content**
   ```tsx
   const translations = useMemo(() => ({
     title: t('page.title'),
     subtitle: t('page.subtitle')
   }), [locale]);
   ```

## 🎨 Styling Translated Text

### Handle Text Overflow
```tsx
<div className="truncate max-w-xs">
  {t('long.translation.key')}
</div>
```

### Different Fonts for Different Languages
```tsx
<span className={locale === 'hi' || locale === 'mr' ? 'font-devanagari' : 'font-sans'}>
  {t('text.key')}
</span>
```

## 🐛 Common Issues

### Translation Not Showing
```
✓ Check if key exists in JSON
✓ Verify component has useTranslations()
✓ Ensure I18nProvider wraps app
✓ Check browser console for errors
```

### Language Not Changing
```
✓ Check localStorage enabled
✓ Verify setLocale() called
✓ Clear cache and reload
✓ Check CustomEvent firing
```

## 📱 Testing

### Switch Languages Programmatically
```tsx
import { setCurrentLocale } from '@/i18n';

// In tests or dev tools
setCurrentLocale('hi');  // Hindi
setCurrentLocale('mr');  // Marathi
setCurrentLocale('en');  // English
```

### Test All Languages
```tsx
['en', 'hi', 'mr'].forEach(locale => {
  setCurrentLocale(locale);
  // Test your component
});
```

## 🔗 Related Files

```
Frontend Structure:
├─ i18n/
│  ├─ config.ts          - Language config
│  ├─ index.ts           - Utilities
│  └─ locales/
│     ├─ en.json         - English
│     ├─ hi.json         - Hindi
│     └─ mr.json         - Marathi
├─ app/
│  ├─ contexts/
│  │  └─ I18nContext.tsx - Provider
│  ├─ components/
│  │  └─ LanguageSwitcher.tsx
│  └─ hooks/
│     └─ useTranslations.ts
```

## 📖 Documentation

- `MULTI_LANGUAGE_SUPPORT.md` - Full documentation
- `MULTI_LANGUAGE_IMPLEMENTATION.md` - Implementation details
- `MULTI_LANGUAGE_VISUAL_GUIDE.md` - Visual guide

## 🆘 Support

- GitHub Issues
- Team Slack: #i18n-support
- Email: dev@astroai.com

---

**Quick Reference Version**: 1.0.0  
**Print this card** and keep it handy! 📌
