'use client';

import { useTranslations } from '@/app/hooks/useTranslations';
import { Globe, CheckCircle, Code, FileText } from 'lucide-react';

/**
 * Demo component showing i18n usage examples
 * This can be imported into any page to demonstrate translation features
 */
export default function I18nDemo() {
  const { locale, t, common, nav, dashboard, predictions } = useTranslations();

  const examples = [
    {
      title: 'Common Translations',
      code: 'const { common } = useTranslations();\n<button>{common.save}</button>',
      output: common.save,
    },
    {
      title: 'Navigation Translations',
      code: 'const { nav } = useTranslations();\n<Link>{nav.dashboard}</Link>',
      output: nav.dashboard,
    },
    {
      title: 'Direct Translation',
      code: "const { t } = useTranslations();\n{t('dashboard.welcome')}",
      output: t('dashboard.welcome'),
    },
    {
      title: 'With Fallback',
      code: "t('unknown.key', 'Fallback Text')",
      output: t('unknown.key', 'Fallback Text'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Multi-Language Support Demo
          </h1>
          <p className="text-xl text-slate-300">
            Current Language: <span className="text-purple-400 font-semibold">{locale.toUpperCase()}</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              3 Languages Supported
            </h3>
            <p className="text-slate-400">
              English, Hindi (हिंदी), and Marathi (मराठी)
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <FileText className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Comprehensive Translations
            </h3>
            <p className="text-slate-400">
              All UI elements, messages, and content translated
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <Code className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Easy to Use
            </h3>
            <p className="text-slate-400">
              Simple hooks and functions for developers
            </p>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-400" />
            Usage Examples
          </h2>
          
          <div className="space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  {example.title}
                </h3>
                
                {/* Code */}
                <div className="bg-slate-950 rounded-lg p-4 mb-3 font-mono text-sm text-slate-300 overflow-x-auto">
                  <pre>{example.code}</pre>
                </div>
                
                {/* Output */}
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Output:</span>
                  <span className="text-white font-medium bg-purple-500/20 px-3 py-1 rounded">
                    {example.output}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Namespace Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Available Namespaces
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-purple-300 font-semibold mb-2">Common</h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">loading: <span className="text-white">{common.loading}</span></p>
                <p className="text-slate-400">save: <span className="text-white">{common.save}</span></p>
                <p className="text-slate-400">cancel: <span className="text-white">{common.cancel}</span></p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-purple-300 font-semibold mb-2">Navigation</h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">dashboard: <span className="text-white">{nav.dashboard}</span></p>
                <p className="text-slate-400">charts: <span className="text-white">{nav.charts}</span></p>
                <p className="text-slate-400">predictions: <span className="text-white">{nav.predictions}</span></p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-purple-300 font-semibold mb-2">Dashboard</h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">title: <span className="text-white">{dashboard.title}</span></p>
                <p className="text-slate-400">welcome: <span className="text-white">{dashboard.welcome}</span></p>
                <p className="text-slate-400">quickStats: <span className="text-white">{dashboard.quickStats}</span></p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-purple-300 font-semibold mb-2">Predictions</h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">title: <span className="text-white">{predictions.title}</span></p>
                <p className="text-slate-400">generateBtn: <span className="text-white">{predictions.generateBtn}</span></p>
                <p className="text-slate-400">accuracy: <span className="text-white">{predictions.accuracy}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p>Switch languages using the language switcher in the dashboard header</p>
          <p className="text-sm mt-2">See <code className="bg-slate-800 px-2 py-1 rounded">MULTI_LANGUAGE_SUPPORT.md</code> for full documentation</p>
        </div>
      </div>
    </div>
  );
}
