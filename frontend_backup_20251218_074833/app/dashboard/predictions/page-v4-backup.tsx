'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Calendar, Clock, Heart, Briefcase, DollarSign, Activity, AlertCircle, CheckCircle, Info, ChevronRight, Star, Moon, Sun, History, FastForward, Blend } from 'lucide-react';
import { API_URL } from '@/app/config';

type TimeFrame = 'today' | 'week' | 'month' | 'year';
type LifeArea = 'career' | 'relationships' | 'health' | 'finance' | 'personal' | 'spiritual';
type TimePeriod = 'past' | 'future' | 'both';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'transits' | 'dashas'>('overview');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('month');
  const [selectedArea, setSelectedArea] = useState<LifeArea | 'all'>('all');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('both');
  const [loading, setLoading] = useState(false);
  const [realPredictions, setRealPredictions] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userChart, setUserChart] = useState<any>(null);
  const [profileChecked, setProfileChecked] = useState(false);

  // Auto-fetch predictions on page load
  useEffect(() => {
    if (!profileChecked) {
      fetchPredictions('both');
    }
  }, []);

  const fetchUserChart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/charts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const charts = await response.json();
        if (charts.length > 0) {
          // Use the most recent chart
          const latestChart = charts[0];
          setUserChart(latestChart);
          return latestChart;
        }
      }
    } catch (error) {
      console.error('Failed to fetch user charts:', error);
    }
    return null;
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/profiles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setUserProfile(data[0]);
          return data[0];
        }
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
    return null;
  };

  const fetchPredictions = async (period: TimePeriod) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to get user's chart first (most accurate)
      let chart = userChart;
      if (!chart) {
        chart = await fetchUserChart();
      }

      // Get user profile
      let profile = userProfile;
      if (!profile) {
        profile = await fetchUserProfile();
      }

      setProfileChecked(true);

      if (!profile) {
        // No profile exists yet - UI will show helpful message
        setLoading(false);
        return;
      }

      // Calculate age from birth date
      const birthDate = new Date(profile.dob_ts_utc);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      // Prepare real user data from their actual profile/chart
      const requestData = {
        full_name: profile.name,
        birth_date: birthDate.toISOString().split('T')[0],
        birth_time: birthDate.toTimeString().split(' ')[0].substring(0, 5),
        birth_place: profile.birthplace_text,
        latitude: profile.latitude,
        longitude: profile.longitude,
        current_age: age,
        prediction_years: 10
      };

      console.log('[PREDICTIONS] Using real chart data:', {
        profile: profile.name,
        hasChart: !!chart,
        chartId: chart?.id,
        birthDate: requestData.birth_date,
        location: requestData.birth_place
      });

      // Use real authenticated endpoints
      let endpoint = '';
      if (period === 'past') {
        endpoint = `${API_URL}/api/v1/predictions/events/past`;
      } else if (period === 'future') {
        endpoint = `${API_URL}/api/v1/predictions/events/future`;
      } else {
        endpoint = `${API_URL}/api/v1/predictions/events/combined`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        setRealPredictions(data);
      } else if (response.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock predictions data
  const predictions = {
    overall: {
      score: 78,
      trend: 'improving',
      message: 'A favorable period ahead with opportunities for growth'
    },
    areas: [
      {
        id: 'career' as LifeArea,
        name: 'Career',
        icon: Briefcase,
        score: 85,
        trend: 'up',
        color: 'blue',
        prediction: 'Excellent time for professional advancement. Consider taking on new projects or responsibilities.',
        opportunities: ['Job promotion possible in Q1', 'Network expansion opportunities', 'Recognition from seniors'],
        challenges: ['Work-life balance needs attention', 'Avoid office politics'],
        bestDays: ['Dec 15', 'Dec 22', 'Dec 28']
      },
      {
        id: 'relationships' as LifeArea,
        name: 'Relationships',
        icon: Heart,
        score: 72,
        trend: 'stable',
        color: 'rose',
        prediction: 'Steady period for relationships. Communication is key to maintaining harmony.',
        opportunities: ['Deepen existing bonds', 'Resolve past conflicts', 'Meet new people'],
        challenges: ['Miscommunication possible mid-month', 'Need patience with family'],
        bestDays: ['Dec 14', 'Dec 21', 'Dec 29']
      },
      {
        id: 'health' as LifeArea,
        name: 'Health',
        icon: Activity,
        score: 68,
        trend: 'down',
        color: 'emerald',
        prediction: 'Focus on preventive care and maintaining healthy routines. Energy levels may fluctuate.',
        opportunities: ['Start new fitness routine', 'Mental wellness focus', 'Dietary improvements'],
        challenges: ['Stress management needed', 'Sleep quality may suffer', 'Avoid overexertion'],
        bestDays: ['Dec 12', 'Dec 19', 'Dec 26']
      },
      {
        id: 'finance' as LifeArea,
        name: 'Finance',
        icon: DollarSign,
        score: 80,
        trend: 'up',
        color: 'amber',
        prediction: 'Good period for financial planning and investments. Unexpected gains possible.',
        opportunities: ['Investment opportunities', 'Salary increment likely', 'Side income sources'],
        challenges: ['Avoid impulsive purchases', 'Review existing investments'],
        bestDays: ['Dec 16', 'Dec 23', 'Dec 30']
      },
      {
        id: 'personal' as LifeArea,
        name: 'Personal Growth',
        icon: Star,
        score: 76,
        trend: 'up',
        color: 'purple',
        prediction: 'Period of self-reflection and personal development. New insights and clarity expected.',
        opportunities: ['Learn new skills', 'Creative pursuits', 'Self-improvement'],
        challenges: ['Avoid self-doubt', 'Stay focused on goals'],
        bestDays: ['Dec 13', 'Dec 20', 'Dec 27']
      },
      {
        id: 'spiritual' as LifeArea,
        name: 'Spiritual',
        icon: Sparkles,
        score: 82,
        trend: 'up',
        color: 'indigo',
        prediction: 'Heightened spiritual awareness and intuition. Excellent time for meditation and inner work.',
        opportunities: ['Spiritual practices', 'Meditation breakthroughs', 'Connect with guides'],
        challenges: ['Stay grounded', 'Balance material and spiritual'],
        bestDays: ['Dec 11', 'Dec 18', 'Dec 25']
      }
    ],
    timeline: [
      {
        date: '2025-12-15',
        type: 'opportunity',
        area: 'career',
        title: 'Career Breakthrough',
        description: 'Jupiter transit favors professional growth. Ideal day for important meetings or presentations.',
        intensity: 'high'
      },
      {
        date: '2025-12-18',
        type: 'caution',
        area: 'relationships',
        title: 'Communication Challenge',
        description: 'Mercury retrograde effect may cause misunderstandings. Practice clear communication.',
        intensity: 'medium'
      },
      {
        date: '2025-12-22',
        type: 'opportunity',
        area: 'finance',
        title: 'Financial Gain',
        description: 'Venus in favorable position indicates potential for financial benefits or gifts.',
        intensity: 'high'
      },
      {
        date: '2025-12-25',
        type: 'neutral',
        area: 'spiritual',
        title: 'Spiritual Insight',
        description: 'Powerful day for meditation and spiritual practices. Inner clarity expected.',
        intensity: 'medium'
      },
      {
        date: '2025-12-28',
        type: 'opportunity',
        area: 'personal',
        title: 'Personal Milestone',
        description: 'Sun transit supports personal goals and achievements. Take bold steps.',
        intensity: 'high'
      }
    ],
    transits: [
      {
        planet: 'Jupiter',
        sign: 'Taurus',
        house: 2,
        effect: 'Expansion in finances and values. Good time for investments and building resources.',
        duration: 'Until May 2026',
        impact: 'positive'
      },
      {
        planet: 'Saturn',
        sign: 'Pisces',
        house: 12,
        effect: 'Period of introspection and spiritual growth. Focus on letting go and transformation.',
        duration: 'Until March 2026',
        impact: 'neutral'
      },
      {
        planet: 'Mars',
        sign: 'Leo',
        house: 5,
        effect: 'Boost in creativity and self-expression. Good for romance and creative projects.',
        duration: 'Until Jan 2026',
        impact: 'positive'
      },
      {
        planet: 'Venus',
        sign: 'Capricorn',
        house: 10,
        effect: 'Professional relationships and career advancement favored. Recognition possible.',
        duration: 'Until Jan 15, 2026',
        impact: 'positive'
      },
      {
        planet: 'Mercury',
        sign: 'Sagittarius',
        house: 9,
        effect: 'Expansion of knowledge and long-distance opportunities. Good for learning.',
        duration: 'Until Dec 31, 2025',
        impact: 'positive'
      }
    ],
    dashas: [
      {
        level: 'Mahadasha',
        planet: 'Venus',
        startDate: '2023-05-15',
        endDate: '2043-05-15',
        duration: '20 years',
        description: 'Venus Mahadasha brings focus on relationships, creativity, luxury, and material comforts. A generally favorable period for love, art, and prosperity.',
        effects: ['Increased charm and social grace', 'Financial prosperity', 'Artistic inclinations', 'Focus on relationships']
      },
      {
        level: 'Antardasha',
        planet: 'Mars',
        startDate: '2025-01-15',
        endDate: '2026-03-15',
        duration: '14 months',
        description: 'Mars sub-period adds energy, ambition, and courage. Good for taking action on desires and goals.',
        effects: ['Increased energy and drive', 'Competitive spirit', 'Physical activities favored', 'Quick decision making']
      },
      {
        level: 'Pratyantardasha',
        planet: 'Jupiter',
        startDate: '2025-11-20',
        endDate: '2026-01-25',
        duration: '66 days',
        description: 'Jupiter micro-period brings wisdom, expansion, and good fortune. Favorable for education and spiritual growth.',
        effects: ['Optimism and positivity', 'Learning opportunities', 'Spiritual inclinations', 'Good luck']
      }
    ]
  };

  const filteredAreas = selectedArea === 'all' 
    ? predictions.areas 
    : predictions.areas.filter(area => area.id === selectedArea);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 rotate-180" />;
    return <div className="w-4 h-4 rounded-full bg-slate-500" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-slate-400';
  };

  const getEventTypeColor = (type: string) => {
    if (type === 'opportunity') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (type === 'caution') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  const getEventTypeIcon = (type: string) => {
    if (type === 'opportunity') return <CheckCircle className="w-5 h-5" />;
    if (type === 'caution') return <AlertCircle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getAreaColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-600/30 to-blue-700/30 border-blue-500/50',
      rose: 'from-rose-600/30 to-rose-700/30 border-rose-500/50',
      emerald: 'from-emerald-600/30 to-emerald-700/30 border-emerald-500/50',
      amber: 'from-amber-600/30 to-amber-700/30 border-amber-500/50',
      purple: 'from-purple-600/30 to-purple-700/30 border-purple-500/50',
      indigo: 'from-indigo-600/30 to-indigo-700/30 border-indigo-500/50'
    };
    return colors[color] || colors.blue;
  };

  const getPlanetIcon = (planet: string) => {
    const icons: Record<string, any> = {
      'Sun': Sun,
      'Moon': Moon,
      'Mars': Star,
      'Mercury': Sparkles,
      'Jupiter': Star,
      'Venus': Heart,
      'Saturn': Clock
    };
    const Icon = icons[planet] || Star;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header with Time Period Selector */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Sparkles className="w-10 h-10 text-indigo-400" strokeWidth={2} />
            AI Predictions
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Personalized insights for your life journey</p>
          
          {/* Chart-Based Notice */}
          {userChart && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">
                Predictions based on your birth chart
              </span>
            </div>
          )}
          
          {/* Time Period Selector */}
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => {
                setTimePeriod('past');
                fetchPredictions('past');
              }}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold ${
                timePeriod === 'past'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <History className="w-5 h-5" />
              Past Events
            </button>
            <button
              onClick={() => {
                setTimePeriod('both');
                fetchPredictions('both');
              }}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold ${
                timePeriod === 'both'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Blend className="w-5 h-5" />
              Past & Future
            </button>
            <button
              onClick={() => {
                setTimePeriod('future');
                fetchPredictions('future');
              }}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold ${
                timePeriod === 'future'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FastForward className="w-5 h-5" />
              Future Predictions
            </button>
          </div>
        </div>

        {/* No Profile Warning */}
        {!loading && !userProfile && profileChecked && (
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-3xl p-12 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-3xl font-bold text-white mb-4">Create Your Birth Profile First</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              To generate personalized AI predictions, you need to create a birth profile with your date, time, and location of birth.
            </p>
            <a
              href="/dashboard/charts/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Create Birth Profile
            </a>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Analyzing your cosmic timeline...</p>
          </div>
        )}

        {/* Past Events Section */}
        {!loading && (timePeriod === 'past' || timePeriod === 'both') && realPredictions?.past_events && (
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-7 h-7 text-amber-400" />
              <h2 className="text-3xl font-bold text-amber-400">Past Life Events</h2>
              <span className="text-sm text-gray-400">(Retrodiction Analysis)</span>
            </div>
            
            <div className="space-y-4">
              {realPredictions.past_events.map((event: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-amber-400 font-semibold text-lg">
                          Age {event.age_start}{event.age_end && ` - ${event.age_end}`}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {event.category || event.life_area}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{event.event_type || event.description}</h3>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-400 mb-1">Probability</div>
                      <div className="text-2xl font-bold text-amber-400">{Math.round(event.probability * 100)}%</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{event.description || event.interpretation}</p>
                  
                  {event.key_indicators && event.key_indicators.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-sm text-gray-400 mb-2 font-semibold">Astrological Indicators:</div>
                      <div className="flex flex-wrap gap-2">
                        {event.key_indicators.map((indicator: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-slate-800/50 text-xs text-gray-300 border border-slate-700">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {event.supporting_factors && event.supporting_factors.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-400 mb-2 font-semibold">Supporting Factors:</div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {event.supporting_factors.map((factor: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Future Events Section */}
        {!loading && (timePeriod === 'future' || timePeriod === 'both') && realPredictions?.future_events && (
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FastForward className="w-7 h-7 text-blue-400" />
              <h2 className="text-3xl font-bold text-blue-400">Upcoming Life Events</h2>
              <span className="text-sm text-gray-400">(Predictive Analysis)</span>
            </div>
            
            <div className="space-y-4">
              {realPredictions.future_events.map((event: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-blue-400 font-semibold text-lg">
                          Age {event.age_start}{event.age_end && ` - ${event.age_end}`}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {event.category || event.life_area}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{event.event_type || event.description}</h3>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-400 mb-1">Probability</div>
                      <div className="text-2xl font-bold text-blue-400">{Math.round(event.probability * 100)}%</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{event.description || event.interpretation}</p>
                  
                  {event.recommendations && event.recommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-sm text-gray-400 mb-2 font-semibold">Recommendations:</div>
                      <ul className="text-sm text-gray-300 space-y-2">
                        {event.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.key_indicators && event.key_indicators.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-400 mb-2 font-semibold">Astrological Indicators:</div>
                      <div className="flex flex-wrap gap-2">
                        {event.key_indicators.map((indicator: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-slate-800/50 text-xs text-gray-300 border border-slate-700">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo data sections completely removed - never show */}

        {/* Overview Tab - Life Areas - Only show if explicitly requested and no real data */}
        {false && activeTab === 'overview' && !realPredictions && profileChecked && userProfile && (
          <div className="space-y-8">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-300 text-sm">
                  Loading your personalized predictions... Click "Past & Future" above to generate real AI predictions based on your birth chart.
                </p>
              </div>
            </div>
            {/* Area Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All Areas' },
                ...predictions.areas.map(area => ({ value: area.id, label: area.name }))
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedArea(filter.value as any)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedArea === filter.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-slate-700/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Life Areas Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.id}
                    className={`bg-gradient-to-br ${getAreaColor(area.color)} backdrop-blur-xl rounded-3xl border-2 shadow-2xl p-8`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{area.name}</h3>
                          <div className={`flex items-center gap-2 mt-1 ${getTrendColor(area.trend)}`}>
                            {getTrendIcon(area.trend)}
                            <span className="text-sm font-semibold capitalize">{area.trend}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{area.score}</div>
                        <div className="text-sm text-slate-300">Score</div>
                      </div>
                    </div>

                    <p className="text-slate-200 mb-6 leading-relaxed">{area.prediction}</p>

                    <div className="space-y-4">
                      {/* Opportunities */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-white">Opportunities</h4>
                        </div>
                        <ul className="space-y-2">
                          {area.opportunities.map((opp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Challenges */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                          <h4 className="font-bold text-white">Things to Watch</h4>
                        </div>
                        <ul className="space-y-2">
                          {area.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Best Days */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <h4 className="font-bold text-white">Best Days</h4>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {area.bestDays.map((day, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white font-semibold">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Overview Tab - Real Predictions Summary */}
        {activeTab === 'overview' && realPredictions && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-indigo-400" />
                <div>
                  <h2 className="text-3xl font-bold text-white">Your AI-Powered Predictions</h2>
                  <p className="text-slate-400 mt-1">Based on your unique birth chart and current planetary transits</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {realPredictions.past_events && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <History className="w-6 h-6 text-amber-400" />
                      <h3 className="text-xl font-bold text-white">Past Events</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-400 mb-2">{realPredictions.past_events.length}</p>
                    <p className="text-slate-300 text-sm">Retrodicted life events analyzed</p>
                  </div>
                )}
                
                {realPredictions.future_events && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FastForward className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Future Events</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">{realPredictions.future_events.length}</p>
                    <p className="text-slate-300 text-sm">Predicted upcoming events</p>
                  </div>
                )}
                
                {realPredictions.accuracy_score !== undefined && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-white">Accuracy</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-400 mb-2">{Math.round(realPredictions.accuracy_score * 100)}%</p>
                    <p className="text-slate-300 text-sm">AI confidence score</p>
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-slate-300 text-center">
                  📊 Scroll down to see detailed past and future predictions or switch to Timeline, Transits, or Dashas tabs for more insights.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab - Demo data disabled */}
        {false && activeTab === 'timeline' && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-400" />
              Upcoming Events
            </h2>

            <div className="space-y-6">
              {predictions.timeline.map((event, idx) => {
                const areaData = predictions.areas.find(a => a.id === event.area);
                const Icon = areaData?.icon || Star;
                
                return (
                  <div key={idx} className="relative pl-12 pb-8 border-l-2 border-slate-700 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 -translate-x-1/2 p-2 bg-slate-800 rounded-full border-2 border-slate-700">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    
                    <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/50 hover:border-indigo-500/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                          <span className="text-sm text-slate-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.intensity === 'high' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {event.intensity} intensity
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transits Tab - Demo data disabled */}
        {false && activeTab === 'transits' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                Current Planetary Transits
              </h2>
              <p className="text-slate-400 mb-8">
                Planetary movements and their influence on your life
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {predictions.transits.map((transit, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/50 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                          {getPlanetIcon(transit.planet)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{transit.planet}</h3>
                          <p className="text-sm text-slate-400">in {transit.sign} • House {transit.house}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transit.impact === 'positive' 
                          ? 'bg-green-500/20 text-green-300' 
                          : transit.impact === 'negative'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {transit.impact}
                      </span>
                    </div>

                    <p className="text-slate-300 mb-4 leading-relaxed">{transit.effect}</p>

                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{transit.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dashas Tab - Demo data disabled */}
        {false && activeTab === 'dashas' && (
          <div className="space-y-6">
            {predictions.dashas.map((dasha, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${
                      idx === 0 ? 'bg-indigo-500/20' : idx === 1 ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                      {getPlanetIcon(dasha.planet)}
                    </div>
                    <div>
                      <div className="text-sm text-indigo-400 font-semibold mb-1">{dasha.level}</div>
                      <h3 className="text-2xl font-bold text-white">{dasha.planet}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{dasha.duration}</div>
                    <div className="text-sm text-slate-400">Duration</div>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">{dasha.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Start Date</div>
                    <div className="text-white font-semibold">{dasha.startDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-2">End Date</div>
                    <div className="text-white font-semibold">{dasha.endDate}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-3">Key Effects</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {dasha.effects.map((effect, effectIdx) => (
                      <div key={effectIdx} className="flex items-start gap-2 text-slate-300">
                        <Star className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                        <span className="text-sm">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
