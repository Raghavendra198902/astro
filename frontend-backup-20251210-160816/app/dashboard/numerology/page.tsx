'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Calculator, Hash, Star, TrendingUp, Users, Heart, Briefcase, Plus, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';
import { toast } from 'sonner';

export default function NumerologyPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [activeTab, setActiveTab] = useState<'calculator' | 'reports'>('calculator');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate) {
      toast.error('Please enter both name and birth date');
      return;
    }
    
    try {
      setLoading(true);
      setResults(null);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_BASE_URL}/api/v1/numerology-test`, {
        params: {
          full_name: formData.name,
          birth_date: formData.birthDate,
          system: 'pythagorean'
        }
      });
      
      setResults(response.data);
      toast.success('Numerology calculated successfully!');
    } catch (err: any) {
      console.error('Error calculating numerology:', err);
      toast.error('Failed to calculate numerology. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      id: 1,
      name: 'Life Path Analysis',
      date: '2024-11-10',
      lifePathNumber: 7,
      destinyNumber: 3,
    },
    {
      id: 2,
      name: 'Personal Year Reading',
      date: '2024-11-05',
      lifePathNumber: 5,
      destinyNumber: 8,
    },
  ];

  const numerologyMeanings = [
    { number: 1, title: t?.numberOne || 'Number 1', meaning: t?.numberOneMeaning || 'Leadership and independence', icon: Star },
    { number: 2, title: t?.numberTwo || 'Number 2', meaning: t?.numberTwoMeaning || 'Cooperation and balance', icon: Users },
    { number: 3, title: t?.numberThree || 'Number 3', meaning: t?.numberThreeMeaning || 'Creativity and expression', icon: Sparkles },
    { number: 4, title: t?.numberFour || 'Number 4', meaning: t?.numberFourMeaning || 'Stability and foundation', icon: Briefcase },
    { number: 5, title: t?.numberFive || 'Number 5', meaning: t?.numberFiveMeaning || 'Freedom and adventure', icon: TrendingUp },
    { number: 6, title: t?.numberSix || 'Number 6', meaning: t?.numberSixMeaning || 'Harmony and responsibility', icon: Heart },
    { number: 7, title: t?.numberSeven || 'Number 7', meaning: t?.numberSevenMeaning || 'Wisdom and spirituality', icon: Star },
    { number: 8, title: t?.numberEight || 'Number 8', meaning: t?.numberEightMeaning || 'Power and abundance', icon: Briefcase },
    { number: 9, title: t?.numberNine || 'Number 9', meaning: t?.numberNineMeaning || 'Compassion and completion', icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600 dark:text-purple-400" strokeWidth={2} />
            {t?.numerology || 'Numerology'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t?.numerologyDescription || 'Discover the hidden meanings in numbers'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'calculator'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t?.calculator || 'Calculator'}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'reports'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t?.myReports || 'My Reports'}
        </button>
      </div>

      {activeTab === 'calculator' ? (
        <>
          {/* Calculator Form */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Hash className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              {t?.calculateNumbers || 'Calculate Your Numbers'}
            </h2>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t?.fullName || 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t?.enterFullName || 'Enter your full name'}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t?.dateOfBirth || 'Date of Birth'}
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  t?.calculate || 'Calculate'
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          {results && !results.error && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-200 dark:border-purple-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Your Numerology Profile
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Life Path Number */}
                {results.life_path && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
                    <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Life Path Number</div>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{results.life_path.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{results.life_path.meaning}</div>
                  </div>
                )}
                
                {/* Expression Number */}
                {results.expression && (
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-6 border-2 border-pink-200 dark:border-pink-700">
                    <div className="text-sm font-semibold text-pink-700 dark:text-pink-400 mb-2">Expression Number</div>
                    <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">{results.expression.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{results.expression.meaning}</div>
                  </div>
                )}
                
                {/* Soul Urge Number */}
                {results.soul_urge && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
                    <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Soul Urge Number</div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{results.soul_urge.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{results.soul_urge.meaning}</div>
                  </div>
                )}
                
                {/* Personality Number */}
                {results.personality && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Personality Number</div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{results.personality.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{results.personality.meaning}</div>
                  </div>
                )}
              </div>
              
              {/* Real Data Indicator */}
              <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Real numerology calculations based on your input</span>
                </div>
              </div>
            </div>
          )}

          {/* Number Meanings */}
          <div className="grid md:grid-cols-3 gap-6">
            {numerologyMeanings.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {item.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.meaning}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{report.name}</h3>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t.lifePathNumber}</span>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{report.lifePathNumber}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t.destinyNumber}</span>
                        <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{report.destinyNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{report.date}</p>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                      {t.view}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
