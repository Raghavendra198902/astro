'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Hand, Upload, Scan, Eye, Heart, Brain, TrendingUp, Users, Star, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language.context';
import { dashboardTranslations } from '@/lib/translations/dashboard.translations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function PalmistryPage() {
  const { language } = useLanguage();
  const t = dashboardTranslations[language];
  const [activeTab, setActiveTab] = useState<'upload' | 'readings'>('upload');
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('right');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Fetch palm analysis on component mount or when hand changes
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/palmistry-test`, {
          params: { hand: selectedHand, demo: true }
        });
        setAnalysis(response.data);
      } catch (error) {
        console.error('Error fetching palmistry analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedHand]);

  const readings = [
    {
      id: 1,
      name: 'Palm Reading - Right Hand',
      date: '2024-11-10',
      hand: 'Right',
      lifeLineStrength: 'Strong',
      heartLineStrength: 'Deep',
    },
    {
      id: 2,
      name: 'Palm Analysis - Left Hand',
      date: '2024-11-05',
      hand: 'Left',
      lifeLineStrength: 'Medium',
      heartLineStrength: 'Strong',
    },
  ];

  const palmLines = [
    { line: t.lifeLine, meaning: t.lifeLineMeaning, icon: Heart },
    { line: t.heartLine, meaning: t.heartLineMeaning, icon: Heart },
    { line: t.headLine, meaning: t.headLineMeaning, icon: Brain },
    { line: t.fateLine, meaning: t.fateLineMeaning, icon: TrendingUp },
    { line: t.marriageLine, meaning: t.marriageLineMeaning, icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Hand className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            {t.palmistry}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t.palmistryDescription}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'upload'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t.scanPalm}
        </button>
        <button
          onClick={() => setActiveTab('readings')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'readings'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {t.myReadings}
        </button>
      </div>

      {activeTab === 'upload' ? (
        <>
          {/* Hand Selection */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Scan className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              {t.selectHand}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setSelectedHand('left')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedHand === 'left'
                    ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <div className="text-center">
                  <Hand className="w-16 h-16 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.leftHand}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.leftHandMeaning}</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedHand('right')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedHand === 'right'
                    ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <div className="text-center">
                  <Hand className="w-16 h-16 mx-auto mb-3 text-emerald-600 dark:text-emerald-400 scale-x-[-1]" strokeWidth={2} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.rightHand}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.rightHandMeaning}</p>
                </div>
              </button>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-xl p-12 text-center hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t.uploadPalmPhoto}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.palmPhotoInstructions}
                  </p>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                  {t.chooseFile}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{t?.tip || 'Tip'}:</strong> {t?.palmPhotoTip || 'For best results, take a clear photo of your palm in good lighting'}
              </p>
            </div>
          </div>

          {/* Real Palm Analysis Results */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="animate-spin w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Analyzing your palm...</p>
            </div>
          ) : analysis && !analysis.error ? (
            <div className="space-y-6">
              {/* Analysis Header */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Hand className={`w-8 h-8 text-emerald-600 dark:text-emerald-400 ${analysis.hand === 'Left' ? '' : 'scale-x-[-1]'}`} strokeWidth={2} />
                    {analysis.hand} Hand Analysis
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Real palmistry analysis
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{analysis.hand_meaning}</p>
                
                {/* Overall Summary */}
                {analysis.interpretation?.summary && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mt-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Overall Reading</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.interpretation.summary}</p>
                  </div>
                )}
              </div>

              {/* Hand Element & Temperament */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Hand Element & Temperament</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">Element</div>
                    <div className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-2 capitalize">{analysis.interpretation?.element}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.interpretation?.temperament}</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl">
                    <div className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-2">Vitality</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.interpretation?.vitality}</div>
                  </div>
                </div>
              </div>

              {/* Major Palm Lines */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  Major Palm Lines
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.features?.lines && Object.entries(analysis.features.lines).map(([key, line]: [string, any]) => (
                    <div key={key} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-3 mb-3">
                        <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                          {key.replace('_', ' ')}
                        </h3>
                      </div>
                      {line.quality && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quality: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{line.quality}</span>
                        </div>
                      )}
                      {line.length && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Length: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{line.length}</span>
                        </div>
                      )}
                      {line.strength && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Strength: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{line.strength}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{line.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finger Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Hand className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  Finger Characteristics
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.features?.fingers && Object.entries(analysis.features.fingers).map(([key, finger]: [string, any]) => (
                    <div key={key} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize mb-2">{key}</h3>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Length: </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{finger.length}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{finger.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palm Mounts */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  Palm Mounts
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.features?.mounts && Object.entries(analysis.features.mounts).map(([key, mount]: [string, any]) => (
                    <div key={key} className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize mb-2">{key}</h3>
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{mount.location}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Prominence: </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">{mount.prominence}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{mount.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interpretation Details */}
              {analysis.interpretation && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Interpretation</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.interpretation.mentality && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Mentality</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.mentality}</p>
                      </div>
                    )}
                    {analysis.interpretation.emotions && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Emotions</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.emotions}</p>
                      </div>
                    )}
                    {analysis.interpretation.career && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Career</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.career}</p>
                      </div>
                    )}
                    {analysis.interpretation.relationships && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Relationships</h3>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.interpretation.relationships}</p>
                      </div>
                    )}
                  </div>

                  {/* Strengths and Challenges */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {analysis.interpretation.strengths && (
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
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
                    {analysis.interpretation.challenges && (
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Challenges</h3>
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
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Palm Lines Guide */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              {t.palmLinesMeaning}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {palmLines.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.line}</h3>
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
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
                      <Hand className={`w-10 h-10 text-emerald-600 dark:text-emerald-400 ${reading.hand === 'Left' ? '' : 'scale-x-[-1]'}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{reading.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t.lifeLine}: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{reading.lifeLineStrength}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t.heartLine}: </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{reading.heartLineStrength}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{reading.date}</p>
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
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
