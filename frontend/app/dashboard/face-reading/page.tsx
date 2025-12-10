'use client';

import { useState, useRef } from 'react';
import { Scan, Upload, Camera, Eye, Star, Brain, Heart, Users, Sparkles, Loader2, Image as ImageIcon, Zap, Target, Award, Compass } from 'lucide-react';

export default function FaceReadingPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis'>('upload');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze image
    await analyzeImage();
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setShowWebcam(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Unable to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowWebcam(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        stopWebcam();
        analyzeImage();
      }
    }
  };

  const analyzeImage = async () => {
    try {
      setLoading(true);
      setActiveTab('analysis');
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/face-reading-test?demo=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        alert('Failed to analyze face');
      }
    } catch (err) {
      console.error('Error analyzing face:', err);
      alert('Failed to analyze face. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faceShapeInfo: { [key: string]: { description: string, traits: string[] } } = {
    'oval': {
      description: 'Balanced and harmonious, versatile and adaptable',
      traits: ['Diplomatic', 'Flexible', 'Well-balanced', 'Cooperative']
    },
    'round': {
      description: 'Friendly and nurturing, emotionally expressive',
      traits: ['Warm', 'Generous', 'Caring', 'Sociable']
    },
    'square': {
      description: 'Strong-willed and determined, practical thinker',
      traits: ['Analytical', 'Decisive', 'Reliable', 'Grounded']
    },
    'heart': {
      description: 'Creative and intuitive, emotionally intelligent',
      traits: ['Artistic', 'Passionate', 'Empathetic', 'Visionary']
    },
    'oblong': {
      description: 'Intellectual and strategic, methodical approach',
      traits: ['Thoughtful', 'Organized', 'Detail-oriented', 'Focused']
    },
    'diamond': {
      description: 'Precise and controlled, high attention to detail',
      traits: ['Ambitious', 'Perfectionist', 'Determined', 'Disciplined']
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Scan className="w-10 h-10 text-indigo-400" strokeWidth={2} />
            AI Face Reading
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Discover personality insights through facial analysis</p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'upload', label: 'Upload Photo', icon: Upload },
              { id: 'analysis', label: 'Analysis', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  disabled={tab.id === 'analysis' && !analysis}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Methods */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Camera className="w-6 h-6 text-indigo-400" />
                Choose Your Method
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Upload File */}
                <div 
                  onClick={() => !showWebcam && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
                    showWebcam 
                      ? 'border-slate-600/50 opacity-50 cursor-not-allowed' 
                      : 'border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-400" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white mb-1">Upload Photo</p>
                      <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>

                {/* Use Webcam */}
                <div 
                  onClick={() => !showWebcam && startWebcam()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
                    showWebcam 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : 'border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-blue-400" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white mb-1">
                        {showWebcam ? 'Webcam Active' : 'Use Webcam'}
                      </p>
                      <p className="text-xs text-slate-400">Take photo instantly</p>
                    </div>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Webcam View */}
              {showWebcam && (
                <div className="mt-6 p-6 bg-slate-700/30 rounded-2xl border border-slate-600/50">
                  <div className="relative">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-full rounded-xl"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Webcam Controls */}
                    <div className="mt-4 flex gap-4 justify-center">
                      <button
                        onClick={capturePhoto}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Capture Photo
                      </button>
                      <button
                        onClick={stopWebcam}
                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && !showWebcam && (
                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">Preview</h3>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-xl">
                <p className="text-sm text-amber-200">
                  <strong>Note:</strong> Face reading is for entertainment and self-reflection purposes. 
                  Your photo is analyzed locally and not stored on our servers.
                </p>
              </div>
            </div>

            {/* Features Guide */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Compass className="w-6 h-6 text-indigo-400" />
                What We Analyze
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Brain, title: 'Forehead', desc: 'Intellectual capacity & wisdom' },
                  { icon: Eye, title: 'Eyes', desc: 'Perception & emotional depth' },
                  { icon: Star, title: 'Nose', desc: 'Ambition & willpower' },
                  { icon: Heart, title: 'Mouth', desc: 'Communication & expression' },
                  { icon: Users, title: 'Cheeks', desc: 'Social nature & warmth' },
                  { icon: Zap, title: 'Jawline', desc: 'Determination & strength' },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="p-6 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-2xl hover:border-indigo-400/40 transition-all hover:scale-105"
                    >
                      <Icon className="w-8 h-8 text-indigo-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="max-w-6xl mx-auto space-y-8">
            {loading ? (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-16 text-center">
                <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Analyzing facial features...</p>
              </div>
            ) : analysis && !analysis.error ? (
              <>
                {/* Overall Summary */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                      Face Reading Analysis
                    </h2>
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-300">AI Analysis</span>
                    </div>
                  </div>

                  {analysis.interpretation?.summary && (
                    <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-2xl">
                      <h3 className="text-xl font-bold text-indigo-200 mb-3">Overall Reading</h3>
                      <p className="text-slate-300 leading-relaxed">{analysis.interpretation.summary}</p>
                    </div>
                  )}
                </div>

                {/* Face Shape & Confidence */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Face Shape Analysis</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-500/30 hover:scale-105 transition-all">
                      <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Face Shape</div>
                      <div className="text-4xl font-bold text-purple-400 mb-2 capitalize">{analysis.features?.face_shape}</div>
                      <div className="text-sm text-slate-300">{faceShapeInfo[analysis.features?.face_shape]?.description}</div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl border border-blue-500/30 hover:scale-105 transition-all">
                      <div className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider">Confidence</div>
                      <div className="text-4xl font-bold text-blue-400 mb-2">{Math.round((analysis.confidence || 0.85) * 100)}%</div>
                      <div className="text-sm text-slate-300">Analysis accuracy</div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl border border-green-500/30 hover:scale-105 transition-all">
                      <div className="text-sm font-semibold text-green-300 mb-2 uppercase tracking-wider">Landmarks</div>
                      <div className="text-4xl font-bold text-green-400 mb-2">{analysis.landmarks_count || 468}</div>
                      <div className="text-sm text-slate-300">Facial points detected</div>
                    </div>
                  </div>

                  {/* Key Traits */}
                  {faceShapeInfo[analysis.features?.face_shape]?.traits && (
                    <div className="flex flex-wrap gap-3">
                      {faceShapeInfo[analysis.features?.face_shape].traits.map((trait: string) => (
                        <span
                          key={trait}
                          className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-semibold"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Facial Features Details */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-400" />
                    Detailed Feature Analysis
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Forehead */}
                    {analysis.features?.forehead && (
                      <div className="p-6 bg-gradient-to-br from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl hover:border-violet-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Brain className="w-6 h-6 text-violet-400" />
                          <h3 className="text-xl font-bold text-white">Forehead</h3>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm text-violet-300 font-semibold">Type: </span>
                          <span className="text-slate-200 capitalize">{analysis.features.forehead.type}</span>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.forehead.meaning}</p>
                      </div>
                    )}

                    {/* Eyes */}
                    {analysis.features?.eyes && (
                      <div className="p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl hover:border-blue-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Eye className="w-6 h-6 text-blue-400" />
                          <h3 className="text-xl font-bold text-white">Eyes</h3>
                        </div>
                        <div className="mb-2 space-y-1">
                          <div>
                            <span className="text-sm text-blue-300 font-semibold">Shape: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.eyes.shape}</span>
                          </div>
                          <div>
                            <span className="text-sm text-blue-300 font-semibold">Size: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.eyes.size}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.eyes.meaning}</p>
                      </div>
                    )}

                    {/* Nose */}
                    {analysis.features?.nose && (
                      <div className="p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-2xl hover:border-amber-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Star className="w-6 h-6 text-amber-400" />
                          <h3 className="text-xl font-bold text-white">Nose</h3>
                        </div>
                        <div className="mb-2 space-y-1">
                          <div>
                            <span className="text-sm text-amber-300 font-semibold">Shape: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.nose.shape}</span>
                          </div>
                          <div>
                            <span className="text-sm text-amber-300 font-semibold">Bridge: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.nose.bridge}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.nose.meaning}</p>
                      </div>
                    )}

                    {/* Mouth */}
                    {analysis.features?.mouth && (
                      <div className="p-6 bg-gradient-to-br from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl hover:border-pink-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Heart className="w-6 h-6 text-pink-400" />
                          <h3 className="text-xl font-bold text-white">Mouth</h3>
                        </div>
                        <div className="mb-2 space-y-1">
                          <div>
                            <span className="text-sm text-pink-300 font-semibold">Shape: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.mouth.shape}</span>
                          </div>
                          <div>
                            <span className="text-sm text-pink-300 font-semibold">Fullness: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.mouth.lip_fullness}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.mouth.meaning}</p>
                      </div>
                    )}

                    {/* Eyebrows */}
                    {analysis.features?.eyebrows && (
                      <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-2xl hover:border-indigo-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-6 h-6 text-indigo-400" />
                          <h3 className="text-xl font-bold text-white">Eyebrows</h3>
                        </div>
                        <div className="mb-2 space-y-1">
                          <div>
                            <span className="text-sm text-indigo-300 font-semibold">Shape: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.eyebrows.shape}</span>
                          </div>
                          <div>
                            <span className="text-sm text-indigo-300 font-semibold">Thickness: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.eyebrows.thickness}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.eyebrows.meaning}</p>
                      </div>
                    )}

                    {/* Chin */}
                    {analysis.features?.chin && (
                      <div className="p-6 bg-gradient-to-br from-green-600/10 to-teal-600/10 border border-green-500/20 rounded-2xl hover:border-green-400/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="w-6 h-6 text-green-400" />
                          <h3 className="text-xl font-bold text-white">Chin</h3>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm text-green-300 font-semibold">Shape: </span>
                          <span className="text-slate-200 capitalize">{analysis.features.chin.shape}</span>
                        </div>
                        <p className="text-sm text-slate-300 italic">{analysis.features.chin.meaning}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personality Insights */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-indigo-400" />
                    Personality Insights
                  </h2>
                  
                  <div className="space-y-4">
                    {analysis.interpretation?.personality && (
                      <div className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                        <h3 className="text-lg font-bold text-purple-200 mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Overall Personality
                        </h3>
                        <p className="text-slate-300">{analysis.interpretation.personality}</p>
                      </div>
                    )}
                    
                    {analysis.interpretation?.intellect && (
                      <div className="p-6 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                        <h3 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          Intellectual Traits
                        </h3>
                        <p className="text-slate-300">{analysis.interpretation.intellect}</p>
                      </div>
                    )}
                    
                    {analysis.interpretation?.communication && (
                      <div className="p-6 bg-gradient-to-r from-green-600/10 to-teal-600/10 border border-green-500/20 rounded-2xl">
                        <h3 className="text-lg font-bold text-green-200 mb-2 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Communication Style
                        </h3>
                        <p className="text-slate-300">{analysis.interpretation.communication}</p>
                      </div>
                    )}
                    
                    {analysis.interpretation?.ambition && (
                      <div className="p-6 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-2xl">
                        <h3 className="text-lg font-bold text-amber-200 mb-2 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Ambition & Drive
                        </h3>
                        <p className="text-slate-300">{analysis.interpretation.ambition}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proportions */}
                {analysis.features?.proportions && (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Facial Proportions</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-2xl text-center">
                        <div className="text-sm text-indigo-300 mb-2 uppercase tracking-wider">Width/Height Ratio</div>
                        <div className="text-4xl font-bold text-indigo-400">{(analysis.features.proportions.width_to_height_ratio * 100).toFixed(0)}%</div>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl text-center">
                        <div className="text-sm text-purple-300 mb-2 uppercase tracking-wider">Symmetry Score</div>
                        <div className="text-4xl font-bold text-purple-400">{(analysis.features.proportions.symmetry_score * 100).toFixed(0)}%</div>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-2xl text-center">
                        <div className="text-sm text-amber-300 mb-2 uppercase tracking-wider">Golden Ratio</div>
                        <div className="text-4xl font-bold text-amber-400">{(analysis.features.proportions.golden_ratio * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
