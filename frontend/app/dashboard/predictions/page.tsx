'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, Calendar, Clock, Heart, Briefcase, DollarSign, Activity, AlertCircle, CheckCircle, Info, ChevronRight, Star, Moon, Sun } from 'lucide-react';

type TimeFrame = 'today' | 'week' | 'month' | 'year';
type LifeArea = 'career' | 'relationships' | 'health' | 'finance' | 'personal' | 'spiritual';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'transits' | 'dashas'>('overview');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('month');
  const [selectedArea, setSelectedArea] = useState<LifeArea | 'all'>('all');
  const [loading, setLoading] = useState(false);

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Sparkles className="w-10 h-10 text-indigo-400" strokeWidth={2} />
            AI Predictions
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Personalized insights for your life journey</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - predictions.overall.score / 100)}`}
                    className="text-indigo-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{predictions.overall.score}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Overall Forecast</h2>
                <p className="text-slate-300 text-lg mb-2">{predictions.overall.message}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Trend:</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold capitalize">
                    {predictions.overall.trend}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Time Frame Selector */}
            <div className="flex gap-2">
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' }
              ].map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeFrame(tf.value as TimeFrame)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedTimeFrame === tf.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-slate-700/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'overview', label: 'Life Areas', icon: Star },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
              { id: 'transits', label: 'Transits', icon: TrendingUp },
              { id: 'dashas', label: 'Dashas', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab - Life Areas */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
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

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
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

        {/* Transits Tab */}
        {activeTab === 'transits' && (
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

        {/* Dashas Tab */}
        {activeTab === 'dashas' && (
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
