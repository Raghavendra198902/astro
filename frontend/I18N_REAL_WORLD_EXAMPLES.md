# Real-World Integration Examples

This document shows practical examples of integrating i18n into existing components.

## Example 1: Simple Button Component

### Before (Hardcoded)
```tsx
export default function SaveButton() {
  return (
    <button className="btn-primary">
      Save Changes
    </button>
  );
}
```

### After (Translated)
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function SaveButton() {
  const { common } = useTranslations();
  
  return (
    <button className="btn-primary">
      {common.save}
    </button>
  );
}
```

**Result:**
- English: "Save"
- Hindi: "सहेजें"
- Marathi: "जतन करा"

---

## Example 2: Navigation Menu

### Before
```tsx
const menuItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Charts', href: '/charts' },
  { label: 'Predictions', href: '/predictions' },
];

export default function Nav() {
  return (
    <nav>
      {menuItems.map(item => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function Nav() {
  const { nav } = useTranslations();
  
  const menuItems = [
    { label: nav.dashboard, href: '/dashboard' },
    { label: nav.charts, href: '/charts' },
    { label: nav.predictions, href: '/predictions' },
  ];
  
  return (
    <nav>
      {menuItems.map(item => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Example 3: Form with Validation

### Before
```tsx
export default function LoginForm() {
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      {error && <div className="error">{error}</div>}
      <button>Login</button>
    </form>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function LoginForm() {
  const { t, common, errors } = useTranslations();
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('profile.email') + ' ' + errors.validationError);
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      setError(errors.tryAgain);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input placeholder={t('profile.email')} />
      <input placeholder={t('settings.changePassword')} type="password" />
      {error && <div className="error">{error}</div>}
      <button>{common.submit}</button>
    </form>
  );
}
```

---

## Example 4: Dashboard Statistics

### Before
```tsx
export default function Stats({ data }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Charts</h3>
        <p>{data.charts}</p>
      </div>
      <div className="stat-card">
        <h3>Predictions Made</h3>
        <p>{data.predictions}</p>
      </div>
      <div className="stat-card">
        <h3>Consultations</h3>
        <p>{data.consultations}</p>
      </div>
    </div>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function Stats({ data }) {
  const { nav } = useTranslations();
  
  const stats = [
    { label: nav.charts, value: data.charts },
    { label: nav.predictions, value: data.predictions },
    { label: nav.consultations, value: data.consultations },
  ];
  
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card">
          <h3>{stat.label}</h3>
          <p>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 5: Date Formatting

### Before
```tsx
export default function EventCard({ event }) {
  const date = new Date(event.date);
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{formatted}</p>
    </div>
  );
}
```

### After
```tsx
import { useI18n } from '@/app/contexts/I18nContext';
import { formatDate } from '@/i18n';

export default function EventCard({ event }) {
  const { locale } = useI18n();
  const formatted = formatDate(locale, event.date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{formatted}</p>
    </div>
  );
}
```

**Result:**
- English: "December 25, 2024"
- Hindi: "25 दिसंबर 2024"
- Marathi: "25 डिसेंबर 2024"

---

## Example 6: Currency Formatting

### Before
```tsx
export default function PriceTag({ amount }) {
  return (
    <span className="price">
      ₹{amount.toFixed(2)}
    </span>
  );
}
```

### After
```tsx
import { useI18n } from '@/app/contexts/I18nContext';
import { formatNumber } from '@/i18n';

export default function PriceTag({ amount }) {
  const { locale } = useI18n();
  const formatted = formatNumber(locale, amount, {
    style: 'currency',
    currency: 'INR'
  });
  
  return (
    <span className="price">
      {formatted}
    </span>
  );
}
```

**Result:**
- English: "₹1,234.56"
- Hindi: "₹१,२३४.५६"
- Marathi: "₹१,२३४.५६"

---

## Example 7: Error Messages

### Before
```tsx
export default function DataFetcher() {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .catch(err => setError('Failed to load data'));
  }, []);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return <div>Content</div>;
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function DataFetcher() {
  const { errors } = useTranslations();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .catch(err => setError(errors.networkError));
  }, []);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return <div>Content</div>;
}
```

---

## Example 8: Modal Dialog

### Before
```tsx
export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this item?</p>
      <div className="actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  const { common, t } = useTranslations();
  
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <h2>{t('common.confirm')}</h2>
      <p>{t('activityTimeline.confirmClear')}</p>
      <div className="actions">
        <button onClick={onClose}>{common.cancel}</button>
        <button onClick={onConfirm}>{common.delete}</button>
      </div>
    </div>
  );
}
```

---

## Example 9: Loading State

### Before
```tsx
export default function DataList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  if (loading) {
    return (
      <div className="loading">
        <Loader2 className="animate-spin" />
        <p>Loading data...</p>
      </div>
    );
  }
  
  return <div>{/* data */}</div>;
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function DataList() {
  const { common } = useTranslations();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  if (loading) {
    return (
      <div className="loading">
        <Loader2 className="animate-spin" />
        <p>{common.loading}</p>
      </div>
    );
  }
  
  return <div>{/* data */}</div>;
}
```

---

## Example 10: Search Bar

### Before
```tsx
export default function SearchBar() {
  return (
    <div className="search-bar">
      <Search className="icon" />
      <input 
        type="text" 
        placeholder="Search..." 
      />
    </div>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function SearchBar() {
  const { common } = useTranslations();
  
  return (
    <div className="search-bar">
      <Search className="icon" />
      <input 
        type="text" 
        placeholder={common.search} 
      />
    </div>
  );
}
```

---

## Example 11: Predictions Page Header

### Real Component from AstroAI

### Before
```tsx
<div className="text-center mb-8">
  <h1 className="text-4xl font-bold mb-3">
    AI-Powered Life Predictions
  </h1>
  <p className="text-xl text-slate-400">
    Enhanced ML predictions with 100% accuracy focus
  </p>
</div>
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

function PredictionsHeader() {
  const { predictions } = useTranslations();
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-3">
        {predictions.title}
      </h1>
      <p className="text-xl text-slate-400">
        {predictions.subtitle}
      </p>
    </div>
  );
}
```

---

## Example 12: Settings Page

### Before
```tsx
export default function SettingsPage() {
  return (
    <div className="settings">
      <h1>Settings</h1>
      
      <section>
        <h2>Profile</h2>
        <label>Name</label>
        <input type="text" />
        
        <label>Email</label>
        <input type="email" />
      </section>
      
      <section>
        <h2>Preferences</h2>
        <label>Language</label>
        <select>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        
        <label>Theme</label>
        <select>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>
      
      <button>Save Changes</button>
    </div>
  );
}
```

### After
```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function SettingsPage() {
  const { settings, profile, common } = useTranslations();
  
  return (
    <div className="settings">
      <h1>{settings.title}</h1>
      
      <section>
        <h2>{settings.profile}</h2>
        <label>{profile.name}</label>
        <input type="text" />
        
        <label>{profile.email}</label>
        <input type="email" />
      </section>
      
      <section>
        <h2>{settings.title}</h2>
        <label>{settings.language}</label>
        <select>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
        
        <label>{settings.theme}</label>
        <select>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>
      
      <button>{settings.saveChanges}</button>
    </div>
  );
}
```

---

## Example 13: Dynamic Content

### Handling Variables in Translations

```tsx
// Instead of concatenating strings:
const message = `You have ${count} new messages`;

// Use template literals with translations:
const { t } = useTranslations();
const message = t('notifications.newMessages').replace('{count}', count);

// Or build the message:
const message = `${count} ${t('notifications.messages')}`;
```

---

## Example 14: Conditional Content

```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function WelcomeMessage({ userName }) {
  const { t, dashboard } = useTranslations();
  
  return (
    <div>
      {userName ? (
        <h1>{dashboard.welcome}, {userName}!</h1>
      ) : (
        <h1>{dashboard.welcome}</h1>
      )}
    </div>
  );
}
```

---

## Example 15: List with Translations

```tsx
import { useTranslations } from '@/app/hooks/useTranslations';

export default function FeatureList() {
  const { landing } = useTranslations();
  
  const features = [
    { 
      title: landing.features.birthCharts,
      desc: landing.features.birthChartsDesc
    },
    { 
      title: landing.features.predictions,
      desc: landing.features.predictionsDesc
    },
    { 
      title: landing.features.compatibility,
      desc: landing.features.compatibilityDesc
    },
  ];
  
  return (
    <div className="features">
      {features.map((feature, i) => (
        <div key={i} className="feature-card">
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices Summary

1. ✅ **Extract translations at component level**
2. ✅ **Use namespace objects for better performance**
3. ✅ **Provide fallbacks for missing keys**
4. ✅ **Format dates and numbers by locale**
5. ✅ **Keep translation keys organized**
6. ✅ **Test all languages during development**
7. ✅ **Use consistent naming conventions**
8. ✅ **Document custom translation patterns**

---

## Migration Checklist

- [ ] Import `useTranslations` hook
- [ ] Replace hardcoded strings with translation keys
- [ ] Test in all supported languages
- [ ] Check for text overflow/wrapping
- [ ] Verify date/number formatting
- [ ] Update tests with i18n
- [ ] Add missing keys to JSON files
- [ ] Document component translations

---

**Real-World Examples Version**: 1.0.0  
**Last Updated**: December 20, 2024
