'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Star,
  Clock,
  ArrowRight,
  Moon,
  Sun
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

interface Prediction {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: 'general' | 'love' | 'career' | 'health' | 'finance';
  date: string;
  prediction: string;
  accuracy: number;
  zodiacSign?: string;
}

export default function PredictionsPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  
  const [activeTab, setActiveTab] = useState<'get-prediction' | 'my-predictions'>('get-prediction');
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'love' | 'career' | 'health' | 'finance'>('general');

  // Mock previous predictions
  const predictions: Prediction[] = [
    {
      id: '1',
      type: 'daily',
      category: 'general',
      date: '2024-03-15',
      prediction: 'Today brings new opportunities for growth. Stay open to unexpected changes.',
      accuracy: 85,
      zodiacSign: 'Aries'
    },
    {
      id: '2',
      type: 'weekly',
      category: 'career',
      date: '2024-03-10',
      prediction: 'This week focuses on professional development. A mentor may offer guidance.',
      accuracy: 92,
      zodiacSign: 'Aries'
    },
    {
      id: '3',
      type: 'monthly',
      category: 'love',
      date: '2024-03-01',
      prediction: 'Romance blooms this month. Existing relationships deepen with understanding.',
      accuracy: 78,
      zodiacSign: 'Aries'
    }
  ];

  const predictionTypes = [
    { id: 'daily', label: t.daily, icon: Sun, description: t.dailyPredictionDesc },
    { id: 'weekly', label: t.weekly, icon: Calendar, description: t.weeklyPredictionDesc },
    { id: 'monthly', label: t.monthly, icon: Moon, description: t.monthlyPredictionDesc },
    { id: 'yearly', label: t.yearly, icon: Star, description: t.yearlyPredictionDesc }
  ];

  const categories = [
    { id: 'general', label: t.general, icon: Sparkles, color: 'purple' },
    { id: 'love', label: t.love, icon: Heart, color: 'pink' },
    { id: 'career', label: t.career, icon: Briefcase, color: 'blue' },
    { id: 'health', label: t.health, icon: TrendingUp, color: 'green' },
    { id: 'finance', label: t.finance, icon: TrendingUp, color: 'yellow' }
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      love: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
      career: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      health: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      finance: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
    };
    return colors[category] || colors.general;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily: t.daily,
      weekly: t.weekly,
      monthly: t.monthly,
      yearly: t.yearly
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: t.general,
      love: t.love,
      career: t.career,
      health: t.health,
      finance: t.finance
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          {t.predictions}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t.predictionsDescription}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('get-prediction')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'get-prediction'
                ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            {t.getPrediction}
          </button>
          <button
            onClick={() => setActiveTab('my-predictions')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'my-predictions'
                ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            {t.myPredictions}
          </button>
        </nav>
      </div>

      {/* Get Prediction Tab */}
      {activeTab === 'get-prediction' && (
        <div className="space-y-6">
          {/* Prediction Type Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.selectPredictionType}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {predictionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`
                      p-6 rounded-lg border-2 transition-all text-left
                      ${selectedType === type.id
                        ? 'border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                      }
                    `}
                  >
                    <Icon className={`h-8 w-8 mb-3 ${selectedType === type.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.selectCategory}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${selectedCategory === category.id
                        ? 'border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                      }
                    `}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${selectedCategory === category.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {category.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Birth Details Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.birthDetails}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.dateOfBirth}
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.timeOfBirth}
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.placeOfBirth}
                </label>
                <input
                  type="text"
                  placeholder={t.enterCity}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>

            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t.generatePrediction}
            </button>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  {t.predictionNote}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  {t.predictionNoteText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Predictions Tab */}
      {activeTab === 'my-predictions' && (
        <div className="space-y-4">
          {predictions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t.noPredictionsYet}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t.noPredictionsText}
              </p>
              <button
                onClick={() => setActiveTab('get-prediction')}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {t.getYourFirstPrediction}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(prediction.category)}`}>
                      {getCategoryLabel(prediction.category)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {getTypeLabel(prediction.type)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t.accuracy}
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {prediction.accuracy}%
                    </div>
                  </div>
                </div>

                <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                  {prediction.prediction}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(prediction.date).toLocaleDateString()}
                  </div>
                  {prediction.zodiacSign && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {prediction.zodiacSign}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
