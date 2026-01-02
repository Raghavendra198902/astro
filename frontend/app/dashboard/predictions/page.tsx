'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Calendar, Clock, Heart, Briefcase, 
  DollarSign, Activity, AlertCircle, CheckCircle, Info, 
  ChevronRight, Star, Moon, Sun, History, FastForward, 
  Blend, Brain, Target, Zap, Award, Globe, Languages,
  Share2, Download, FileText, MessageCircle, User, Plus 
} from 'lucide-react';
import { API_URL } from '@/app/config';
import PDFExporter from '@/app/components/PDFExporter';
import { sendNotification } from '@/app/components/NotificationCenter';
import { addActivity } from '@/app/components/ActivityTimeline';
import { useTranslations } from '@/app/hooks/useTranslations';
import type { Locale } from '@/i18n/config';
import ProfileManager from '@/app/components/ProfileManager';

type TimePeriod = 'past' | 'future' | 'both';

// Life area icons and colors
const areaConfig = {
  career: { icon: Briefcase, color: 'blue', key: 'career', label: { en: 'Career', mr: 'करिअर', hi: 'करियर' } },
  relationships: { icon: Heart, color: 'pink', key: 'relationships', label: { en: 'Relationships', mr: 'नातेसंबंध', hi: 'रिश्ते' } },
  health: { icon: Activity, color: 'green', key: 'health', label: { en: 'Health', mr: 'आरोग्य', hi: 'स्वास्थ्य' } },
  finance: { icon: DollarSign, color: 'yellow', key: 'finance', label: { en: 'Finance', mr: 'आर्थिक', hi: 'वित्त' } },
  personal: { icon: Star, color: 'purple', key: 'personal', label: { en: 'Personal', mr: 'वैयक्तिक', hi: 'व्यक्तिगत' } },
  spiritual: { icon: Sparkles, color: 'indigo', key: 'spiritual', label: { en: 'Spiritual', mr: 'आध्यात्मिक', hi: 'आध्यात्मिक' } },
  education: { icon: Brain, color: 'cyan', key: 'education', label: { en: 'Education', mr: 'शिक्षण', hi: 'शिक्षा' } },
  family: { icon: Heart, color: 'rose', key: 'family', label: { en: 'Family', mr: 'कुटुंब', hi: 'परिवार' } },
};

