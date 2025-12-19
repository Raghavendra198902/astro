'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Calendar, Clock, Heart, Briefcase, 
  DollarSign, Activity, AlertCircle, CheckCircle, Info, 
  ChevronRight, Star, Moon, Sun, History, FastForward, 
  Blend, Brain, Target, Zap, Award, Globe, Languages,
  Share2, Download, FileText, MessageCircle 
} from 'lucide-react';
import { API_URL } from '@/app/config';

type Language = 'en' | 'mr' | 'hi';
type TimePeriod = 'past' | 'future' | 'both';

// Marathi translations
const translations = {
  en: {
    title: 'AI-Powered Life Predictions',
    subtitle: 'Enhanced ML predictions with 100% accuracy focus',
    generateBtn: 'Generate AI Predictions',
    loading: 'Generating predictions...',
    noProfile: 'No Profile Found',
    createProfile: 'Please create your birth profile first',
    language: 'Language',
    accuracy: 'Accuracy',
    confidence: 'Confidence',
    mlAnalysis: 'ML Analysis',
    recommendations: 'Recommendations',
    astrological: 'Astrological Basis'
  },
  mr: {
    title: 'AI-सक्षम जीवन भविष्यवाणी',
    subtitle: '100% अचूकतेसह वर्धित ML भविष्यवाणी',
    generateBtn: 'AI भविष्यवाणी तयार करा',
    loading: 'भविष्यवाणी तयार करत आहे...',
    noProfile: 'प्रोफाइल सापडले नाही',
    createProfile: 'कृपया प्रथम तुमची जन्म प्रोफाइल तयार करा',
    language: 'भाषा',
    accuracy: 'अचूकता',
    confidence: 'विश्वास',
    mlAnalysis: 'ML विश्लेषण',
    recommendations: 'शिफारशी',
    astrological: 'ज्योतिषीय आधार'
  },
  hi: {
    title: 'AI-संचालित जीवन भविष्यवाणी',
    subtitle: '100% सटीकता के साथ उन्नत ML भविष्यवाणी',
    generateBtn: 'AI भविष्यवाणी उत्पन्न करें',
    loading: 'भविष्यवाणी उत्पन्न हो रही है...',
    noProfile: 'प्रोफ़ाइल नहीं मिली',
    createProfile: 'कृपया पहले अपनी जन्म प्रोफ़ाइल बनाएं',
    language: 'भाषा',
    accuracy: 'सटीकता',
    confidence: 'आत्मविश्वास',
    mlAnalysis: 'ML विश्लेषण',
    recommendations: 'सिफारिशें',
    astrological: 'ज्योतिषीय आधार'
  }
};

// Life area icons and colors
const areaConfig = {
  career: { icon: Briefcase, color: 'blue', label: { en: 'Career', mr: 'करिअर', hi: 'करियर' } },
  relationships: { icon: Heart, color: 'pink', label: { en: 'Relationships', mr: 'नातेसंबंध', hi: 'रिश्ते' } },
  health: { icon: Activity, color: 'green', label: { en: 'Health', mr: 'आरोग्य', hi: 'स्वास्थ्य' } },
  finance: { icon: DollarSign, color: 'yellow', label: { en: 'Finance', mr: 'आर्थिक', hi: 'वित्त' } },
  personal: { icon: Star, color: 'purple', label: { en: 'Personal', mr: 'वैयक्तिक', hi: 'व्यक्तिगत' } },
  spiritual: { icon: Sparkles, color: 'indigo', label: { en: 'Spiritual', mr: 'आध्यात्मिक', hi: 'आध्यात्मिक' } },
  education: { icon: Brain, color: 'cyan', label: { en: 'Education', mr: 'शिक्षण', hi: 'शिक्षा' } },
  family: { icon: Heart, color: 'rose', label: { en: 'Family', mr: 'कुटुंब', hi: 'परिवार' } },
};

export default function EnhancedPredictionsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('both');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userChart, setUserChart] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [aggressiveMode, setAggressiveMode] = useState(true); // 🔥 Aggressive Mode

  const t = translations[language];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch profile
      const profileRes = await fetch(`${API_URL}/api/v1/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          setUserProfile(profiles[0]);
          
          // Fetch chart
          const chartRes = await fetch(`${API_URL}/api/v1/charts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (chartRes.ok) {
            const charts = await chartRes.json();
            if (charts.length > 0) setUserChart(charts[0]);
          }
        }
      } else if (profileRes.status === 401) {
        window.location.href = '/auth/login';
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
      
      // Use aggressive endpoint if enabled
      const endpoint = aggressiveMode 
        ? `${API_URL}/api/v1/advanced/predictions/aggressive`
        : `${API_URL}/api/v1/events/enhanced-ml?language=${language}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: userProfile.name,
          birth_date: userProfile.birth_date,
          birth_time: userProfile.birth_time,
          birth_place: userProfile.birth_place,
          latitude: userProfile.latitude,
          longitude: userProfile.longitude,
          current_age: calculateAge(userProfile.birth_date),
          prediction_years: 1,
          language: language,
          enable_boost: aggressiveMode,
          parallel_processing: aggressiveMode
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
        setStats({
          total: data.total_predictions,
          avgAccuracy: data.average_accuracy,
          methods: data.ml_methods
        });
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
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
              <h1 className="text-4xl font-bold">{t.title}</h1>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <label className="text-sm font-semibold mb-3 block flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                {t.language}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
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
      {predictions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred, idx) => {
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
                    <p className="text-2xl font-bold text-purple-600">{value}%</p>
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
    </div>
  );
}
