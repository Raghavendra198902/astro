'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Scan, Upload, Camera, Eye, Star, Users, Heart, Brain, Plus, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FaceReadingPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [activeTab, setActiveTab] = useState<'upload' | 'readings'>('upload');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Fetch face analysis on component mount
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/face-reading-test`, {
          params: { demo: true }
        });
        setAnalysis(response.data);
      } catch (error) {
        console.error('Error fetching face reading analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const readings = [
    {
      id: 1,
      name: 'Face Analysis - John',
      date: '2024-11-10',
      personality: 'Leader',
      characteristics: ['Confident', 'Ambitious', 'Charismatic'],
    },
    {
      id: 2,
      name: 'Face Reading - Sarah',
      date: '2024-11-05',
      personality: 'Creative',
      characteristics: ['Artistic', 'Intuitive', 'Empathetic'],
    },
  ];

  const faceFeatures = [
    { feature: t.forehead, meaning: t.foreheadMeaning, icon: Brain },
    { feature: t.eyes, meaning: t.eyesMeaning, icon: Eye },
    { feature: t.nose, meaning: t.noseMeaning, icon: Star },
    { feature: t.mouth, meaning: t.mouthMeaning, icon: Heart },
    { feature: t.jawline, meaning: t.jawlineMeaning, icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Scan className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            {t.faceReading}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t.faceReadingDescription}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t.uploadPhoto}
        </button>
        <button
          onClick={() => setActiveTab('readings')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'readings'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t.myReadings}
        </button>
      </div>

      {activeTab === 'upload' ? (
        <>
          {/* Upload Section */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t.uploadYourPhoto}
            </h2>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t.dragDropPhoto}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.supportedFormats}
                  </p>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                  {t.chooseFile}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>{t?.note || 'Note'}:</strong> {t?.faceReadingNote || 'Face reading is for entertainment and self-reflection purposes'}
              </p>
            </div>
          </div>

          {/* Real Face Reading Analysis Results */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Analyzing facial features...</p>
            </div>
          ) : analysis && !analysis.error ? (
            <div className="space-y-6">
              {/* Analysis Header */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Scan className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    Face Reading Analysis
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Real face reading analysis
                    </span>
                  </div>
                </div>
                
                {/* Overall Summary */}
                {analysis.interpretation?.summary && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Overall Reading</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.interpretation.summary}</p>
                  </div>
                )}
              </div>

              {/* Face Shape & Personality */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Face Shape & Personality</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Face Shape</div>
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 capitalize">{analysis.features?.face_shape}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.interpretation?.personality}</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                    <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Confidence</div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {Math.round((analysis.confidence || 0.85) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Based on {analysis.landmarks_count || 468} facial landmarks
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Features Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Facial Features Analysis
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Forehead */}
                  {analysis.features?.forehead && (
                    <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Forehead</h3>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Type: </span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400 capitalize">{analysis.features.forehead.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.forehead.meaning}</p>
                    </div>
                  )}

                  {/* Eyebrows */}
                  {analysis.features?.eyebrows && (
                    <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border-2 border-sky-200 dark:border-sky-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Eyebrows</h3>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Shape: </span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400 capitalize">{analysis.features.eyebrows.shape}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.eyebrows.meaning}</p>
                    </div>
                  )}

                  {/* Eyes */}
                  {analysis.features?.eyes && (
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Eyes</h3>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Size: </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{analysis.features.eyes.size}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Distance: </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{analysis.features.eyes.distance}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.eyes.meaning}</p>
                    </div>
                  )}

                  {/* Nose */}
                  {analysis.features?.nose && (
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Nose</h3>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Length: </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">{analysis.features.nose.length}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Shape: </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">{analysis.features.nose.shape}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.nose.meaning}</p>
                    </div>
                  )}

                  {/* Mouth */}
                  {analysis.features?.mouth && (
                    <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border-2 border-rose-200 dark:border-rose-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mouth</h3>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Size: </span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400 capitalize">{analysis.features.mouth.size}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.mouth.meaning}</p>
                    </div>
                  )}

                  {/* Chin */}
                  {analysis.features?.chin && (
                    <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Chin</h3>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Shape: </span>
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400 capitalize">{analysis.features.chin.shape}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.features.chin.meaning}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Traits */}
              {analysis.interpretation?.character_traits && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Character Traits
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(analysis.interpretation.character_traits).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 capitalize">{key}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Life Areas */}
              {analysis.interpretation?.life_areas && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Life Areas</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(analysis.interpretation.life_areas).map(([key, value]) => (
                      <div key={key} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 capitalize flex items-center gap-2">
                          {key === 'career' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                          {key === 'relationships' && <Users className="w-5 h-5 text-rose-500" />}
                          {key === 'health' && <Heart className="w-5 h-5 text-green-500" />}
                          {key === 'wealth' && <Star className="w-5 h-5 text-yellow-500" />}
                          {key}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths, Challenges, and Recommendations */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Strengths */}
                {analysis.interpretation?.strengths && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-500" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.interpretation.strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-green-500 mt-1">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Challenges */}
                {analysis.interpretation?.challenges && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Challenges</h3>
                    <ul className="space-y-2">
                      {analysis.interpretation.challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-amber-500 mt-1">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.interpretation?.recommendations && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysis.interpretation.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-500 mt-1">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Detailed Interpretation */}
              {analysis.interpretation && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Interpretation</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.interpretation.intellect && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Intellect</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.intellect}</p>
                      </div>
                    )}
                    {analysis.interpretation.perception && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Perception</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.perception}</p>
                      </div>
                    )}
                    {analysis.interpretation.ambition && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Ambition</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.ambition}</p>
                      </div>
                    )}
                    {analysis.interpretation.communication && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Communication</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.communication}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Face Features Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t.faceFeaturesMeaning}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faceFeatures.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.feature}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.meaning}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Readings List */}
          <div className="space-y-4">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{reading.name}</h3>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t.personality}: </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{reading.personality}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {reading.characteristics.map((char, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{reading.date}</p>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      {t.viewDetails}
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
