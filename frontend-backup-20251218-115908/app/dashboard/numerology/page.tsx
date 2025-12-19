'use client';

import { useState } from 'react';
import { Calculator, Hash, Star, Users, Sparkles, Loader2, Heart, Briefcase, TrendingUp, Target, Zap, Mountain, Award, Calendar, BookOpen, Compass, Crown } from 'lucide-react';
import { API_URL } from '@/app/config';

export default function NumerologyPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'challenges' | 'compatibility'>('overview');

  // Calculate Pinnacles and Challenges
  const calculatePinnaclesAndChallenges = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const reduceNumber = (num: number): number => {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
      }
      return num;
    };

    // Pinnacles
    const pinnacle1 = reduceNumber(month + day);
    const pinnacle2 = reduceNumber(day + year);
    const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2);
    const pinnacle4 = reduceNumber(month + year);

    // Life Path for age calculations
    const lifePath = reduceNumber(reduceNumber(day) + reduceNumber(month) + reduceNumber(year));
    
    // Pinnacle ages
    const pinnacle1End = 36 - lifePath;
    const pinnacle2End = pinnacle1End + 9;
    const pinnacle3End = pinnacle2End + 9;

    // Challenges
    const challenge1 = Math.abs(month - day);
    const challenge2 = Math.abs(day - year % 100);
    const challenge3 = Math.abs(challenge1 - challenge2);
    const challenge4 = Math.abs(month - year % 100);

    return {
      pinnacles: [
        { number: pinnacle1, age: `0-${pinnacle1End}`, period: 'First Pinnacle', description: 'Foundation years - learning and growth' },
        { number: pinnacle2, age: `${pinnacle1End + 1}-${pinnacle2End}`, period: 'Second Pinnacle', description: 'Productive years - career and relationships' },
        { number: pinnacle3, age: `${pinnacle2End + 1}-${pinnacle3End}`, period: 'Third Pinnacle', description: 'Mature years - wisdom and achievement' },
        { number: pinnacle4, age: `${pinnacle3End + 1}+`, period: 'Fourth Pinnacle', description: 'Final years - legacy and fulfillment' },
      ],
      challenges: [
        { number: challenge1, period: 'First Challenge', description: 'Early life obstacles to overcome' },
        { number: challenge2, period: 'Second Challenge', description: 'Mid-life challenges' },
        { number: challenge3, period: 'Main Challenge', description: 'Core life lesson' },
        { number: challenge4, period: 'Final Challenge', description: 'Later life challenges' },
      ],
      lifePath
    };
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate) {
      alert('Please enter both name and birth date');
      return;
    }
    
    try {
      setLoading(true);
      setResults(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/numerology-test?full_name=${encodeURIComponent(formData.name)}&birth_date=${formData.birthDate}&system=pythagorean`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert('Failed to calculate numerology');
      }
    } catch (err) {
      console.error('Error calculating numerology:', err);
      alert('Failed to calculate numerology. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const numerologyMeanings = [
    { number: 1, title: 'Number 1', meaning: 'Leadership and independence', icon: Star, color: 'from-red-500 to-orange-500' },
    { number: 2, title: 'Number 2', meaning: 'Cooperation and balance', icon: Users, color: 'from-orange-500 to-yellow-500' },
    { number: 3, title: 'Number 3', meaning: 'Creativity and expression', icon: Sparkles, color: 'from-yellow-500 to-green-500' },
    { number: 4, title: 'Number 4', meaning: 'Stability and foundation', icon: Briefcase, color: 'from-green-500 to-teal-500' },
    { number: 5, title: 'Number 5', meaning: 'Freedom and adventure', icon: TrendingUp, color: 'from-teal-500 to-blue-500' },
    { number: 6, title: 'Number 6', meaning: 'Harmony and responsibility', icon: Heart, color: 'from-blue-500 to-indigo-500' },
    { number: 7, title: 'Number 7', meaning: 'Wisdom and spirituality', icon: Star, color: 'from-indigo-500 to-purple-500' },
    { number: 8, title: 'Number 8', meaning: 'Power and abundance', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { number: 9, title: 'Number 9', meaning: 'Compassion and completion', icon: Heart, color: 'from-pink-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Calculator className="w-10 h-10 text-purple-400" strokeWidth={2} />
            Advanced Numerology Analysis
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Complete numerological profile with life cycles, pinnacles, and challenges</p>
        </div>

        {/* Tab Navigation */}
        {results && !results.error && (
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'cycles', label: 'Life Cycles', icon: TrendingUp },
                { id: 'challenges', label: 'Pinnacles', icon: Mountain },
                { id: 'compatibility', label: 'Insights', icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
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
        )}

        {/* Calculator Form */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Hash className="w-6 h-6 text-purple-400" />
            Calculate Your Numbers
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate'
              )}
            </button>
          </form>
        </div>

        {/* Results Display */}
        {results && !results.error && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Your Numerology Profile
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Life Path Number */}
                {results.life_path && (
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Life Path</div>
                    <div className="text-5xl font-bold text-purple-400 mb-3">{results.life_path.number}</div>
                    <div className="text-sm text-slate-300">{results.life_path.meaning}</div>
                  </div>
                )}
                
                {/* Expression Number */}
                {results.expression && (
                  <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all hover:shadow-xl hover:shadow-pink-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-pink-300 mb-2 uppercase tracking-wider">Expression</div>
                    <div className="text-5xl font-bold text-pink-400 mb-3">{results.expression.number}</div>
                    <div className="text-sm text-slate-300">{results.expression.meaning}</div>
                  </div>
                )}
                
                {/* Soul Urge Number */}
                {results.soul_urge && (
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">Soul Urge</div>
                    <div className="text-5xl font-bold text-blue-400 mb-3">{results.soul_urge.number}</div>
                    <div className="text-sm text-slate-300">{results.soul_urge.meaning}</div>
                  </div>
                )}
                
                {/* Personality Number */}
                {results.personality && (
                  <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all hover:shadow-xl hover:shadow-green-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">Personality</div>
                    <div className="text-5xl font-bold text-green-400 mb-3">{results.personality.number}</div>
                    <div className="text-sm text-slate-300">{results.personality.meaning}</div>
                  </div>
                )}
              </div>

              {/* Additional Numbers Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Maturity Number */}
                {results.maturity && (
                  <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/50 transition-all hover:shadow-xl hover:shadow-amber-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-amber-300 mb-2 uppercase tracking-wider">Maturity Number</div>
                    <div className="text-5xl font-bold text-amber-400 mb-3">{results.maturity.number}</div>
                    <div className="text-sm text-slate-300">{results.maturity.meaning}</div>
                  </div>
                )}
                
                {/* Personal Year */}
                {results.personal_year && (
                  <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105">
                    <div className="text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wider">Personal Year 2025</div>
                    <div className="text-5xl font-bold text-cyan-400 mb-3">{results.personal_year.number}</div>
                    <div className="text-sm text-slate-300">{results.personal_year.meaning}</div>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Life Cycles Tab */}
            {activeTab === 'cycles' && formData.birthDate && (
              <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  9-Year Personal Cycle
                </h2>
                
                <div className="space-y-4">
                  {Array.from({ length: 9 }, (_, i) => {
                    const currentYear = new Date().getFullYear();
                    const year = currentYear - 4 + i;
                    const birthDate = new Date(formData.birthDate);
                    
                    const reduceToSingle = (num: number): number => {
                      while (num > 9) {
                        num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
                      }
                      return num;
                    };
                    
                    const dayReduced = reduceToSingle(birthDate.getDate());
                    const monthReduced = reduceToSingle(birthDate.getMonth() + 1);
                    const yearReduced = reduceToSingle(year);
                    const personalYear = reduceToSingle(dayReduced + monthReduced + yearReduced);
                    
                    const isCurrent = year === currentYear;
                    
                    const yearMeanings: { [key: number]: { theme: string, focus: string, advice: string } } = {
                      1: { theme: 'New Beginnings', focus: 'Fresh starts, independence, leadership', advice: 'Take initiative and start new projects' },
                      2: { theme: 'Cooperation & Balance', focus: 'Partnerships, diplomacy, patience', advice: 'Focus on relationships and teamwork' },
                      3: { theme: 'Creative Expression', focus: 'Self-expression, joy, socializing', advice: 'Express yourself and enjoy life' },
                      4: { theme: 'Building Foundation', focus: 'Hard work, stability, organization', advice: 'Focus on practical matters and structure' },
                      5: { theme: 'Change & Freedom', focus: 'Adventure, versatility, progress', advice: 'Embrace change and new experiences' },
                      6: { theme: 'Love & Responsibility', focus: 'Family, home, service to others', advice: 'Nurture relationships and take care of others' },
                      7: { theme: 'Inner Wisdom', focus: 'Spirituality, introspection, analysis', advice: 'Seek knowledge and inner truth' },
                      8: { theme: 'Power & Achievement', focus: 'Success, authority, material abundance', advice: 'Focus on career and financial goals' },
                      9: { theme: 'Completion & Release', focus: 'Endings, humanitarianism, closure', advice: 'Let go and prepare for new cycles' }
                    };
                    
                    const yearInfo = yearMeanings[personalYear];
                    
                    return (
                      <div
                        key={year}
                        className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          isCurrent ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-slate-600/50 text-slate-300'
                        }`}>
                          {year}
                        </div>
                        
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                          isCurrent ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' : 'bg-slate-600/50 text-slate-200'
                        }`}>
                          {personalYear}
                        </div>
                        
                        <div className="flex-grow">
                          <div className={`text-lg font-bold mb-1 ${isCurrent ? 'text-purple-200' : 'text-slate-200'}`}>
                            {yearInfo.theme}
                            {isCurrent && <span className="ml-3 px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full">Current Year</span>}
                          </div>
                          <div className={`text-sm mb-2 ${isCurrent ? 'text-purple-300' : 'text-slate-400'}`}>{yearInfo.focus}</div>
                          <div className={`text-xs italic ${isCurrent ? 'text-purple-400' : 'text-slate-500'}`}>💡 {yearInfo.advice}</div>
                        </div>
                        
                        <div className="flex-shrink-0 w-24">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isCurrent ? 'bg-gradient-to-r from-purple-500 to-pink-500' : year < currentYear ? 'bg-slate-500' : 'bg-slate-600'}`}
                              style={{ width: year < currentYear ? '100%' : year === currentYear ? '50%' : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Understanding Your 9-Year Cycle
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Life unfolds in 9-year cycles, each year carrying unique energies. Your Personal Year Number reveals themes and opportunities. 
                    Year 1 starts new cycles, while Year 9 completes them. Understanding these patterns helps you align actions with cosmic timing 
                    for maximum success and fulfillment.
                  </p>
                </div>
              </div>
            )}

            {/* Pinnacles and Challenges Tab */}
            {activeTab === 'challenges' && formData.birthDate && (() => {
              const { pinnacles, challenges, lifePath } = calculatePinnaclesAndChallenges(formData.birthDate);
              const currentAge = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
              
              return (
                <div className="space-y-8">
                  {/* Pinnacles */}
                  <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                      <Mountain className="w-8 h-8 text-purple-400" />
                      Life Pinnacles - Your Success Cycles
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {pinnacles.map((pinnacle, idx) => {
                        const ages = pinnacle.age.split('-');
                        const startAge = parseInt(ages[0]);
                        const endAge = ages[1] === '+' ? 999 : parseInt(ages[1]);
                        const isActive = currentAge >= startAge && currentAge <= endAge;
                        
                        const pinnacleColors = [
                          'from-blue-600/20 to-blue-800/20 border-blue-500/30',
                          'from-green-600/20 to-green-800/20 border-green-500/30',
                          'from-amber-600/20 to-amber-800/20 border-amber-500/30',
                          'from-purple-600/20 to-purple-800/20 border-purple-500/30'
                        ];
                        
                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${pinnacleColors[idx]} rounded-2xl p-6 border ${
                              isActive ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/30' : ''
                            } transition-all hover:scale-105`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{pinnacle.period}</div>
                                <div className="text-xs text-slate-400 mt-1">Ages {pinnacle.age}</div>
                              </div>
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {pinnacle.number}
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 mb-2">{pinnacle.description}</div>
                            {isActive && (
                              <div className="mt-3 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full inline-block">
                                <Crown className="w-3 h-3 inline mr-1" />
                                Currently Active
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
                      <h3 className="text-lg font-bold text-blue-200 mb-3">About Pinnacles</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Pinnacles represent major life periods and the opportunities they bring. Each pinnacle offers unique lessons and growth potential. 
                        Your current age ({currentAge}) places you in a specific pinnacle cycle. Understanding this helps you maximize the energy available to you now.
                      </p>
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                      <Target className="w-8 h-8 text-pink-400" />
                      Life Challenges - Growth Opportunities
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {challenges.map((challenge, idx) => {
                        const challengeColors = [
                          'from-rose-600/20 to-rose-800/20 border-rose-500/30',
                          'from-orange-600/20 to-orange-800/20 border-orange-500/30',
                          'from-red-600/20 to-red-800/20 border-red-500/30',
                          'from-pink-600/20 to-pink-800/20 border-pink-500/30'
                        ];
                        
                        const challengeMeanings: { [key: number]: string } = {
                          0: 'No specific challenge - you have freedom to choose your path',
                          1: 'Learn independence and self-reliance',
                          2: 'Develop cooperation and overcome sensitivity',
                          3: 'Express yourself and avoid scattering energy',
                          4: 'Build discipline and overcome limitations',
                          5: 'Handle change and avoid impulsiveness',
                          6: 'Balance responsibility without being controlling',
                          7: 'Trust and open up emotionally',
                          8: 'Balance material and spiritual, avoid domination'
                        };
                        
                        return (
                          <div
                            key={idx}
                            className={`bg-gradient-to-br ${challengeColors[idx]} rounded-2xl p-6 border transition-all hover:scale-105`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{challenge.period}</div>
                              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {challenge.number}
                              </div>
                            </div>
                            <div className="text-sm text-slate-300 mb-2">{challenge.description}</div>
                            <div className="text-xs text-slate-400 italic mt-3">
                              {challengeMeanings[challenge.number] || 'Work on overcoming obstacles in this area'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                      <h3 className="text-lg font-bold text-pink-200 mb-3">Understanding Challenges</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Challenges are not obstacles but opportunities for growth. They represent areas where you'll develop strength and wisdom. 
                        The Main Challenge (third) is your primary life lesson. Embrace these challenges to unlock your full potential.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Insights Tab */}
            {activeTab === 'compatibility' && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Detailed Number Interpretations */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Compass className="w-8 h-8 text-purple-400" />
                    Detailed Interpretations
                  </h2>
                  
                  <div className="space-y-6">
                    {results.life_path && (
                      <div className="p-6 bg-gradient-to-r from-purple-600/10 to-purple-800/10 border border-purple-500/20 rounded-2xl">
                        <h3 className="text-xl font-bold text-purple-200 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Life Path {results.life_path.number} - Your Journey
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">{results.life_path.meaning}</p>
                        {results.life_path.calculation && (
                          <div className="text-xs text-purple-400 font-mono bg-purple-900/20 p-3 rounded-lg">
                            Calculation: {results.life_path.calculation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {results.expression && (
                      <div className="p-6 bg-gradient-to-r from-pink-600/10 to-pink-800/10 border border-pink-500/20 rounded-2xl">
                        <h3 className="text-xl font-bold text-pink-200 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Expression {results.expression.number} - Your Talents
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">{results.expression.meaning}</p>
                        {results.expression.calculation && (
                          <div className="text-xs text-pink-400 font-mono bg-pink-900/20 p-3 rounded-lg">
                            Name Analysis: {results.expression.calculation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {results.soul_urge && (
                      <div className="p-6 bg-gradient-to-r from-blue-600/10 to-blue-800/10 border border-blue-500/20 rounded-2xl">
                        <h3 className="text-xl font-bold text-blue-200 mb-3 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Soul Urge {results.soul_urge.number} - Your Desires
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">{results.soul_urge.meaning}</p>
                        {results.soul_urge.calculation && (
                          <div className="text-xs text-blue-400 font-mono bg-blue-900/20 p-3 rounded-lg">
                            Vowel Analysis: {results.soul_urge.calculation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {results.personality && (
                      <div className="p-6 bg-gradient-to-r from-green-600/10 to-green-800/10 border border-green-500/20 rounded-2xl">
                        <h3 className="text-xl font-bold text-green-200 mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Personality {results.personality.number} - How Others See You
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">{results.personality.meaning}</p>
                        {results.personality.calculation && (
                          <div className="text-xs text-green-400 font-mono bg-green-900/20 p-3 rounded-lg">
                            Consonant Analysis: {results.personality.calculation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Life Path Compatibility Guide */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-400" />
                    Number Compatibility Guide
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                      const compatibilityInfo: { [key: number]: { compatible: number[], challenging: number[], neutral: number[] } } = {
                        1: { compatible: [3, 5, 9], challenging: [4, 6, 8], neutral: [1, 2, 7] },
                        2: { compatible: [4, 6, 8], challenging: [1, 5, 9], neutral: [2, 3, 7] },
                        3: { compatible: [1, 5, 7], challenging: [4, 6], neutral: [2, 3, 8, 9] },
                        4: { compatible: [2, 6, 8], challenging: [1, 3, 5], neutral: [4, 7, 9] },
                        5: { compatible: [1, 3, 7], challenging: [2, 4, 6], neutral: [5, 8, 9] },
                        6: { compatible: [2, 4, 8], challenging: [1, 3, 5], neutral: [6, 7, 9] },
                        7: { compatible: [3, 5, 9], challenging: [2, 6, 8], neutral: [1, 4, 7] },
                        8: { compatible: [2, 4, 6], challenging: [1, 7, 9], neutral: [3, 5, 8] },
                        9: { compatible: [1, 3, 7], challenging: [2, 4, 5], neutral: [6, 8, 9] }
                      };
                      
                      const info = compatibilityInfo[num];
                      const isUserNumber = results.life_path?.number === num;
                      
                      return (
                        <div
                          key={num}
                          className={`p-4 rounded-xl border transition-all ${
                            isUserNumber
                              ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-400 shadow-lg shadow-purple-500/20'
                              : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {num}
                            </div>
                            <div className="text-white font-semibold">Number {num}</div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-green-400">✓ Best with:</span>
                              <span className="text-slate-300 ml-2">{info.compatible.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-red-400">⚠ Challenging:</span>
                              <span className="text-slate-300 ml-2">{info.challenging.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Life Chart - Moved to Cycles Tab */}
            {formData.birthDate && (
              <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  Life Chart - 9-Year Cycle
                </h2>
                
                <div className="space-y-4">
                  {Array.from({ length: 9 }, (_, i) => {
                    const currentYear = new Date().getFullYear();
                    const year = currentYear - 4 + i;
                    const birthDate = new Date(formData.birthDate);
                    
                    // Calculate personal year for each year
                    const dayReduced = parseInt(birthDate.getDate().toString().split('').reduce((a, b) => {
                      const sum = parseInt(a) + parseInt(b);
                      return sum > 9 ? sum.toString().split('').reduce((x, y) => parseInt(x) + parseInt(y), 0).toString() : sum.toString();
                    }));
                    const monthReduced = parseInt(birthDate.getMonth() + 1).toString().split('').reduce((a, b) => {
                      const sum = parseInt(a) + parseInt(b);
                      return sum > 9 ? sum.toString().split('').reduce((x, y) => parseInt(x) + parseInt(y), 0).toString() : sum.toString();
                    }, '');
                    const yearReduced = year.toString().split('').reduce((a, b) => {
                      const sum = parseInt(a) + parseInt(b);
                      return sum > 9 ? sum.toString().split('').reduce((x, y) => parseInt(x) + parseInt(y), 0).toString() : sum.toString();
                    }, '');
                    
                    const total = parseInt(dayReduced) + parseInt(monthReduced) + parseInt(yearReduced);
                    const personalYear = total > 9 ? total.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) : total;
                    
                    const isCurrent = year === currentYear;
                    
                    const yearMeanings: { [key: number]: { theme: string, focus: string } } = {
                      1: { theme: 'New Beginnings', focus: 'Fresh starts, independence, leadership' },
                      2: { theme: 'Cooperation', focus: 'Partnerships, balance, patience' },
                      3: { theme: 'Creativity', focus: 'Self-expression, joy, socializing' },
                      4: { theme: 'Foundation', focus: 'Hard work, stability, organization' },
                      5: { theme: 'Change', focus: 'Freedom, adventure, versatility' },
                      6: { theme: 'Responsibility', focus: 'Family, home, service to others' },
                      7: { theme: 'Reflection', focus: 'Spirituality, introspection, wisdom' },
                      8: { theme: 'Achievement', focus: 'Success, power, material abundance' },
                      9: { theme: 'Completion', focus: 'Endings, humanitarianism, closure' }
                    };
                    
                    const yearInfo = yearMeanings[personalYear] || { theme: 'Cycle', focus: 'Personal growth' };
                    
                    return (
                      <div
                        key={year}
                        className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                      >
                        {/* Year Badge */}
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          isCurrent
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-slate-600/50 text-slate-300'
                        }`}>
                          {year}
                        </div>
                        
                        {/* Personal Year Number */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                          isCurrent
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
                            : 'bg-slate-600/50 text-slate-200'
                        }`}>
                          {personalYear}
                        </div>
                        
                        {/* Year Information */}
                        <div className="flex-grow">
                          <div className={`text-lg font-bold mb-1 ${isCurrent ? 'text-purple-200' : 'text-slate-200'}`}>
                            {yearInfo.theme}
                            {isCurrent && (
                              <span className="ml-3 px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full">Current Year</span>
                            )}
                          </div>
                          <div className={`text-sm ${isCurrent ? 'text-purple-300' : 'text-slate-400'}`}>
                            {yearInfo.focus}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex-shrink-0 w-24">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                  : year < currentYear
                                  ? 'bg-slate-500'
                                  : 'bg-slate-600'
                              }`}
                              style={{ width: year < currentYear ? '100%' : year === currentYear ? '50%' : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-200 mb-3">Understanding Your 9-Year Cycle</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your life unfolds in 9-year cycles, each year carrying unique energies and opportunities. 
                    The Personal Year Number reveals the main theme and focus for each year. Use this chart to 
                    understand past patterns, navigate the present, and plan for the future. The cycle repeats 
                    every 9 years, offering new lessons and growth opportunities at each stage.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Number Meanings Guide */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Number Meanings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {numerologyMeanings.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                      {item.number}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{item.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
