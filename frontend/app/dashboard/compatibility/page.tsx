'use client';

import { useState } from 'react';
import { Heart, Users, Star, Sparkles, TrendingUp, Target, Award, Zap, Crown, Loader2, Calendar, MapPin, Clock } from 'lucide-react';

export default function CompatibilityPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [person1, setPerson1] = useState({
    name: '',
    date: '',
    time: '',
    latitude: '',
    longitude: '',
  });
  const [person2, setPerson2] = useState({
    name: '',
    date: '',
    time: '',
    latitude: '',
    longitude: '',
  });

  const analyzeCompatibility = async () => {
    if (!person1.name || !person1.date || !person2.name || !person2.date) {
      alert('Please fill in all required fields for both persons');
      return;
    }

    try {
      setLoading(true);
      
      // Mock compatibility analysis (in production, this would call the backend)
      setTimeout(() => {
        const mockAnalysis = {
          overall_score: 28,
          max_score: 36,
          percentage: 77.8,
          compatibility_level: 'Very Good',
          kootas: {
            varna: { score: 1, max: 1, meaning: 'Spiritual compatibility - Excellent', compatible: true },
            vashya: { score: 2, max: 2, meaning: 'Mutual attraction & control - Perfect', compatible: true },
            tara: { score: 2, max: 3, meaning: 'Birth star compatibility - Good', compatible: true },
            yoni: { score: 3, max: 4, meaning: 'Physical & sexual compatibility - Good', compatible: true },
            graha_maitri: { score: 4, max: 5, meaning: 'Mental compatibility - Very Good', compatible: true },
            gana: { score: 5, max: 6, meaning: 'Temperament match - Excellent', compatible: true },
            bhakoot: { score: 7, max: 7, meaning: 'Emotional compatibility - Perfect', compatible: true },
            nadi: { score: 4, max: 8, meaning: 'Health & progeny - Average', compatible: false },
          },
          mangal_dosha: {
            person1: { present: false, severity: 'none' },
            person2: { present: true, severity: 'low' },
            cancelled: true,
            remedy: 'Perform Mars remedies on Tuesdays'
          },
          synastry_aspects: [
            { planets: 'Sun-Moon', aspect: 'Trine', angle: 120, meaning: 'Harmonious emotional connection' },
            { planets: 'Venus-Mars', aspect: 'Conjunction', angle: 5, meaning: 'Strong romantic attraction' },
            { planets: 'Moon-Mercury', aspect: 'Sextile', angle: 60, meaning: 'Good communication' },
            { planets: 'Jupiter-Venus', aspect: 'Square', angle: 90, meaning: 'Different values, needs balance' },
          ],
          strengths: [
            'Strong emotional and spiritual connection',
            'Excellent temperament compatibility',
            'Good mental and intellectual harmony',
            'Mutual attraction and respect'
          ],
          challenges: [
            'Different approaches to health and lifestyle',
            'Need to balance individual values',
            'Minor Mars affliction - easily remedied'
          ],
          recommendations: [
            'Perform compatibility-enhancing rituals',
            'Mars remedies for better harmony',
            'Regular communication about values',
            'Respect individual differences'
          ]
        };
        
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error('Error analyzing compatibility:', err);
      alert('Failed to analyze compatibility. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-blue-500 to-cyan-500';
    if (percentage >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Excellent' || level === 'Very Good') return 'text-green-400';
    if (level === 'Good' || level === 'Average') return 'text-blue-400';
    if (level === 'Fair') return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-rose-200 to-pink-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Heart className="w-10 h-10 text-rose-400" strokeWidth={2} />
            Relationship Compatibility
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Vedic & Western astrology compatibility analysis</p>
        </div>

        {/* Input Forms */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Person 1 */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-rose-400" />
              Person 1
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={person1.name}
                  onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={person1.date}
                  onChange={(e) => setPerson1({ ...person1, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Birth Time (Optional)
                </label>
                <input
                  type="time"
                  value={person1.time}
                  onChange={(e) => setPerson1({ ...person1, time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person1.latitude}
                    onChange={(e) => setPerson1({ ...person1, latitude: e.target.value })}
                    placeholder="28.6139"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person1.longitude}
                    onChange={(e) => setPerson1({ ...person1, longitude: e.target.value })}
                    placeholder="77.2090"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-pink-400" />
              Person 2
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={person2.name}
                  onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={person2.date}
                  onChange={(e) => setPerson2({ ...person2, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Birth Time (Optional)
                </label>
                <input
                  type="time"
                  value={person2.time}
                  onChange={(e) => setPerson2({ ...person2, time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person2.latitude}
                    onChange={(e) => setPerson2({ ...person2, latitude: e.target.value })}
                    placeholder="28.6139"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={person2.longitude}
                    onChange={(e) => setPerson2({ ...person2, longitude: e.target.value })}
                    placeholder="77.2090"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-600/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={analyzeCompatibility}
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-rose-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Compatibility...
              </>
            ) : (
              <>
                <Heart className="w-6 h-6" />
                Analyze Compatibility
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Award className="w-8 h-8 text-rose-400" />
                Compatibility Score
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-rose-600/20 to-pink-600/20 rounded-2xl border border-rose-500/30 text-center">
                  <div className="text-sm font-semibold text-rose-300 mb-2 uppercase tracking-wider">Overall Score</div>
                  <div className="text-6xl font-bold text-rose-400 mb-2">{analysis.overall_score}/{analysis.max_score}</div>
                  <div className="text-sm text-slate-300">Guna Milan Points</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-500/30 text-center">
                  <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Percentage</div>
                  <div className="text-6xl font-bold text-purple-400 mb-2">{analysis.percentage}%</div>
                  <div className="text-sm text-slate-300">Compatibility Match</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 text-center">
                  <div className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">Level</div>
                  <div className={`text-4xl font-bold mb-2 ${getLevelColor(analysis.compatibility_level)}`}>
                    {analysis.compatibility_level}
                  </div>
                  <div className="text-sm text-slate-300">Relationship Quality</div>
                </div>
              </div>
            </div>

            {/* 8 Kootas Breakdown */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-rose-400" />
                Ashta Koota (8 Factors) Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(analysis.kootas).map(([name, data]: [string, any]) => (
                  <div key={name} className="p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">{name.replace('_', ' ')}</h3>
                      <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getScoreColor(data.score, data.max)} text-white font-bold`}>
                        {data.score}/{data.max}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{data.meaning}</p>
                    <div className="mt-3">
                      {data.compatible ? (
                        <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded-full">✓ Compatible</span>
                      ) : (
                        <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full">⚠ Needs Attention</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mangal Dosha */}
            {analysis.mangal_dosha && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-400" />
                  Mangal Dosha (Mars Affliction)
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                    <h3 className="text-lg font-bold text-blue-200 mb-3">{person1.name || 'Person 1'}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-blue-300 font-semibold">Status: </span>
                        <span className="text-slate-200">
                          {analysis.mangal_dosha.person1.present ? 'Present' : 'Not Present'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-blue-300 font-semibold">Severity: </span>
                        <span className="text-slate-200 capitalize">{analysis.mangal_dosha.person1.severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                    <h3 className="text-lg font-bold text-pink-200 mb-3">{person2.name || 'Person 2'}</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-pink-300 font-semibold">Status: </span>
                        <span className="text-slate-200">
                          {analysis.mangal_dosha.person2.present ? 'Present' : 'Not Present'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-pink-300 font-semibold">Severity: </span>
                        <span className="text-slate-200 capitalize">{analysis.mangal_dosha.person2.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {analysis.mangal_dosha.cancelled && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-green-300 text-sm">
                      ✓ Mangal Dosha is cancelled or balanced between both partners. No major concern.
                    </p>
                  </div>
                )}

                {analysis.mangal_dosha.remedy && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-amber-200 text-sm">
                      <strong>Remedy:</strong> {analysis.mangal_dosha.remedy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Synastry Aspects */}
            {analysis.synastry_aspects && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-400" />
                  Planetary Synastry
                </h2>

                <div className="space-y-4">
                  {analysis.synastry_aspects.map((aspect: any, idx: number) => (
                    <div key={idx} className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-purple-200">{aspect.planets}</h3>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                          {aspect.aspect} ({aspect.angle}°)
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{aspect.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths, Challenges, Recommendations */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Crown className="w-6 h-6 text-green-400" />
                  Strengths
                </h2>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                  Challenges
                </h2>
                <ul className="space-y-3">
                  {analysis.challenges.map((challenge: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-amber-400 mt-1">⚠</span>
                      <span className="text-slate-300 text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Advice
                </h2>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">💡</span>
                      <span className="text-slate-300 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