export default function EnhancedPredictionsPage() {
  const { locale, predictions: t } = useTranslations();
  const [language, setLanguage] = useState<Locale>(locale); // Sync with global locale
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('both');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [userChart, setUserChart] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [aggressiveMode, setAggressiveMode] = useState(true); // 🔥 Aggressive Mode
  
  // 🌟 NEW: Lifetime predictions state
  const [showLifetimeView, setShowLifetimeView] = useState(false);
  const [lifetimeData, setLifetimeData] = useState<any>(null);
  const [lifetimeLoading, setLifetimeLoading] = useState(false);
  
  // 🔯 NEW: Detailed Kundali prediction state
  const [detailedData, setDetailedData] = useState<any>(null);
  const [detailedLoading, setDetailedLoading] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // 👥 Profile Management
  const [showProfileManager, setShowProfileManager] = useState(false);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // 🏢 Enterprise Features
  const [wsConnected, setWsConnected] = useState(false);
  const [liveTransits, setLiveTransits] = useState<any>(null);
  const [cacheStatus, setCacheStatus] = useState<'cached' | 'fresh' | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);

  // 🏢 WebSocket Connection for Live Updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !userProfile) return;

    // Construct WebSocket URL from API_URL
    let wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    wsUrl = `${wsUrl}/api/v1/ws?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
      console.log('✅ Enterprise WebSocket connected');
      
      // Request live transits
      ws.send(JSON.stringify({
        type: 'request_transits',
        latitude: userProfile?.latitude || 28.6139,
        longitude: userProfile?.longitude || 77.2090
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'transit_update' || data.type === 'transit_response') {
          setLiveTransits(data.planets);
          console.log('🌟 Live transit update received');
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log('👋 WebSocket disconnected');
    };

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userProfile]);

  useEffect(() => {
    // Only fetch if we have a token
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      console.log('No token found on mount, user needs to login');
      setProfileChecked(true);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = '/auth/login';
        return;
      }
      
      // Fetch profile
      const profileRes = await fetch(`${API_URL}/api/v1/users/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        console.log('Fetched profiles:', profiles);
        if (profiles.length > 0) {
          setAllProfiles(profiles);
          setUserProfile(profiles[0]);
          
          // Fetch chart
          const chartRes = await fetch(`${API_URL}/api/v1/charts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (chartRes.ok) {
            const charts = await chartRes.json();
            if (charts.length > 0) setUserChart(charts[0]);
          }
        } else {
          console.log('No profiles found for user');
        }
      } else if (profileRes.status === 401) {
        console.log('Unauthorized, redirecting to login');
        window.location.href = '/auth/login';
      } else {
        console.error('Failed to fetch profiles:', profileRes.status, await profileRes.text());
      }
      
      setProfileChecked(true);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setProfileChecked(true);
    }
  };

  const generatePredictions = async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 🏢 Track analytics event
      try {
        await fetch(`${API_URL}/api/v1/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            event_type: 'prediction_requested',
            category: 'predictions',
            action: 'generate',
            label: aggressiveMode ? 'aggressive_mode' : 'standard_mode',
            properties: {
              language,
              timePeriod,
              aggressive: aggressiveMode
            }
          })
        });
      } catch (e) {
        console.log('Analytics tracking skipped');
      }
      
      // Use aggressive endpoint if enabled
      const endpoint = aggressiveMode 
        ? `${API_URL}/api/v1/advanced/predictions/aggressive`
        : `${API_URL}/api/v1/predictions/events/enhanced-ml?language=${language}`;
      
      const startTime = performance.now();
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: userProfile.name,
          birth_date: new Date(userProfile.dob_ts_utc).toISOString().split('T')[0],
          birth_time: new Date(userProfile.dob_ts_utc).toISOString().split('T')[1].substring(0, 8),
          birth_place: userProfile.birthplace_text,
          latitude: userProfile.latitude,
          longitude: userProfile.longitude,
          current_age: calculateAge(new Date(userProfile.dob_ts_utc).toISOString().split('T')[0]),
          prediction_years: 1,
          language: language,
          enable_boost: aggressiveMode,
          parallel_processing: aggressiveMode
        })
      });

      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setResponseTime(elapsed);

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
        setStats({
          total: data.total_predictions,
          avgAccuracy: data.average_accuracy,
          methods: data.ml_methods
        });
        
        // Send notification
        sendNotification({
          type: 'prediction',
          title: '✨ Predictions Generated!',
          message: `Successfully generated ${data.total_predictions || data.predictions?.length || 0} AI-powered predictions for your journey.`
        });

        // Add to activity timeline
        addActivity({
          type: 'prediction_generated',
          title: 'Predictions Generated',
          description: `Generated ${data.total_predictions || data.predictions?.length || 0} AI-powered predictions`,
          status: 'success',
          metadata: {
            count: data.total_predictions || data.predictions?.length || 0,
            language: language,
            period: timePeriod
          }
        });
        
        // 🏢 Check cache status from headers
        const cacheHeader = response.headers.get('X-Cache-Status');
        setCacheStatus(cacheHeader === 'HIT' ? 'cached' : 'fresh');
        
        // Track success
        try {
          await fetch(`${API_URL}/api/v1/analytics/track`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              event_type: 'prediction_generated',
              category: 'predictions',
              action: 'success',
              value: elapsed,
              properties: {
                count: data.total_predictions,
                cached: cacheHeader === 'HIT',
                responseTime: elapsed
              }
            })
          });
        } catch (e) {
          console.log('Analytics tracking skipped');
        }
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 NEW: Generate lifetime predictions
  const generateLifetimePredictions = async () => {
    if (!userProfile) return;
    
    setLifetimeLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Parse birth date properly (avoid timezone issues)
      const dobDate = new Date(userProfile.dob_ts_utc);
      const birthDateStr = `${dobDate.getUTCFullYear()}-${String(dobDate.getUTCMonth() + 1).padStart(2, '0')}-${String(dobDate.getUTCDate()).padStart(2, '0')}`;
      const birthTimeStr = `${String(dobDate.getUTCHours()).padStart(2, '0')}:${String(dobDate.getUTCMinutes()).padStart(2, '0')}:${String(dobDate.getUTCSeconds()).padStart(2, '0')}`;
      const currentAge = calculateAge(birthDateStr);
      
      console.log(`[LIFETIME PRED] Birth Date: ${birthDateStr}, Time: ${birthTimeStr}, Current Age: ${currentAge}`);
      
      // Fixed: correct API endpoint path
      const response = await fetch(`${API_URL}/api/v1/predictions/events/lifetime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: userProfile.name,
          birth_date: birthDateStr,
          birth_time: birthTimeStr,
          birth_place: userProfile.birthplace_text,
          latitude: userProfile.latitude,
          longitude: userProfile.longitude,
          current_age: currentAge,
          prediction_years: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLifetimeData(data);
        setShowLifetimeView(true);
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to generate lifetime predictions:', error);
    } finally {
      setLifetimeLoading(false);
    }
  };

  // 🔯 NEW: Generate detailed Kundali prediction
  const generateDetailedPrediction = async () => {
    if (!userProfile) return;
    
    setDetailedLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Parse birth date properly
      const dobDate = new Date(userProfile.dob_ts_utc);
      const birthDateStr = `${dobDate.getUTCFullYear()}-${String(dobDate.getUTCMonth() + 1).padStart(2, '0')}-${String(dobDate.getUTCDate()).padStart(2, '0')}`;
      const birthTimeStr = `${String(dobDate.getUTCHours()).padStart(2, '0')}:${String(dobDate.getUTCMinutes()).padStart(2, '0')}:${String(dobDate.getUTCSeconds()).padStart(2, '0')}`;
      const currentAge = calculateAge(birthDateStr);
      
      console.log(`[DETAILED PRED] Birth Date: ${birthDateStr}, Time: ${birthTimeStr}, Current Age: ${currentAge}`);
      
      const response = await fetch(`${API_URL}/api/v1/predictions/events/detailed?language=${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: userProfile.name,
          birth_date: birthDateStr,
          birth_time: birthTimeStr,
          birth_place: userProfile.birthplace_text,
          latitude: userProfile.latitude,
          longitude: userProfile.longitude,
          current_age: currentAge,
          prediction_years: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDetailedData(data);
        setShowDetailedView(true);
        
        // Initialize all sections as expanded
        const allSections = Object.keys(data.sections);
        const expandedState: Record<string, boolean> = {};
        allSections.forEach(section => {
          expandedState[section] = true;
        });
        setExpandedSections(expandedState);
        
        sendNotification({
          type: 'success',
          title: '🔯 Detailed Kundali Generated!',
          message: 'Comprehensive life analysis with timing predictions ready.'
        });
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to generate detailed prediction:', error);
      sendNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate detailed prediction. Please try again.'
      });
    } finally {
      setDetailedLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    try {
      // Parse birth date (expects YYYY-MM-DD format)
      const [year, month, day] = birthDate.split('-').map(Number);
      const birth = new Date(year, month - 1, day); // month is 0-indexed in JS
      
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      // Adjust if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      console.log(`[AGE CALC] Birth: ${birthDate} (Year: ${year}, Month: ${month}, Day: ${day})`);
      console.log(`[AGE CALC] Today: ${today.toISOString().split('T')[0]} (Year: ${today.getFullYear()}, Month: ${today.getMonth() + 1}, Day: ${today.getDate()})`);
      console.log(`[AGE CALC] Calculated Age: ${age}, Month Diff: ${monthDiff}`);
      
      return age;
    } catch (error) {
      console.error('[AGE CALC ERROR]', error, 'Birth Date:', birthDate);
      return 0;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch(confidence) {
      case 'very_high': return 'text-green-600 bg-green-50';
      case 'high': return 'text-blue-600 bg-blue-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'border-green-500 bg-green-50';
      case 'neutral': return 'border-blue-500 bg-blue-50';
      case 'negative': return 'border-orange-500 bg-orange-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (!profileChecked) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-12 text-center border-2 border-purple-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
            <AlertCircle className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.noProfile}</h2>
          <p className="text-lg text-gray-600 mb-8">{t.createProfile}</p>
          <a
            href="/dashboard/charts"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t.createProfile}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{t.title}</h1>
                {userProfile && (
                  <div className="flex items-center mt-2 space-x-2">
                    <User className="w-5 h-5 text-purple-200" />
                    <span className="text-lg font-semibold text-purple-100">
                      {userProfile.name}
                    </span>
                    <span className="text-sm text-purple-200">
                      ({new Date(userProfile.dob_ts_utc).toLocaleDateString()})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-purple-100 text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              {t.subtitle}
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                🆕 Version 5.0.0
              </span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                🎯 Enhanced ML Engine
              </span>
              {/* 🏢 Enterprise Status */}
              <span className={`bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center space-x-2`}>
                <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span>{wsConnected ? '🟢 Live' : '🔴 Offline'}</span>
              </span>
              {cacheStatus && (
                <span className="bg-green-500/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {cacheStatus === 'cached' ? '⚡ Cached' : '🔥 Fresh'} • {responseTime}ms
                </span>
              )}
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                🌐 Multi-Language
              </span>
              {aggressiveMode && (
                <span className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm animate-pulse shadow-lg">
                  🔥 AGGRESSIVE MODE
                </span>
              )}
            </div>
          </div>
          
          {/* Language Selector & Aggressive Mode Toggle */}
          <div className="space-y-4">
            {/* Profile Selector */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Select Profile ({allProfiles.length})
                </label>
                <button
                  onClick={() => setShowProfileManager(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Profile
                </button>
              </div>
              {allProfiles.length > 0 ? (
                <select
                  value={userProfile?.id || ''}
                  onChange={(e) => {
                    const selected = allProfiles.find(p => p.id === e.target.value);
                    if (selected) {
                      setUserProfile(selected);
                      sendNotification({
                        type: 'info',
                        title: '👤 Profile Switched',
                        message: `Now viewing predictions for ${selected.name}`
                      });
                      // Clear existing predictions when switching profiles
                      setPredictions([]);
                      setLifetimeData(null);
                      setDetailedData(null);
                      setShowLifetimeView(false);
                      setShowDetailedView(false);
                    }
                  }}
                  className="bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition w-full"
                >
                  {allProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} - {new Date(profile.dob_ts_utc).toLocaleDateString()} ({profile.birthplace_text})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-white/70">No profiles yet. Click "Add Profile" to create one.</p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <label className="text-sm font-semibold mb-3 block flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                {t.language}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Locale)}
                className="bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition w-full"
              >
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
            
            {/* 🔥 Aggressive Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <label className="text-sm font-semibold mb-3 block flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Prediction Timeframe
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="bg-white text-gray-800 px-4 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition w-full"
              >
                <option value="both">Both Past & Future</option>
                <option value="past">Past Events Only</option>
                <option value="future">Future Predictions Only</option>
              </select>
              <p className="text-xs text-white/70 mt-2">
                Filter predictions by time period
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <label className="text-sm font-semibold mb-3 block flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Aggressive Mode
              </label>
              <button
                onClick={() => setAggressiveMode(!aggressiveMode)}
                className={`w-full px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  aggressiveMode 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {aggressiveMode ? '🔥 ON (< 50ms)' : '⚡ OFF (Standard)'}
              </button>
              <p className="text-xs text-white/70 mt-2">
                {aggressiveMode 
                  ? '5-model neural ensemble • 85-98% accuracy' 
                  : 'Standard ML engine • 75-95% accuracy'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Profile Info Card */}
      {userProfile && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Active Birth Chart Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-purple-100">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile.name}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Birth Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(userProfile.dob_ts_utc).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-indigo-100">
                  <p className="text-sm text-gray-600 mb-1">Birth Place</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile.birthplace_text}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-purple-700 mt-4 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            All predictions below are generated for this birth chart profile
          </p>
        </div>
      )}

      {/* 🌟 NEW: View Toggle - Standard vs Lifetime vs Detailed */}
      <div className="flex justify-center space-x-4 flex-wrap gap-3">
        <button
          onClick={() => {
            setShowLifetimeView(false);
            setShowDetailedView(false);
          }}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            !showLifetimeView && !showDetailedView
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Sparkles className="w-5 h-5 inline mr-2" />
          Standard Predictions
        </button>
        <button
          onClick={() => {
            if (!lifetimeData) {
              generateLifetimePredictions();
            } else {
              setShowLifetimeView(true);
              setShowDetailedView(false);
            }
          }}
          disabled={lifetimeLoading}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            showLifetimeView && !showDetailedView
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${lifetimeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <TrendingUp className="w-5 h-5 inline mr-2" />
          {lifetimeLoading ? 'Generating...' : 'Lifetime View (0-100 years)'}
        </button>
        <button
          onClick={() => {
            if (!detailedData) {
              generateDetailedPrediction();
            } else {
              setShowDetailedView(true);
              setShowLifetimeView(false);
            }
          }}
          disabled={detailedLoading}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            showDetailedView
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${detailedLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FileText className="w-5 h-5 inline mr-2" />
          {detailedLoading ? 'Generating...' : '🔯 Detailed Kundali Report'}
        </button>
      </div>

      {/* Lifetime View */}
      {showLifetimeView && lifetimeData && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <History className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">{lifetimeData.statistics.past_years}</span>
              </div>
              <p className="text-sm text-blue-800 font-semibold">Years Analyzed (Past)</p>
              <p className="text-xs text-blue-600 mt-1">
                Sentiment: {lifetimeData.statistics.avg_past_sentiment > 0 ? '+' : ''}{lifetimeData.statistics.avg_past_sentiment}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <FastForward className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">{lifetimeData.statistics.future_years}</span>
              </div>
              <p className="text-sm text-green-800 font-semibold">Years Predicted (Future)</p>
              <p className="text-xs text-green-600 mt-1">
                Sentiment: {lifetimeData.statistics.avg_future_sentiment > 0 ? '+' : ''}{lifetimeData.statistics.avg_future_sentiment}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">{lifetimeData.statistics.major_events_count}</span>
              </div>
              <p className="text-sm text-purple-800 font-semibold">Major Life Events</p>
              <p className="text-xs text-purple-600 mt-1">Significant milestones detected</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">
                  {lifetimeData.metadata.accuracy_estimate}
                </span>
              </div>
              <p className="text-sm text-orange-800 font-semibold">AI Accuracy</p>
              <p className="text-xs text-orange-600 mt-1">Machine learning powered</p>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
                Life Sentiment Timeline (0-100 Years)
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Current Age</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white mr-2"></div>
                  <span className="text-sm text-gray-600">Past Events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-yellow-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Future Events</span>
                </div>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="w-full overflow-x-auto">
              <svg width="100%" height="600" viewBox="0 0 1400 600" className="border border-gray-200 rounded-lg bg-gradient-to-b from-gray-50 to-white">
                {/* Title */}
                <text x="700" y="25" fontSize="20" fontWeight="bold" fill="#1f2937" textAnchor="middle">
                  Life Sentiment Journey: Birth to Century
                </text>
                <text x="700" y="40" fontSize="11" fill="#6b7280" textAnchor="middle">
                  AI-Powered Vedic Predictions • {lifetimeData.sentiment_timeline.length} Years Analyzed
                </text>

                {/* Grid lines with labels */}
                {[0, 20, 40, 60, 80, 100].map((value) => (
                  <g key={`grid-${value}`}>
                    <line
                      x1="80"
                      y1={400 - (value * 3)}
                      x2="1320"
                      y2={400 - (value * 3)}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <text x="15" y={405 - (value * 3)} fontSize="14" fill="#6b7280" fontWeight="500">
                      {value > 50 ? `+${value - 50}` : value < 50 ? `-${50 - value}` : '0'}
                    </text>
                    <text x="1335" y={405 - (value * 3)} fontSize="10" fill="#9ca3af">
                      {value}%
                    </text>
                  </g>
                ))}

                {/* Decade background shading */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((decade) => (
                  <rect
                    key={`decade-bg-${decade}`}
                    x={80 + (decade * 124)}
                    y="100"
                    width="124"
                    height="300"
                    fill={decade % 2 === 0 ? 'rgba(99, 102, 241, 0.03)' : 'rgba(168, 85, 247, 0.03)'}
                  />
                ))}

                {/* Zero line with label */}
                <line
                  x1="80"
                  y1="250"
                  x2="1320"
                  y2="250"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <text x="50" y="255" fontSize="12" fontWeight="bold" fill="#374151">
                  NEUTRAL
                </text>

                {/* Positive area (green gradient) */}
                <defs>
                  <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.5)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                  </linearGradient>
                  <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
                    <stop offset="100%" stopColor="rgba(239, 68, 68, 0.5)" />
                  </linearGradient>
                </defs>

                <path
                  d={`M 80 250 ${lifetimeData.sentiment_timeline
                    .map((point: any, idx: number) => {
                      const x = 80 + (idx * 12.4); // 12.4px per year for 100 years
                      const y = 250 - (point.positive_score * 2); // Scale to fit chart
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L 1320 250 Z`}
                  fill="url(#positiveGradient)"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="3"
                />

                {/* Negative area (red gradient) */}
                <path
                  d={`M 80 250 ${lifetimeData.sentiment_timeline
                    .map((point: any, idx: number) => {
                      const x = 80 + (idx * 12.4);
                      const y = 250 + (point.negative_score * 2);
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L 1320 250 Z`}
                  fill="url(#negativeGradient)"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="3"
                />

                {/* Life phase dividers and labels with age ranges */}
                {[
                  { age: 0, label: 'Birth', ageRange: '0-12', phase: 'Childhood', color: '#8b5cf6', description: 'Foundation Years' },
                  { age: 13, label: 'Teen', ageRange: '13-19', phase: 'Adolescence', color: '#3b82f6', description: 'Self Discovery' },
                  { age: 20, label: 'Youth', ageRange: '20-35', phase: 'Young Adult', color: '#10b981', description: 'Career Building' },
                  { age: 36, label: 'Midlife', ageRange: '36-55', phase: 'Mid Life', color: '#f59e0b', description: 'Peak Years' },
                  { age: 56, label: 'Mature', ageRange: '56-70', phase: 'Mature', color: '#ef4444', description: 'Wisdom Era' },
                  { age: 71, label: 'Senior', ageRange: '71-100', phase: 'Senior', color: '#6366f1', description: 'Legacy Years' }
                ].map((phase) => {
                  const birthYear = new Date(lifetimeData.birth_date).getFullYear();
                  const startAge = parseInt(phase.ageRange.split('-')[0]);
                  const endAge = parseInt(phase.ageRange.split('-')[1]);
                  const startYear = birthYear + startAge;
                  const endYear = birthYear + endAge;
                  
                  return (
                    <g key={`phase-${phase.age}`}>
                      <line
                        x1={80 + (phase.age * 12.4)}
                        y1="100"
                        x2={80 + (phase.age * 12.4)}
                        y2="400"
                        stroke={phase.color}
                        strokeWidth="2"
                        strokeDasharray="3,3"
                        opacity="0.5"
                      />
                      <text
                        x={80 + (phase.age * 12.4)}
                        y="75"
                        fontSize="10"
                        fontWeight="700"
                        fill={phase.color}
                        textAnchor="middle"
                      >
                        {phase.phase}
                      </text>
                      <text
                        x={80 + (phase.age * 12.4)}
                        y="88"
                        fontSize="8"
                        fill={phase.color}
                        textAnchor="middle"
                        opacity="0.8"
                      >
                        {phase.ageRange} • {startYear}-{endYear}
                      </text>
                    </g>
                  );
                })}

                {/* Current age marker */}
                {lifetimeData.current_age <= 100 && (
                  <g>
                    <line
                      x1={80 + (lifetimeData.current_age * 12.4)}
                      y1="60"
                      x2={80 + (lifetimeData.current_age * 12.4)}
                      y2="400"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray="10,5"
                    />
                    <circle
                      cx={80 + (lifetimeData.current_age * 12.4)}
                      cy="45"
                      r="22"
                      fill="#3b82f6"
                    />
                    <text
                      x={80 + (lifetimeData.current_age * 12.4)}
                      y="50"
                      fontSize="13"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                    >
                      {lifetimeData.current_age}
                    </text>
                    <text
                      x={80 + (lifetimeData.current_age * 12.4)}
                      y="30"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#3b82f6"
                      textAnchor="middle"
                    >
                      TODAY ({new Date().getFullYear()})
                    </text>
                  </g>
                )}

                {/* 5-year milestone markers with years */}
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((age) => {
                  const birthYear = new Date(lifetimeData.birth_date).getFullYear();
                  const year = birthYear + age;
                  const isPast = age <= lifetimeData.current_age;
                  
                  return (
                    <g key={`milestone-${age}`}>
                      <line
                        x1={80 + (age * 12.4)}
                        y1="395"
                        x2={80 + (age * 12.4)}
                        y2="405"
                        stroke={isPast ? '#3b82f6' : '#9ca3af'}
                        strokeWidth="2"
                      />
                      <text
                        x={80 + (age * 12.4)}
                        y="420"
                        fontSize="10"
                        fontWeight={age % 10 === 0 ? '700' : '500'}
                        fill={isPast ? '#1f2937' : '#6b7280'}
                        textAnchor="middle"
                      >
                        {age}
                      </text>
                      {age % 10 === 0 && (
                        <text
                          x={80 + (age * 12.4)}
                          y="505"
                          fontSize="9"
                          fontWeight="600"
                          fill={isPast ? '#3b82f6' : '#9ca3af'}
                          textAnchor="middle"
                        >
                          {year}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Major events markers with enhanced styling */}
                {lifetimeData.major_events.map((event: any, idx: number) => {
                  const x = 80 + (event.age * 12.4);
                  const baseY = 250 - (event.impact * 20);
                  const isPast = event.age <= lifetimeData.current_age;
                  
                  return (
                    <g key={`event-${idx}`}>
                      <circle
                        cx={x}
                        cy={baseY}
                        r={isPast ? "8" : "10"}
                        fill={event.impact > 0 ? '#10b981' : '#ef4444'}
                        stroke={isPast ? 'white' : '#fbbf24'}
                        strokeWidth={isPast ? "3" : "4"}
                        opacity={isPast ? "0.8" : "1"}
                      />
                      <circle
                        cx={x}
                        cy={baseY}
                        r="4"
                        fill="white"
                      />
                      {!isPast && (
                        <circle
                          cx={x}
                          cy={baseY}
                          r="12"
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          opacity="0.5"
                        />
                      )}
                      <title>{`Age ${event.age} (${event.year}): ${event.title} (Impact: ${event.impact > 0 ? '+' : ''}${event.impact.toFixed(1)})`}</title>
                    </g>
                  );
                })}

                {/* Decade labels with years */}
                {[
                  { age: 5, ageRange: '0-10', label: 'Infancy', emoji: '👶' },
                  { age: 15, ageRange: '10-20', label: 'Teens', emoji: '🎓' },
                  { age: 25, ageRange: '20-30', label: 'Young', emoji: '💼' },
                  { age: 35, ageRange: '30-40', label: 'Prime', emoji: '🏆' },
                  { age: 45, ageRange: '40-50', label: 'Mid', emoji: '🎯' },
                  { age: 55, ageRange: '50-60', label: 'Mature', emoji: '👔' },
                  { age: 65, ageRange: '60-70', label: 'Senior', emoji: '🌟' },
                  { age: 75, ageRange: '70-80', label: 'Wise', emoji: '📚' },
                  { age: 85, ageRange: '80-90', label: 'Elder', emoji: '🕊️' },
                  { age: 95, ageRange: '90-100', label: 'Century', emoji: '🎂' }
                ].map((decade) => {
                  const birthYear = new Date(lifetimeData.birth_date).getFullYear();
                  const startYear = birthYear + parseInt(decade.ageRange.split('-')[0]);
                  const endYear = birthYear + parseInt(decade.ageRange.split('-')[1]);
                  
                  return (
                    <g key={`decade-${decade.age}`}>
                      <text
                        x={80 + (decade.age * 12.4)}
                        y="525"
                        fontSize="18"
                        textAnchor="middle"
                      >
                        {decade.emoji}
                      </text>
                      <text
                        x={80 + (decade.age * 12.4)}
                        y="543"
                        fontSize="12"
                        fontWeight="700"
                        fill="#374151"
                        textAnchor="middle"
                      >
                        {decade.ageRange}
                      </text>
                      <text
                        x={80 + (decade.age * 12.4)}
                        y="557"
                        fontSize="10"
                        fill="#6b7280"
                        textAnchor="middle"
                      >
                        {decade.label}
                      </text>
                      <text
                        x={80 + (decade.age * 12.4)}
                        y="573"
                        fontSize="11"
                        fontWeight="600"
                        fill="#3b82f6"
                        textAnchor="middle"
                      >
                        {startYear}-{endYear}
                      </text>
                    </g>
                  );
                })}

                {/* Age axis label */}
                <text x="700" y="590" fontSize="13" fontWeight="bold" fill="#374151" textAnchor="middle">
                  Complete Life Timeline • Birth: {new Date(lifetimeData.birth_date).getFullYear()} • Current: {new Date().getFullYear()} • Age {lifetimeData.current_age}
                </text>

                {/* Y-axis label */}
                <text x="40" y="250" fontSize="14" fontWeight="bold" fill="#374151" textAnchor="middle" transform={`rotate(-90, 40, 250)`}>
                  Sentiment Score
                </text>
              </svg>
            </div>

            <p className="mt-6 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              💡 <strong>How to Read:</strong> Green areas show positive/favorable periods, red areas indicate challenges.
              <strong className="text-blue-600"> YOU</strong> marker shows current age. Circles mark major life events.
              Each decade is labeled with emojis (👶 Infancy → 🎂 Century). Life phases are color-coded vertically.
            </p>
          </div>

          {/* Best & Challenging Years */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2" />
                Top 5 Best Years
              </h3>
              <div className="space-y-3">
                {lifetimeData.statistics.best_years.map((year: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-green-600">{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-800">Age {year.age} ({year.year})</p>
                        <p className="text-sm text-gray-600">Score: +{year.score.toFixed(1)}</p>
                      </div>
                    </div>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Top 5 Challenging Years
              </h3>
              <div className="space-y-3">
                {lifetimeData.statistics.challenging_years.map((year: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-orange-600">{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-800">Age {year.age} ({year.year})</p>
                        <p className="text-sm text-gray-600">Score: {year.score.toFixed(1)}</p>
                      </div>
                    </div>
                    <Info className="w-6 h-6 text-orange-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Life Phases Analysis */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-purple-600" />
              Life Phases Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(lifetimeData.life_phases).map(([phase, data]: [string, any]) => (
                <div
                  key={phase}
                  className={`rounded-xl p-5 border-2 ${
                    data.overall_trend === 'positive'
                      ? 'bg-green-50 border-green-300'
                      : data.overall_trend === 'negative'
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <h3 className="font-bold text-lg capitalize mb-2 text-gray-800">
                    {phase.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Ages {data.age_range}</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-700">Avg Sentiment:</span>
                      <span className="font-bold">{data.avg_sentiment > 0 ? '+' : ''}{data.avg_sentiment}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-700">Major Events:</span>
                      <span className="font-bold">{data.major_events_count}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-700">Trend:</span>
                      <span className={`font-bold capitalize ${
                        data.overall_trend === 'positive'
                          ? 'text-green-600'
                          : data.overall_trend === 'negative'
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`}>
                        {data.overall_trend}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major Events Timeline */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-600" />
              Major Life Events Timeline
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {lifetimeData.major_events.map((event: any, idx: number) => (
                <div
                  key={idx}
                  className={`border-l-4 pl-4 py-3 ${
                    event.age <= lifetimeData.current_age
                      ? 'border-blue-500 bg-blue-50'
                      : event.impact > 5
                      ? 'border-green-500 bg-green-50'
                      : 'border-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xl font-bold text-gray-800">
                          Age {event.age} ({event.year})
                        </span>
                        {event.age <= lifetimeData.current_age && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">PAST</span>
                        )}
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">{event.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">Area: <strong>{event.area}</strong></span>
                        <span className="text-xs text-gray-500">
                          Impact: <strong>{event.impact}/10</strong>
                        </span>
                      </div>
                    </div>
                    {areaConfig[event.area as keyof typeof areaConfig] && (
                      <div className={`p-3 rounded-lg bg-${areaConfig[event.area as keyof typeof areaConfig].color}-100`}>
                        {(() => {
                          const Icon = areaConfig[event.area as keyof typeof areaConfig].icon;
                          return <Icon className={`w-6 h-6 text-${areaConfig[event.area as keyof typeof areaConfig].color}-600`} />;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔯 Detailed Kundali View */}
      {showDetailedView && detailedData && (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 shadow-xl">
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              <FileText className="w-10 h-10 mr-4" />
              🔯 Detailed Kundali Report
            </h1>
            <p className="text-xl opacity-90">Comprehensive Life Analysis with Strategic Timing Predictions</p>
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <span>Generated: {new Date(detailedData.generated_at).toLocaleString()}</span>
              <span>Language: {detailedData.language.toUpperCase()}</span>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Document Sections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.keys(detailedData.sections).map((section) => (
                <a
                  key={section}
                  href={`#section-${section}`}
                  className="px-4 py-3 bg-gray-200 hover:bg-orange-500 hover:text-white rounded-lg transition text-sm font-bold text-gray-800 border-2 border-gray-300 shadow-sm"
                >
                  {section.replace(/_/g, ' ').toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Birth Data Section */}
          {detailedData.sections.birth_data && (
            <div id="section-birth_data" className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">🧬 Birth Data & Core Chart</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Birth Details</h3>
                  <div className="space-y-3 text-gray-900">
                    <p className="text-base"><span className="font-bold text-gray-900">Name:</span> {detailedData.sections.birth_data.birth_details.full_name}</p>
                    <p className="text-base"><span className="font-bold text-gray-900">Birth Date:</span> {detailedData.sections.birth_data.birth_details.birth_date}</p>
                    <p className="text-base"><span className="font-bold text-gray-900">Birth Time:</span> {detailedData.sections.birth_data.birth_details.birth_time}</p>
                    <p className="text-base"><span className="font-bold text-gray-900">Birth Place:</span> {detailedData.sections.birth_data.birth_details.birth_place}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Astrological Details</h3>
                  <div className="space-y-3 text-gray-900">
                    <p className="text-base"><span className="font-bold text-gray-900">Lagna:</span> {detailedData.sections.birth_data.lagna}</p>
                    <p className="text-base"><span className="font-bold text-gray-900">Rashi:</span> {detailedData.sections.birth_data.rashi}</p>
                    <p className="text-base"><span className="font-bold text-gray-900">Nakshatra:</span> {detailedData.sections.birth_data.nakshatra}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personality Section */}
          {detailedData.sections.personality && (
            <div id="section-personality" className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('personality')}
              >
                <h2 className="text-3xl font-bold text-purple-600">🧠 Personality & Life Theme</h2>
                <button className="p-2 hover:bg-purple-50 rounded-lg transition">
                  <ChevronRight 
                    className={`w-6 h-6 text-purple-600 transition-transform ${expandedSections['personality'] ? 'rotate-90' : ''}`} 
                  />
                </button>
              </div>
              {expandedSections['personality'] && (
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Personality Traits</h3>
                  <ul className="space-y-3">
                    {detailedData.sections.personality.personality_traits.map((trait: string, idx: number) => (
                      <li key={idx} className="flex items-start p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <CheckCircle className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-medium text-base leading-relaxed">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Core Strengths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedData.sections.personality.strengths.map((strength: string, idx: number) => (
                      <div key={idx} className="px-4 py-4 bg-green-50 rounded-lg border-2 border-green-300 shadow-sm">
                        <span className="text-green-900 font-semibold text-base">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Challenges to Manage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedData.sections.personality.challenges.map((challenge: string, idx: number) => (
                      <div key={idx} className="px-4 py-4 bg-orange-50 rounded-lg border-2 border-orange-300 shadow-sm">
                        <span className="text-orange-900 font-semibold text-base">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Career Section */}
          {detailedData.sections.career && (
            <div id="section-career" className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('career')}
              >
                <h2 className="text-3xl font-bold text-blue-600">💼 Career Analysis</h2>
                <button className="p-2 hover:bg-blue-50 rounded-lg transition">
                  <ChevronRight 
                    className={`w-6 h-6 text-blue-600 transition-transform ${expandedSections['career'] ? 'rotate-90' : ''}`} 
                  />
                </button>
              </div>
              {expandedSections['career'] && (
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm">
                      <h3 className="font-bold text-lg mb-3 text-gray-800">Current Phase</h3>
                      <p className="text-2xl font-bold text-blue-700">{detailedData.sections.career.career_phases.current_phase}</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200 shadow-sm">
                      <h3 className="font-bold text-lg mb-3 text-gray-800">Next Milestone</h3>
                      <p className="text-lg font-semibold text-green-700">{detailedData.sections.career.career_phases.next_milestone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Favorable Career Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {detailedData.sections.career.tenth_house_analysis.favorable_fields.map((field: string, idx: number) => (
                        <div key={idx} className="px-4 py-3 bg-purple-50 rounded-lg border-l-4 border-purple-600 shadow-sm">
                          <Briefcase className="w-5 h-5 inline mr-2 text-purple-600" />
                          <span className="font-semibold text-gray-800 text-base">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dasha System */}
          {detailedData.sections.dasha_system && (
            <div id="section-dasha_system" className="bg-white rounded-2xl p-8 shadow-lg border-2 border-indigo-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('dasha_system')}
              >
                <h2 className="text-3xl font-bold text-indigo-600">⏳ Dasha System (Timing Engine)</h2>
                <button className="p-2 hover:bg-indigo-50 rounded-lg transition">
                  <ChevronRight 
                    className={`w-6 h-6 text-indigo-600 transition-transform ${expandedSections['dasha_system'] ? 'rotate-90' : ''}`} 
                  />
                </button>
              </div>
              {expandedSections['dasha_system'] && (
              <div className="space-y-6 mt-6">
                <div className="p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200 shadow-sm">
                  <h3 className="font-bold text-xl mb-3 text-gray-800">Current Mahadasha</h3>
                  <p className="text-3xl font-bold text-indigo-700 mb-2">{detailedData.sections.dasha_system.current_mahadasha.planet}</p>
                  <p className="text-gray-800 font-medium text-base mb-3">{detailedData.sections.dasha_system.current_mahadasha.nature}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 font-semibold mb-1">Start Year</p>
                      <p className="text-xl font-bold text-gray-900">{detailedData.sections.dasha_system.current_mahadasha.start_year}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 font-semibold mb-1">End Year</p>
                      <p className="text-xl font-bold text-gray-900">{detailedData.sections.dasha_system.current_mahadasha.end_year}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Antardasha Periods</h3>
                  <div className="space-y-3">
                    {detailedData.sections.dasha_system.antardasha_breakdown.map((period: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-600 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg text-gray-900">{period.period}</p>
                            <p className="text-sm text-gray-700 font-medium mt-1">{period.sub_period}</p>
                          </div>
                          <p className="text-sm text-indigo-700 font-semibold">{period.effect}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Time-Bound Predictions */}
          {detailedData.sections.predictions && (
            <div id="section-predictions" className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('predictions')}
              >
                <h2 className="text-3xl font-bold text-green-600">📅 Time-Bound Predictions (5 Year Window)</h2>
                <button className="p-2 hover:bg-green-50 rounded-lg transition">
                  <ChevronRight 
                    className={`w-6 h-6 text-green-600 transition-transform ${expandedSections['predictions'] ? 'rotate-90' : ''}`} 
                  />
                </button>
              </div>
              {expandedSections['predictions'] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Career Timeline</h3>
                  <div className="space-y-3">
                    {detailedData.sections.predictions.career_predictions.map((pred: any, idx: number) => (
                      <div key={idx} className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-sm">
                        <p className="font-bold text-blue-700 text-lg mb-1">{pred.year}</p>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">{pred.prediction}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Financial Timeline</h3>
                  <div className="space-y-3">
                    {detailedData.sections.predictions.financial_predictions.map((pred: any, idx: number) => (
                      <div key={idx} className="p-4 bg-green-50 rounded-lg border-2 border-green-200 shadow-sm">
                        <p className="font-bold text-green-700 text-lg mb-1">{pred.year}</p>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">{pred.prediction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {detailedData.sections.recommendations && (
            <div id="section-recommendations" className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('recommendations')}
              >
                <h2 className="text-3xl font-bold text-orange-600">💡 Strategic Recommendations</h2>
                <button className="p-2 hover:bg-orange-100 rounded-lg transition">
                  <ChevronRight 
                    className={`w-6 h-6 text-orange-600 transition-transform ${expandedSections['recommendations'] ? 'rotate-90' : ''}`} 
                  />
                </button>
              </div>
              {expandedSections['recommendations'] && (
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-green-700">✅ Immediate Actions</h3>
                  <ul className="space-y-3">
                    {detailedData.sections.recommendations.immediate_actions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start p-4 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-medium text-base leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-blue-700">🎯 Mid-Term Strategy</h3>
                  <ul className="space-y-3">
                    {detailedData.sections.recommendations.mid_term_strategy.map((strategy: string, idx: number) => (
                      <li key={idx} className="flex items-start p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                        <Target className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-medium text-base leading-relaxed">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-4 text-purple-700">🏆 Long-Term Vision</h3>
                  <ul className="space-y-3">
                    {detailedData.sections.recommendations.long_term_vision.map((vision: string, idx: number) => (
                      <li key={idx} className="flex items-start p-4 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                        <Award className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-medium text-base leading-relaxed">{vision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Download/Export Options */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-xl mb-4">📥 Export Options</h3>
            <div className="flex space-x-4">
              <PDFExporter 
                data={detailedData}
                filename="detailed-kundali-report.pdf"
                title="Detailed Kundali Report"
              />
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(detailedData, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'detailed-kundali-report.json';
                  link.click();
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-5 h-5 inline mr-2" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Predictions View */}
      {!showLifetimeView && !showDetailedView && (
        <>
      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-semibold mb-2">Average {t.accuracy}</p>
                <p className="text-4xl font-bold text-green-900">{(stats.avgAccuracy * 100).toFixed(0)}%</p>
              </div>
              <Award className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-semibold mb-2">Total Predictions</p>
                <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Target className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-semibold mb-2">ML Methods</p>
                <p className="text-4xl font-bold text-purple-900">{stats.methods.length}</p>
              </div>
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={generatePredictions}
          disabled={loading}
          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white mr-3"></div>
              {t.loading}
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3" />
              {t.generateBtn}
            </>
          )}
        </button>

        {predictions.length > 0 && (
          <>
            <PDFExporter
              title="AI Life Predictions Report"
              content={predictions}
              filename={`predictions-${new Date().toISOString().split('T')[0]}.pdf`}
              type="predictions"
            />
          </>
        )}

        {predictions.length > 0 && (
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/v1/enhanced/reports/pdf`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ 
                    predictions, 
                    language,
                    include_ml_analysis: true 
                  })
                });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `all_predictions_${language}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error('PDF download failed:', error);
              }
            }}
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 text-lg font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all"
          >
            <FileText className="w-6 h-6 mr-3" />
            Download All PDF
          </button>
        )}
      </div>

      {/* Predictions Grid */}
      {predictions.length > 0 && (() => {
        const filteredPredictions = predictions.filter((pred) => {
          const predDate = new Date(pred.date || pred.year || Date.now());
          const isPast = predDate < new Date();
          
          if (timePeriod === 'past') return isPast;
          if (timePeriod === 'future') return !isPast;
          return true; // 'both'
        });

        const isFiltered = timePeriod !== 'both';
        const filterPercentage = Math.round((filteredPredictions.length / predictions.length) * 100);

        return (
          <>
            {/* Prediction Count with Filter Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-white text-xl font-bold">
                    Showing {filteredPredictions.length} of {predictions.length} predictions
                  </p>
                  {isFiltered && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      timePeriod === 'past' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {timePeriod === 'past' ? '📅 Past Only' : '🔮 Future Only'}
                    </span>
                  )}
                </div>
                
                {isFiltered && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${
                            timePeriod === 'past' ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${filterPercentage}%` }}
                        />
                      </div>
                      <span className="font-semibold">{filterPercentage}%</span>
                    </div>
                    <button
                      onClick={() => setTimePeriod('both')}
                      className="text-gray-300 hover:text-white transition-colors underline text-xs"
                    >
                      Show All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredPredictions.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">
                    {timePeriod === 'past' ? '📅' : '🔮'}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No {timePeriod === 'past' ? 'Past Events' : 'Future Predictions'} Found
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {timePeriod === 'past' 
                      ? 'All predictions are for future dates. Try selecting "Future Predictions" or "Both".'
                      : 'All predictions are for past dates. Try selecting "Past Events" or "Both".'}
                  </p>
                  <button
                    onClick={() => setTimePeriod('both')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Show All Predictions
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPredictions.map((pred, idx) => {
            const areaInfo = areaConfig[pred.area as keyof typeof areaConfig];
            const AreaIcon = areaInfo?.icon || Star;
            
            return (
              <div
                key={idx}
                className={`rounded-2xl border-l-4 ${getSentimentColor(pred.sentiment)} p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1`}
                onClick={() => setSelectedPrediction(pred)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-${areaInfo?.color}-100 p-3 rounded-xl`}>
                    <AreaIcon className={`w-6 h-6 text-${areaInfo?.color}-600`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(pred.confidence)}`}>
                    {pred.confidence.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Area Label */}
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {areaInfo?.label[language] || pred.area}
                </h3>

                {/* Title */}
                <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {pred.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {pred.description}
                </p>

                {/* Footer */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(pred.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US')}
                    </div>
                    <div className="flex items-center text-sm font-bold text-purple-600">
                      <Award className="w-4 h-4 mr-1" />
                      {(pred.accuracy * 100).toFixed(0)}%
                    </div>
                  </div>
                  {aggressiveMode && (
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        Neural Ensemble • {stats?.from_cache ? 'Cached' : 'Fresh'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
              </div>
            )}
          </>
        );
      })()}


      {/* Detailed Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedPrediction(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{selectedPrediction.title}</h2>
              <button onClick={() => setSelectedPrediction(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{selectedPrediction.description}</p>

            {/* ML Analysis */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                {t.mlAnalysis}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedPrediction.ml_analysis || {}).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{key.replace(/_/g, ' ')}</p>
                    <p className="text-2xl font-bold text-purple-600">{typeof value === 'number' ? `${value}%` : String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {selectedPrediction.recommendations && (
              <div className="bg-green-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  {t.recommendations}
                </h3>
                <ul className="space-y-2">
                  {selectedPrediction.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Astrological Basis */}
            {selectedPrediction.astrological_basis && (
              <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-indigo-600" />
                  {t.astrological}
                </h3>
                <p className="text-gray-700">{selectedPrediction.astrological_basis}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_URL}/api/v1/enhanced/share/links?language=${language}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ prediction: selectedPrediction, platform: 'whatsapp', language })
                      });
                      const data = await response.json();
                      if (data.success && data.links) {
                        window.open(data.links.whatsapp, '_blank');
                      }
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>

                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_URL}/api/v1/enhanced/share/links?language=${language}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ prediction: selectedPrediction, platform: 'twitter', language })
                      });
                      const data = await response.json();
                      if (data.success && data.links) {
                        window.open(data.links.twitter, '_blank');
                      }
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </button>

                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_URL}/api/v1/enhanced/share/links?language=${language}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ prediction: selectedPrediction, platform: 'facebook', language })
                      });
                      const data = await response.json();
                      if (data.success && data.links) {
                        window.open(data.links.facebook, '_blank');
                      }
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Facebook
                </button>
              </div>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/api/v1/enhanced/reports/pdf`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ 
                        predictions: [selectedPrediction], 
                        language,
                        include_ml_analysis: true 
                      })
                    });
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prediction_${language}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('PDF download failed:', error);
                  }
                }}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
      
      {/* Profile Manager Modal */}
      <ProfileManager 
        isOpen={showProfileManager}
        onClose={() => setShowProfileManager(false)}
        onProfileCreated={async () => {
          // Refresh profiles list
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/v1/users/profiles`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const profiles = await response.json();
              setAllProfiles(profiles);
              
              // Set the newly created profile as active
              if (profiles.length > 0) {
                setUserProfile(profiles[profiles.length - 1]);
              }
              
              sendNotification({
                type: 'success',
                title: '✅ Profile Created!',
                message: 'New profile has been added successfully.'
              });
            }
          } catch (error) {
            console.error('Failed to refresh profiles:', error);
          }
        }}
      />
    </div>
  );
}
