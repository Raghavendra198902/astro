'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Video, Clock, Plus, User, Phone, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

export default function ConsultationsPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const consultations = [
    {
      id: 1,
      astrologer: 'Dr. Rajesh Sharma',
      specialty: 'Vedic Astrology',
      rating: 4.9,
      reviews: 234,
      date: '2024-11-15',
      time: '10:00 AM',
      duration: '60 min',
      type: 'video',
      status: 'upcoming',
      avatar: '👨‍🏫',
    },
    {
      id: 2,
      astrologer: 'Priya Devi',
      specialty: 'Tarot Reading',
      rating: 4.8,
      reviews: 189,
      date: '2024-11-18',
      time: '3:00 PM',
      duration: '45 min',
      type: 'voice',
      status: 'upcoming',
      avatar: '👩‍🏫',
    },
    {
      id: 3,
      astrologer: 'Amit Patel',
      specialty: 'Numerology',
      rating: 4.7,
      reviews: 156,
      date: '2024-11-05',
      time: '2:00 PM',
      duration: '60 min',
      type: 'video',
      status: 'completed',
      avatar: '🧑‍🏫',
    },
  ];

  const filteredConsultations = consultations.filter((c) => c.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Premium Header with Animation */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 dark:from-blue-700 dark:via-cyan-700 dark:to-indigo-800 p-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite]"></div>
        </div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                {t.consultations || 'Consultations'}
              </h1>
            </div>
            <p className="text-white/80 text-lg ml-15">Book and manage your astrology sessions</p>
          </div>
          <Link
            href="/dashboard/consultations/book"
            className="group px-6 py-3.5 bg-white hover:bg-gray-50 text-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Book Consultation
          </Link>
        </div>
      </div>

      {/* Premium Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 shadow-sm">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'cancelled'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Premium Consultations List with Stagger Animation */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation, index) => (
          <div
            key={consultation.id}
            style={{ animationDelay: `${(index + 2) * 100}ms` }}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer ${mounted ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-4'}`}
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4 flex-1">
                  {/* Avatar with Animation */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/50 animate-float">
                    {consultation.avatar}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{consultation.astrologer}</h3>
                      <div className={`p-2 rounded-xl ${consultation.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} group-hover:scale-110 transition-transform duration-300`}>
                        {consultation.type === 'video' ? (
                          <Video className={`w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse`} />
                        ) : (
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold group-hover:scale-110 transition-transform duration-300">
                        {consultation.specialty}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{consultation.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({consultation.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        {consultation.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        {consultation.time}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium group-hover:scale-110 transition-transform duration-300">
                        {consultation.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  {activeTab === 'upcoming' && (
                    <>
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 flex items-center justify-center gap-2 duration-300 animate-glow">
                        <Video className="w-4 h-4" />
                        Join Session
                      </button>
                      <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2">
                        Reschedule
                      </button>
                    </>
                  )}
                  {activeTab === 'completed' && (
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 duration-300">
                      <Star className="w-4 h-4 animate-spin-slow" />
                      Rate Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Empty State */}
      {filteredConsultations.length === 0 && (
        <div className="relative overflow-hidden text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl mb-6 shadow-lg">
              <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {activeTab === 'upcoming' ? 'No upcoming consultations' : `No ${activeTab} consultations`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              {activeTab === 'upcoming' ? 'Book a session with an expert astrologer' : 'You don\'t have any consultations in this category'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/dashboard/consultations/book"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                Book Consultation
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
