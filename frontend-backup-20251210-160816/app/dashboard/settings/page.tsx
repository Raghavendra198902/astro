'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { Settings, User, Bell, Shield, CreditCard, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/contexts/theme.context';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const t = dashboardTranslations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400" strokeWidth={2} />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-violet-600 dark:text-violet-400" strokeWidth={2} />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.full_name || ''}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <div className="px-4 py-3 bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-xl">
              <span className="text-violet-900 dark:text-violet-400 font-semibold capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
            Save Changes
          </button>
          <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" strokeWidth={2} />
          Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Email notifications', description: 'Receive updates via email' },
            { label: 'Consultation reminders', description: 'Get notified before sessions' },
            { label: 'Transit alerts', description: 'Important planetary movements' },
            { label: 'Newsletter', description: 'Monthly astrology insights' },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div>
                <div className="font-semibold text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" strokeWidth={2} />
          Security
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-900">Change Password</div>
            <div className="text-sm text-gray-600">Update your password regularly</div>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-900">Two-Factor Authentication</div>
            <div className="text-sm text-gray-600">Add an extra layer of security</div>
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border-2 border-violet-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-violet-600" strokeWidth={2} />
          Subscription
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 capitalize">{user?.subscription_tier} Plan</div>
            <div className="text-gray-600 mt-1">150 AI credits remaining</div>
          </div>
          <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" strokeWidth={2} />
          Preferences
        </h2>
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-violet-500 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <>
                    <Sun className="w-5 h-5 text-amber-500" strokeWidth={2} />
                    <span className="font-medium text-gray-900">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                    <span className="font-medium text-gray-900">Dark Mode</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 group-hover:text-violet-600 transition-colors">
                Click to switch
              </div>
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <select className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all">
              <option>English</option>
              <option>Hindi</option>
              <option>Sanskrit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time Zone</label>
            <select className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all">
              <option>Asia/Kolkata (IST)</option>
              <option>America/New_York (EST)</option>
              <option>Europe/London (GMT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
