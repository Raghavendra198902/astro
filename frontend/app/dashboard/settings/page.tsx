'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, Globe, 
  Shield, Bell, Palette, Languages, LogOut, Trash2, 
  Save, Edit2, X, Check, AlertCircle, Sparkles,
  Key, Link as LinkIcon, ExternalLink, CreditCard
} from 'lucide-react';
import { API_URL } from '@/app/config';
import Link from 'next/link';
import { useTranslations } from '@/app/hooks/useTranslations';

export default function SettingsPage() {
  const { settings: t, common } = useTranslations();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    timezone: 'UTC',
    preferred_system: 'vedic',
    language: 'en'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }
      
      // Fetch user
      const userRes = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setFormData(prev => ({ ...prev, email: userData.email }));
      }

      // Fetch profile
      const profileRes = await fetch(`${API_URL}/api/v1/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          const p = profiles[0];
          setProfile(p);
          setFormData({
            name: p.name || '',
            email: user?.email || '',
            phone: p.phone || '',
            birth_date: p.birth_date || '',
            birth_time: p.birth_time || '',
            birth_place: p.birth_place || '',
            timezone: p.timezone || 'UTC',
            preferred_system: p.preferred_system || 'vedic',
            language: p.language || 'en'
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      // Update profile
      const response = await fetch(`${API_URL}/api/v1/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          birth_date: formData.birth_date,
          birth_time: formData.birth_time,
          birth_place: formData.birth_place,
          timezone: formData.timezone,
          preferred_system: formData.preferred_system,
          language: formData.language
        })
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to update profile');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sticky top-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                      <p className="text-gray-400 text-sm mt-1">Update your personal and birth details</p>
                    </div>
                    <button
                      onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all flex items-center space-x-2"
                    >
                      {editMode ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editMode}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 opacity-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editMode}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>

                    {/* Birth Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Birth Time
                      </label>
                      <input
                        type="time"
                        value={formData.birth_time}
                        onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>

                    {/* Birth Place */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Birth Place
                      </label>
                      <input
                        type="text"
                        value={formData.birth_place}
                        onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                        disabled={!editMode}
                        placeholder="Mumbai, Maharashtra, India"
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t.accountSettings || 'Account Settings'}</h2>
                    <p className="text-gray-400 text-sm mt-1">{t.accountSubtitle || 'Manage your account security and privacy'}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <h3 className="font-semibold text-white mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-purple-400" />
                        {t.accountSecurity || 'Account Security'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{t.accountSecurityText || 'Your account is secured with email authentication'}</p>
                      <Link
                        href="/auth/reset-password"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all"
                      >
                        <Key className="w-4 h-4" />
                        <span>Change Password</span>
                      </Link>
                    </div>

                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <h3 className="font-semibold text-white mb-2 flex items-center">
                        <Trash2 className="w-5 h-5 mr-2 text-red-400" />
                        {t.dangerZone || 'Danger Zone'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{t.deleteWarning || 'Once you delete your account, there is no going back'}</p>
                      <button className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all">
                        {t.deleteAccount || 'Delete Account'}
                      </button>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">{common.signOut || 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Preferences</h2>
                    <p className="text-gray-400 text-sm mt-1">Customize your experience</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Astrology System
                      </label>
                      <select
                        value={formData.preferred_system}
                        onChange={(e) => setFormData({ ...formData, preferred_system: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="vedic">Vedic (Indian)</option>
                        <option value="western">Western</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Languages className="w-4 h-4 inline mr-2" />
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi (हिंदी)</option>
                        <option value="mr">Marathi (मराठी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Preferences</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Billing & Subscription</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your subscription and payment methods</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Free Plan</h3>
                        <p className="text-gray-400 text-sm">Currently active</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Basic birth chart generation
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Daily predictions
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        250 AI credits per month
                      </div>
                    </div>
                    <Link
                      href="/pricing"
                      className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      <Sparkles className="w-5 h-5 inline mr-2" />
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
