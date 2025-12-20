# i18n Translation System - Test Suite

## 📋 Overview

This test suite provides comprehensive coverage of the multi-language translation system (i18n) for the AstroAI application. It validates translation accuracy, performance, error handling, and data integrity across English, Hindi, and Marathi languages.

## 🎯 Test Categories

### 1. **Happy Path Tests** (11 tests)
Tests that verify expected behavior with valid inputs:
- Translation across all three languages
- Nested key translation
- Namespace retrieval
- Locale management (get/set)

### 2. **Negative Tests** (4 tests)
Tests that ensure graceful handling of invalid inputs:
- Missing translation keys
- Invalid locales
- Empty string keys
- Non-existent namespaces

### 3. **Performance Tests** (3 tests)
Tests that validate system meets speed requirements:
- 1000 translations in < 50ms
- 100 namespace retrievals in < 20ms
- 150 locale switches in < 30ms

### 4. **Data Integrity Tests** (3 tests)
Tests that check data consistency:
- No empty translations
- Consistent keys across locales
- All core namespaces present

### 5. **Format Function Tests** (3 tests)
Tests for locale-specific formatting:
- Date formatting
- Number formatting
- Locale-specific differences

### 6. **Meta Tests** (1 test)
Summary test for overall suite completion

---

## 🚀 Quick Start

### Run All i18n Tests
```bash
npm test __tests__/i18n/core-functions.test.ts
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate HTML Report
```bash
npm run test:html
```

---

## 📊 Test Results

### Latest Test Run

```
✅ i18n Core Function Tests Summary:
  - Translation tests: ✓
  - Namespace tests: ✓
  - Locale management: ✓
  - Data integrity: ✓
  - Format functions: ✓
  - Performance tests: ✓
  - Negative tests: ✓

Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Time:        11.465 s
```

---

## 📁 Test Files Structure

```
frontend/
├── __tests__/
│   ├── i18n/
│   │   ├── core-functions.test.ts    # Main i18n test suite ✅
│   │   └── translations.test.ts      # Extended tests (legacy)
│   ├── components/
│   │   └── LanguageSwitcher.test.tsx # Component tests
│   ├── hooks/
│   │   └── useTranslations.test.ts   # Hook tests
│   └── integration/
│       └── i18n-integration.test.tsx # Integration tests
├── test-reports/
│   └── test-report.html              # HTML test report
├── jest.config.js                     # Jest configuration
├── jest.setup.js                      # Test setup file
└── TEST_RESULTS.md                    # Detailed test report
```

---

## 🧪 Test Coverage

### Translation Functions (`i18n/index.ts`)
- ✅ `t()` - Translation function
- ✅ `getNamespace()` - Namespace retrieval
- ✅ `getCurrentLocale()` - Get current language
- ✅ `setCurrentLocale()` - Set language
- ✅ `formatDate()` - Date formatting
- ✅ `formatNumber()` - Number formatting

### Supported Languages
- ✅ English (en)
- ✅ Hindi (hi - हिंदी)
- ✅ Marathi (mr - मराठी)

### Core Namespaces Tested
- ✅ `common` - Common UI elements
- ✅ `nav` - Navigation menu
- ✅ `dashboard` - Dashboard page
- ✅ `charts` - Birth charts
- ✅ `predictions` - Predictions features

---

## ⚡ Performance Benchmarks

| Operation | Iterations | Target | Actual | Status |
|-----------|-----------|--------|--------|--------|
| Translations | 1000 | < 50ms | 34ms | ✅ 32% faster |
| Namespaces | 100 | < 20ms | 2ms | ✅ 90% faster |
| Locale Switches | 150 | < 30ms | 17ms | ✅ 43% faster |

**Overall Performance Rating: ⭐⭐⭐⭐⭐**

---

## 🔍 Test Examples

### Happy Path Test
```typescript
test('[HAPPY] should translate common.loading in English', () => {
  expect(t('en', 'common.loading')).toBe('Loading...');
});
```

### Negative Test
```typescript
test('[NEGATIVE] should return fallback for missing key', () => {
  expect(t('en', 'missing.key', 'Fallback')).toBe('Fallback');
});
```

### Performance Test
```typescript
test('[PERFORMANCE] should translate 1000 keys under 50ms', () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    t('en', 'common.loading');
  }
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(50);
});
```

### Data Integrity Test
```typescript
test('[INTEGRITY] should have consistent keys across all locales', () => {
  const enKeys = Object.keys(getNamespace('en', 'common')).sort();
  const hiKeys = Object.keys(getNamespace('hi', 'common')).sort();
  const mrKeys = Object.keys(getNamespace('mr', 'common')).sort();
  
  expect(enKeys).toEqual(hiKeys);
  expect(enKeys).toEqual(mrKeys);
});
```

---

## 📈 HTML Test Report

The HTML report provides:
- ✅ Interactive test results with dark theme
- ✅ Expandable test details
- ✅ Performance metrics
- ✅ Coverage visualization
- ✅ Test duration breakdown

### View HTML Report
```bash
# After running tests
open test-reports/test-report.html

