'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Heart, Plus, TrendingUp, Star } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

export default function CompatibilityPage() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const t = dashboardTranslations[language];

  useEffect(() => {
    setMounted(true);
  }, []);
  const reports = [
    {
      id: 1,
      name: 'John & Sarah',
      date: '2024-11-05',
      score: 85,
      type: 'Kundali Milan',
      status: 'Excellent Match',
    },
    {
      id: 2,
      name: 'Raj & Priya',
      date: '2024-11-01',
      score: 72,
      type: 'Western Synastry',
      status: 'Good Match',
    },
    {
      id: 3,
      name: 'Mike & Lisa',
      date: '2024-10-28',
      score: 68,
      type: 'Kundali Milan',
      status: 'Average Match',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="space-y-6">
      {/* Premium Header with Animation */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 dark:from-pink-700 dark:via-rose-700 dark:to-purple-800 p-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite]"></div>
        </div>
        {/* Pulsing Background Orb */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white animate-float" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                {t.compatibility || 'Compatibility Analysis'}
              </h1>
            </div>
            <p className="text-white/80 text-lg ml-15">Check relationship compatibility with Kundali Milan & Synastry</p>
          </div>
          <Link
            href="/dashboard/compatibility/new"
            className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-pink-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 duration-300 animate-bounce-subtle"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Premium Info Cards with Stagger Animation */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Heart, color: 'pink', label: 'Total Analyses', value: reports.length, delay: 0 },
          { icon: TrendingUp, color: 'green', label: 'Excellent Matches', value: reports.filter(r => r.score >= 80).length, delay: 100 },
          { icon: Star, color: 'yellow', label: 'Average Score', value: `${Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)}%`, delay: 200 }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            style={{ animationDelay: `${stat.delay}ms` }}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
          >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-100 dark:from-${stat.color}-900/30 dark:to-${stat.color}-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
              <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:animate-pulse`} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          </div>
        </div>
        ))}
      </div>

      {/* Premium Reports List with Stagger Animation */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <div
            key={report.id}
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-transparent hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Icon with Enhanced Animation */}
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg animate-float">
                    <Heart className="w-10 h-10 text-pink-600 dark:text-pink-400 group-hover:animate-pulse" strokeWidth={2.5} />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">{report.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold group-hover:scale-110 transition-transform duration-300">
                        {report.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold group-hover:scale-110 transition-transform duration-300">
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className={`px-8 py-4 rounded-2xl border-2 ${getScoreColor(report.score)} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <div className="text-4xl font-bold">{report.score}</div>
                    <div className="text-xs font-semibold mt-1">Compatibility</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/50 duration-300 animate-glow">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
