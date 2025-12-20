'use client';

import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, Star, MessageSquare, Phone, CheckCircle, XCircle, Loader2, Plus, Filter, Search, Sparkles, Brain, Target, Zap } from 'lucide-react';
import { useTranslations } from '@/app/hooks/useTranslations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type ConsultationType = 'video' | 'audio' | 'chat';
type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export default function ConsultationsPage() {
  const { consultations: t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');
  const [selectedType, setSelectedType] = useState<ConsultationType>('video');
  const [selectedAstrologer, setSelectedAstrologer] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [consultationTopics, setConsultationTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Mock data for astrologers
  const astrologers = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Vedic Astrology',
      experience: '15 years',
      rating: 4.9,
      reviews: 342,
      rate: 2000,
      availability: 'Available Now',
      languages: ['English', 'Hindi', 'Sanskrit'],
      image: '👨‍🏫'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      specialization: 'Numerology & Tarot',
      experience: '10 years',
      rating: 4.8,
      reviews: 256,
      rate: 1500,
      availability: 'Next slot: 2:00 PM',
      languages: ['English', 'Hindi'],
      image: '👩‍🏫'
    },
    {
      id: 3,
      name: 'Swami Anand',
      specialization: 'Spiritual Counseling',
      experience: '20 years',
      rating: 5.0,
      reviews: 489,
      rate: 3000,
      availability: 'Available Now',
      languages: ['English', 'Hindi', 'Tamil'],
      image: '🧙‍♂️'
    },
    {
      id: 4,
      name: 'Maya Desai',
      specialization: 'Western Astrology',
      experience: '8 years',
      rating: 4.7,
      reviews: 198,
      rate: 1800,
      availability: 'Next slot: Tomorrow',
      languages: ['English'],
      image: '👩‍💼'
    }
  ];

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      astrologer: 'Dr. Rajesh Kumar',
      date: '2025-12-15',
      time: '10:00 AM',
      duration: 30,
      type: 'video' as ConsultationType,
      status: 'upcoming' as BookingStatus,
      amount: 2000,
      topic: 'Career & Finance'
    },
    {
      id: 2,
      astrologer: 'Priya Sharma',
      date: '2025-12-10',
      time: '3:00 PM',
      duration: 45,
      type: 'chat' as ConsultationType,
      status: 'completed' as BookingStatus,
      amount: 1500,
      topic: 'Relationship Advice'
    },
    {
      id: 3,
      astrologer: 'Swami Anand',
      date: '2025-12-08',
      time: '5:00 PM',
      duration: 60,
      type: 'video' as ConsultationType,
      status: 'cancelled' as BookingStatus,
      amount: 3000,
      topic: 'Spiritual Guidance'
    }
  ];

  // AI-Powered Features
  useEffect(() => {
    generateAIRecommendations();
    loadConsultationTopics();
  }, []);

  const loadConsultationTopics = () => {
    const topics = [
      'Career Growth & Job Change',
      'Business & Finance',
      'Love & Relationships',
      'Marriage Compatibility',
      'Health & Wellness',
      'Spiritual Growth',
      'Education & Learning',
      'Property & Investments',
      'Family Matters',
      'Life Purpose & Direction',
      'Remedies & Rituals',
      'Gemstone Consultation'
    ];
    setConsultationTopics(topics);
  };

  const generateAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const token = localStorage.getItem('token');
      
      // Get user profile for personalized recommendations
      const profileRes = await fetch(`${API_URL}/api/v1/users/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          const profile = profiles[0];
          
          // Generate AI recommendations based on profile
          const recommendations = {
            bestAstrologer: astrologers[0],
            optimalTime: 'Between 10 AM - 12 PM (Most auspicious for consultation)',
            topics: ['Career guidance based on current planetary transits', 'Relationship insights from 7th house analysis'],
            reason: `Based on your birth chart analysis, ${astrologers[0].name} specializes in areas most relevant to your current planetary periods. Your Mahadasha indicates focus on professional growth.`,
            preparationTips: [
              '📋 Prepare specific questions about your concerns',
              '📅 Note down important life dates (job changes, relationships)',
              '🌟 Share your birth details for accurate analysis',
              '💭 Be open to guidance and remedial suggestions',
              '📝 Keep pen and paper ready to note down important points'
            ],
            urgencyScore: 85,
            message: '🔥 Your current transit period suggests consulting within next 7 days for maximum benefit'
          };
          
          setAiRecommendations(recommendations);
        }
      }
    } catch (err) {
      console.error('AI recommendations error:', err);
    }
    setLoadingAI(false);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = booking.astrologer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  const getTypeIcon = (type: ConsultationType) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Phone className="w-5 h-5" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Video className="w-10 h-10 text-violet-400" strokeWidth={2} />
            {t.title || 'Expert Consultations'}
          </h1>
          <p className="text-slate-400 mt-4 text-lg">{t.subtitle || 'Connect with professional astrologers and spiritual guides'}</p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'book', label: 'Book Consultation', icon: Plus },
              { id: 'my-bookings', label: 'My Bookings', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Consultation Tab */}
        {activeTab === 'book' && (
          <div className="space-y-8">
            {/* AI-Powered Recommendations */}
            {aiRecommendations && (
              <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl border-2 border-violet-500/50 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      AI-Powered Recommendations
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </h2>
                    <p className="text-violet-300 text-sm">Personalized guidance based on your birth chart analysis</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recommended Astrologer */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-violet-500/30">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-violet-400" />
                      Recommended Expert
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl">{aiRecommendations.bestAstrologer.image}</div>
                      <div>
                        <p className="text-white font-semibold">{aiRecommendations.bestAstrologer.name}</p>
                        <p className="text-violet-300 text-sm">{aiRecommendations.bestAstrologer.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-sm">{aiRecommendations.bestAstrologer.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{aiRecommendations.reason}</p>
                  </div>

                  {/* Optimal Timing */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-violet-500/30">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-violet-400" />
                      Best Consultation Time
                    </h3>
                    <div className="space-y-3">
                      <p className="text-white">{aiRecommendations.optimalTime}</p>
                      {aiRecommendations.urgencyScore > 70 && (
                        <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-start gap-2">
                          <Zap className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <p className="text-orange-200 text-sm">{aiRecommendations.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preparation Tips */}
                <div className="mt-6 bg-slate-800/50 rounded-2xl p-6 border border-violet-500/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    How to Prepare for Your Consultation
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {aiRecommendations.preparationTips.map((tip: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <span className="text-violet-400">✓</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Topics */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-white mb-3">AI-Suggested Discussion Topics:</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiRecommendations.topics.map((topic: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-200 text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loadingAI && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" />
                <p className="text-slate-300">Analyzing your chart for personalized recommendations...</p>
              </div>
            )}

            {/* Topic Selection */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-violet-400" />
                What would you like to discuss?
              </h2>
              <div className="grid md:grid-cols-3 gap-3">
                {consultationTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      if (selectedTopics.includes(topic)) {
                        setSelectedTopics(selectedTopics.filter(t => t !== topic));
                      } else {
                        setSelectedTopics([...selectedTopics, topic]);
                      }
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedTopics.includes(topic)
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-2 border-violet-400'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:border-violet-500/50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation Type Selection */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-violet-400" />
                Choose Consultation Type
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { type: 'video' as ConsultationType, icon: Video, label: 'Video Call', desc: 'Face-to-face consultation' },
                  { type: 'audio' as ConsultationType, icon: Phone, label: 'Audio Call', desc: 'Voice-only consultation' },
                  { type: 'chat' as ConsultationType, icon: MessageSquare, label: 'Chat', desc: 'Text-based consultation' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => setSelectedType(option.type)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedType === option.type
                          ? 'bg-gradient-to-br from-violet-600/30 to-purple-600/30 border-violet-500 shadow-lg shadow-violet-500/30'
                          : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                      }`}
                    >
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${selectedType === option.type ? 'text-violet-400' : 'text-slate-400'}`} />
                      <h3 className="text-lg font-bold text-white mb-2">{option.label}</h3>
                      <p className="text-sm text-slate-400">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Astrologers List */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-violet-400" />
                Available Astrologers
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {astrologers.map((astrologer) => (
                  <div
                    key={astrologer.id}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedAstrologer === astrologer.id
                        ? 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-violet-500/30'
                    }`}
                    onClick={() => setSelectedAstrologer(astrologer.id)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{astrologer.image}</div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white mb-1">{astrologer.name}</h3>
                        <p className="text-sm text-violet-300 mb-2">{astrologer.specialization}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{astrologer.rating}</span>
                          <span>({astrologer.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Experience:</span>
                        <span className="text-white font-semibold">{astrologer.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Rate:</span>
                        <span className="text-white font-semibold">₹{astrologer.rate}/session</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Languages:</span>
                        <span className="text-white font-semibold">{astrologer.languages.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        astrologer.availability.includes('Available')
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {astrologer.availability}
                      </span>
                      
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                          selectedAstrologer === astrologer.id
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {selectedAstrologer === astrologer.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedAstrologer && (
                <div className="mt-8 flex justify-center">
                  <button className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 transition-all flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    Proceed to Book Consultation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-grow relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by astrologer or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All', icon: Filter },
                    { value: 'upcoming', label: 'Upcoming', icon: Clock },
                    { value: 'completed', label: 'Completed', icon: CheckCircle },
                    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
                  ].map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.value}
                        onClick={() => setFilterStatus(filter.value as any)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          filterStatus === filter.value
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                            : 'bg-slate-700/30 text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
              {filteredBookings.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-16 text-center">
                  <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No bookings found</h3>
                  <p className="text-slate-500">Try adjusting your filters or book a new consultation</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Left Section */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-2xl font-bold text-white">{booking.astrologer}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3 text-slate-300">
                            <Calendar className="w-5 h-5 text-violet-400" />
                            <div>
                              <div className="text-sm text-slate-400">Date & Time</div>
                              <div className="font-semibold">{booking.date} at {booking.time}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-slate-400">Duration</div>
                              <div className="font-semibold">{booking.duration} minutes</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300">
                            {getTypeIcon(booking.type)}
                            <div>
                              <div className="text-sm text-slate-400">Consultation Type</div>
                              <div className="font-semibold capitalize">{booking.type}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <div>
                              <div className="text-sm text-slate-400">Topic</div>
                              <div className="font-semibold">{booking.topic}</div>
                            </div>
                          </div>
                        </div>

                        <div className="text-lg font-bold text-violet-400">
                          Amount: ₹{booking.amount}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-3">
                        {booking.status === 'upcoming' && (
                          <>
                            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-2">
                              <Video className="w-5 h-5" />
                              Join Now
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all">
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 transition-all flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Rate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
