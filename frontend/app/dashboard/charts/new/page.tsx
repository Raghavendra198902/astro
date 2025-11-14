'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import chartsApi from '@/lib/api/charts';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

export default function NewChartPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Raaghevdndra Deshpande',
    birthDate: '1978-07-09',
    birthTime: '13:45',
    birthPlace: 'Aurangabad, Maharashtra, India',
    chartType: 'vedic',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create chart with backend API
      const chartData = await chartsApi.createChart({
        name: formData.name || 'Birth Chart',
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        birth_place: formData.birthPlace,
        latitude: 19.8762, // Aurangabad coordinates
        longitude: 75.3433,
        timezone: 'Asia/Kolkata',
        chart_type: formData.chartType as 'vedic' | 'western',
        house_system: formData.chartType === 'vedic' ? 'whole_sign' : 'placidus',
      });
      
      toast.success('Chart generated successfully! 🎉');
      router.push(`/dashboard/charts/${chartData.id}`);
    } catch (error: any) {
      console.error('Error generating chart:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate chart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate New Chart</h1>
        <p className="text-gray-600">Enter birth details to create an astrological chart</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
        {/* Chart Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Chart Type
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: 'vedic-north', label: 'Vedic (North Indian)', icon: '🔮' },
              { value: 'vedic-south', label: 'Vedic (South Indian)', icon: '📿' },
              { value: 'western', label: 'Western', icon: '⭐' },
            ].map((type) => (
              <label
                key={type.value}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.chartType === type.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <input
                  type="radio"
                  name="chartType"
                  value={type.value}
                  checked={formData.chartType === type.value}
                  onChange={(e) => setFormData({ ...formData, chartType: e.target.value })}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Chart Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Chart Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              id="name"
              placeholder="e.g., My Birth Chart"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
            Birth Date *
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Calendar className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="date"
              id="birthDate"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Birth Time */}
        <div>
          <label htmlFor="birthTime" className="block text-sm font-semibold text-gray-700 mb-2">
            Birth Time *
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Clock className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="time"
              id="birthTime"
              required
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Birth Place */}
        <div>
          <label htmlFor="birthPlace" className="block text-sm font-semibold text-gray-700 mb-2">
            Birth Place *
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
              type="text"
              id="birthPlace"
              required
              placeholder="e.g., Mumbai, India"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Enter city and country for accurate calculations</p>
        </div>

        {/* Info Box */}
        <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="text-sm text-violet-900">
              <p className="font-semibold mb-1">AI-Powered Interpretation</p>
              <p>Your chart will be analyzed by advanced AI models trained on ancient wisdom and modern techniques.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex-1 py-3.5 rounded-xl font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:scale-105 transition-transform"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Chart
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