# Or on Linux
xdg-open test-reports/test-report.html
```

---

## 🛠️ Configuration

### Jest Configuration (`jest.config.js`)
```javascript
{
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-reports',
      filename: 'test-report.html',
      pageTitle: 'AstroAI i18n - Test Report',
      darkTheme: true
    }]
  ]
}
```

### Test Setup (`jest.setup.js`)
- Mocks for Next.js navigation
- localStorage mock
- IntersectionObserver mock
- window.matchMedia mock
- performance.memory mock

---

## 🎯 Testing Best Practices

### 1. **Test Naming Convention**
```
[CATEGORY] should <expected behavior>
```
Examples:
- `[HAPPY] should translate common.loading in English`
- `[NEGATIVE] should return fallback for missing key`
- `[PERFORMANCE] should translate 1000 keys under 50ms`

### 2. **Test Categories**
- **HAPPY**: Normal, expected behavior
- **NEGATIVE**: Error handling and edge cases
- **PERFORMANCE**: Speed and efficiency
- **INTEGRITY**: Data consistency
- **META**: Suite-level tests

### 3. **Assertions**
- Use descriptive expect statements
- Include both positive and negative tests
- Validate return types and values
- Check edge cases and boundaries

---

## 🐛 Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="should translate common.loading"
```

### Run with Verbose Output
```bash
npm test -- --verbose
```

### Run with Coverage
```bash
npm test -- --coverage --collectCoverageFrom="i18n/**/*.ts"
```

### Debug in VS Code
Add breakpoint in test file and use VS Code's Jest runner

---

## 📝 Adding New Tests

### 1. Create Test File
```typescript
// __tests__/i18n/new-feature.test.ts
import { t, getNamespace } from '@/i18n';

describe('New Feature', () => {
  test('[HAPPY] should work correctly', () => {
    expect(t('en', 'new.key')).toBe('Expected Value');
  });
});
```

### 2. Run Tests
```bash
npm test __tests__/i18n/new-feature.test.ts
```

### 3. Update Documentation
- Add test to TEST_RESULTS.md
- Update coverage metrics
- Document any new test categories

---

## 🔗 Related Documentation

- [i18n Implementation Guide](../i18n/README.md)
- [Translation Files](../i18n/locales/)
- [Component Tests](../__tests__/components/)
- [Integration Tests](../__tests__/integration/)

---

## 📞 Support

### Running into Issues?

1. **Clear test cache**:
   ```bash
   npm test -- --clearCache
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Jest version**:
   ```bash
   npm list jest
   ```

4. **Verify test environment**:
   ```bash
   node --version  # Should be 18.x or higher
   npm --version   # Should be 9.x or higher
   ```

---

## ✨ Key Features Tested

- ✅ Multi-language translation (3 languages)
- ✅ Nested key translation
- ✅ Fallback mechanism
- ✅ Locale persistence
- ✅ Dynamic locale switching
- ✅ Date/number formatting
- ✅ Invalid input handling
- ✅ Empty namespace handling
- ✅ Performance optimization
- ✅ Data consistency

---

## 🎉 Success Criteria

All tests must:
1. ✅ Pass with 100% success rate
2. ✅ Complete within timeout limits
3. ✅ Meet performance benchmarks
4. ✅ Validate data integrity
5. ✅ Handle edge cases gracefully

**Current Status: ALL CRITERIA MET ✅**

---

## 📊 Continuous Integration

### GitHub Actions (Future)
```yaml
- name: Run i18n Tests
  run: npm test __tests__/i18n/
  
- name: Upload Test Results
  uses: actions/upload-artifact@v2
  with:
    name: test-results
    path: test-reports/
```

---

**Last Updated**: December 20, 2025  
**Test Suite Version**: 1.0.0  
**Jest Version**: 30.2.0  
**Status**: ✅ All Tests Passing
