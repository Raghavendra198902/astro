'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, Globe, 
  Shield, Bell, Palette, Languages, LogOut, Trash2, 
  Save, Edit2, X, Check, AlertCircle, Sparkles,
  Key, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import { API_URL } from '@/app/config';

export default function SettingsPage() {
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
        // Handle Pydantic validation errors
        let errorMessage = 'Failed to update profile';
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          errorMessage = data.detail[0]?.msg || 'Validation error';
        }
        setError(errorMessage);
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
    { id: 'oauth', name: 'Connected Accounts', icon: LinkIcon },
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
            <p className="text-sm text-green-300">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-2">
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Birth Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Time of Birth
                      </label>
                      <input
                        type="time"
                        value={formData.birth_time}
                        onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Birth Place */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Place of Birth
                      </label>
                      <input
                        type="text"
                        value={formData.birth_place}
                        onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                        disabled={!editMode}
                        placeholder="Mumbai, Maharashtra, India"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
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
                    <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your account security and data</p>
                  </div>

                  <div className="space-y-4">
                    {/* Account Info */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Mail className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Email</p>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Account Type</p>
                            <p className="text-gray-400 text-sm capitalize">{user?.role || 'Seeker'}</p>
                          </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Key className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">Password</p>
                            <p className="text-gray-400 text-sm">Change your password</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm">
                          Update
                        </button>
                      </div>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Sign Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Preferences</h2>
                    <p className="text-gray-400 text-sm mt-1">Customize your AstroAI experience</p>
                  </div>

                  <div className="space-y-4">
                    {/* Astrology System */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-white font-semibold">Astrology System</p>
                            <p className="text-gray-400 text-sm">Choose your preferred system</p>
                          </div>
                        </div>
                      </div>
                      <select
                        value={formData.preferred_system}
                        onChange={(e) => setFormData({ ...formData, preferred_system: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="vedic">Vedic (Indian)</option>
                        <option value="western">Western</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Languages className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-white font-semibold">Language</p>
                            <p className="text-gray-400 text-sm">Predictions and reports language</p>
                          </div>
                        </div>
                      </div>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="mr">Marathi (मराठी)</option>
                        <option value="hi">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-semibold">Timezone</p>
                            <p className="text-gray-400 text-sm">Your local timezone</p>
                          </div>
                        </div>
                      </div>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-4">
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

              {/* OAuth Tab */}
              {activeTab === 'oauth' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Connected Accounts</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your OAuth connections</p>
                  </div>

                  <div className="space-y-4">
                    {/* Google */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-xl">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Google</p>
                            <p className="text-gray-400 text-sm">
                              {user?.email?.includes('gmail.com') ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {user?.email?.includes('gmail.com') ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                            Connected
                          </span>
                        ) : (
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm">
                            Connect
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Microsoft */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-xl">
                            <svg className="w-6 h-6" viewBox="0 0 23 23">
                              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                              <path fill="#f35325" d="M1 1h10v10H1z"/>
                              <path fill="#81bc06" d="M12 1h10v10H12z"/>
                              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                              <path fill="#ffba08" d="M12 12h10v10H12z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Microsoft</p>
                            <p className="text-gray-400 text-sm">
                              {user?.email?.includes('outlook.com') || user?.email?.includes('hotmail.com') ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {user?.email?.includes('outlook.com') || user?.email?.includes('hotmail.com') ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                            Connected
                          </span>
                        ) : (
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all text-sm">
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-300">
                      <p className="font-semibold mb-1">About OAuth Connections</p>
                      <p>You logged in with {user?.email?.includes('gmail.com') ? 'Google' : user?.email?.includes('outlook.com') || user?.email?.includes('hotmail.com') ? 'Microsoft' : 'email'}. You can connect additional accounts for easier sign-in options.</p>
                    </div>
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
