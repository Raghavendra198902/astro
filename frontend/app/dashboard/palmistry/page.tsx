'use client';

import { useState, useRef, useEffect } from 'react';
import { Hand, Upload, Camera, Heart, Brain, Star, TrendingUp, Users, Zap, Loader2, Target, Award, Compass, Crown, Sparkles, History, Trash2 } from 'lucide-react';
import { API_URL } from '@/app/config';
import PDFExporter from '@/app/components/PDFExporter';

interface PalmReadingHistory {
  id: string;
  timestamp: string;
  thumbnail: string;
  hand: 'left' | 'right';
  lines?: any;
  mounts?: any;
}

export default function PalmistryPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis'>('upload');
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('right');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [history, setHistory] = useState<PalmReadingHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('palmReadingHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save to history
  const saveToHistory = (result: any, image: string) => {
    const newEntry: PalmReadingHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      thumbnail: image,
      hand: selectedHand,
      lines: result.lines,
      mounts: result.mounts
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('palmReadingHistory', JSON.stringify(updatedHistory));
  };

  // Load from history
  const loadFromHistory = (entry: PalmReadingHistory) => {
    setImagePreview(entry.thumbnail);
    setSelectedHand(entry.hand);
    if (entry.lines || entry.mounts) {
      setAnalysis({
        lines: entry.lines,
        mounts: entry.mounts
      });
      setActiveTab('analysis');
    }
    setShowHistory(false);
  };

  // Delete history entry
  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('palmReadingHistory', JSON.stringify(updatedHistory));
  };

  // Clear all history
  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all palm reading history?')) {
      setHistory([]);
      localStorage.removeItem('palmReadingHistory');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await analyzeHand(file);
  };

  const startWebcam = async () => {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isNetworkAccess = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const message = isNetworkAccess 
          ? 'Camera access requires HTTPS or localhost. Please access via http://localhost:3000 instead of the IP address, or use the "Upload Image" option instead.'
          : 'Your browser does not support camera access. Please use the "Upload Image" option instead.';
        alert(message);
        return;
      }

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      console.log('Camera stream obtained:', mediaStream);
      console.log('Video tracks:', mediaStream.getVideoTracks());
      
      setStream(mediaStream);
      setShowWebcam(true);
      
      // Wait for next tick to ensure state is updated
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting video srcObject');
          videoRef.current.srcObject = mediaStream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, playing...');
            videoRef.current?.play().catch(e => console.error('Play error:', e));
          };
        } else {
          console.error('Video ref not available');
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      const isNetworkAccess = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const message = isNetworkAccess
        ? 'Camera access blocked. Please access via http://localhost:3000 or use the "Upload Image" option.'
        : 'Unable to access webcam. Please check camera permissions in your browser settings or use the "Upload Image" option.';
      alert(message);
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
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'palm-capture.jpg', { type: 'image/jpeg' });
            analyzeHand(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const analyzeHand = async (imageFile?: File) => {
    try {
      setLoading(true);
      setActiveTab('analysis');
      
      if (!imageFile) {
        alert('No image provided');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to use this feature');
        window.location.href = '/auth/login';
        return;
      }
      
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('user_consent', 'true');
      
      const response = await fetch(`${API_URL}/api/v1/vision/palm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis_data);
        
        // Save to history with image
        if (imagePreview) {
          saveToHistory(data.analysis_data, imagePreview);
        }
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to analyze palm');
      }
    } catch (err) {
      console.error('Error analyzing palm:', err);
      alert('Failed to analyze palm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handShapeInfo: { [key: string]: { description: string, traits: string[] } } = {
    'earth': {
      description: 'Square palm, short fingers - practical and grounded',
      traits: ['Practical', 'Reliable', 'Hardworking', 'Stable']
    },
    'air': {
      description: 'Square palm, long fingers - intellectual and communicative',
      traits: ['Analytical', 'Curious', 'Social', 'Adaptable']
    },
    'water': {
      description: 'Rectangular palm, long fingers - emotional and intuitive',
      traits: ['Creative', 'Empathetic', 'Sensitive', 'Artistic']
    },
    'fire': {
      description: 'Rectangular palm, short fingers - passionate and energetic',
      traits: ['Energetic', 'Spontaneous', 'Confident', 'Bold']
    }
  };

  const majorLines = [
    { name: 'Life Line', description: 'Vitality and life energy', icon: Heart },
    { name: 'Head Line', description: 'Intellect and thinking style', icon: Brain },
    { name: 'Heart Line', description: 'Emotions and relationships', icon: Heart },
    { name: 'Fate Line', description: 'Life path and career', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 p-4 md:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-green-200 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Hand className="w-10 h-10 text-emerald-400" strokeWidth={2} />
            AI Palm Reading
          </h1>
          <p className="text-slate-400 mt-4 text-lg">Discover your destiny through the ancient art of palmistry</p>
          
          {/* History Button */}
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="mt-4 px-6 py-2 rounded-xl font-semibold bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-all inline-flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              View History ({history.length})
            </button>
          )}
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  Recent Palm Readings
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative group cursor-pointer"
                    onClick={() => loadFromHistory(entry)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700 group-hover:border-emerald-500 transition-all">
                      <img
                        src={entry.thumbnail}
                        alt={`${entry.hand} hand`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-end p-2">
                      <div className="text-xs text-emerald-300 font-semibold capitalize mb-1">
                        {entry.hand} Hand
                      </div>
                      <div className="text-xs text-white">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryEntry(entry.id);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hand Selection */}
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 text-center">Select Hand to Analyze</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'left', label: 'Left Hand', desc: 'Potential & Inner Self' },
              { id: 'right', label: 'Right Hand', desc: 'Reality & Choices' },
            ].map((hand) => (
              <button
                key={hand.id}
                onClick={() => setSelectedHand(hand.id as any)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  selectedHand === hand.id
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700/30 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <div className="text-lg">{hand.label}</div>
                <div className="text-xs mt-1 opacity-80">{hand.desc}</div>
              </button>
            ))}
          </div>
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
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30'
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
                <Camera className="w-6 h-6 text-emerald-400" />
                Capture Your Palm
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Upload File */}
                <div 
                  onClick={() => !showWebcam && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
                    showWebcam 
                      ? 'border-slate-600/50 opacity-50 cursor-not-allowed' 
                      : 'border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-emerald-400" strokeWidth={2} />
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
                      : 'border-green-500/50 hover:border-green-400 hover:bg-green-500/5'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-green-400" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white mb-1">
                        {showWebcam ? 'Webcam Active' : 'Use Webcam'}
                      </p>
                      <p className="text-xs text-slate-400">Capture instantly</p>
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
                      muted
                      className="w-full rounded-xl bg-black"
                      style={{ minHeight: '400px', maxHeight: '600px', objectFit: 'contain' }}
                      onLoadedMetadata={(e) => {
                        console.log('Video element loaded metadata');
                        const video = e.target as HTMLVideoElement;
                        console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                      }}
                      onPlay={() => console.log('Video started playing')}
                      onError={(e) => console.error('Video element error:', e)}
                    />
                    <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Webcam Active
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="mt-4 flex gap-4 justify-center">
                      <button
                        onClick={capturePhoto}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Capture Palm
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
                    <h3 className="text-white font-semibold">Preview - {selectedHand.charAt(0).toUpperCase() + selectedHand.slice(1)} Hand</h3>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <img src={imagePreview} alt="Palm Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-xl">
                <p className="text-sm text-amber-200">
                  <strong>Tip:</strong> For best results, photograph your palm in good lighting with fingers slightly apart. 
                  The {selectedHand} hand shows your {selectedHand === 'right' ? 'current reality and conscious choices' : 'potential and inner self'}.
                </p>
              </div>
            </div>

            {/* Palm Reading Guide */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Compass className="w-6 h-6 text-emerald-400" />
                Major Palm Lines
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {majorLines.map((line) => {
                  const Icon = line.icon;
                  return (
                    <div
                      key={line.name}
                      className="p-6 bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/20 rounded-2xl hover:border-emerald-400/40 transition-all hover:scale-105"
                    >
                      <Icon className="w-8 h-8 text-emerald-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">{line.name}</h3>
                      <p className="text-sm text-slate-400">{line.description}</p>
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
                <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Analyzing palm lines and features...</p>
              </div>
            ) : analysis && !analysis.error ? (
              <>
                {/* Overview */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <Hand className="w-8 h-8 text-emerald-400" />
                      Palm Reading - {analysis.hand} Hand
                    </h2>
                    <div className="flex items-center gap-3">
                      <PDFExporter
                        title={`Palm Reading - ${analysis.hand} Hand`}
                        content={{
                          hand: analysis.hand,
                          lines: analysis.lines,
                          interpretation: analysis.interpretation || analysis.hand_meaning || '',
                          analysis: analysis.features || '',
                          timestamp: new Date().toISOString()
                        }}
                        filename={`palmistry-${selectedHand}-hand-${new Date().toISOString().split('T')[0]}.pdf`}
                        type="palmistry"
                      />
                      <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-300">AI Analysis</span>
                      </div>
                    </div>
                  </div>

                  {analysis.hand_meaning && (
                    <div className="p-6 bg-gradient-to-r from-emerald-600/10 to-green-600/10 border border-emerald-500/20 rounded-2xl mb-6">
                      <h3 className="text-lg font-bold text-emerald-200 mb-2">Hand Significance</h3>
                      <p className="text-slate-300">{analysis.hand_meaning}</p>
                    </div>
                  )}

                  {/* Hand Shape */}
                  {analysis.features?.hand_shape && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-500/30">
                        <div className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Hand Element</div>
                        <div className="text-4xl font-bold text-purple-400 mb-2 capitalize">{analysis.features.hand_shape}</div>
                        <div className="text-sm text-slate-300 mb-3">{handShapeInfo[analysis.features.hand_shape]?.description}</div>
                        <div className="flex flex-wrap gap-2">
                          {handShapeInfo[analysis.features.hand_shape]?.traits.map((trait: string) => (
                            <span key={trait} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      {analysis.interpretation?.element && (
                        <div className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-800/20 rounded-2xl border border-emerald-500/30">
                          <div className="text-sm font-semibold text-emerald-300 mb-2 uppercase tracking-wider">Element Traits</div>
                          <p className="text-slate-300">{analysis.interpretation.element}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Major Lines */}
                {analysis.features?.lines && (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                      Major Palm Lines
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Life Line */}
                      {analysis.features.lines.life_line && (
                        <div className="p-6 bg-gradient-to-br from-rose-600/10 to-pink-600/10 border border-rose-500/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6 text-rose-400" />
                            <h3 className="text-xl font-bold text-white">Life Line</h3>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div>
                              <span className="text-sm text-rose-300 font-semibold">Length: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.life_line.length}</span>
                            </div>
                            <div>
                              <span className="text-sm text-rose-300 font-semibold">Quality: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.life_line.quality}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 italic">{analysis.features.lines.life_line.meaning}</p>
                        </div>
                      )}

                      {/* Head Line */}
                      {analysis.features.lines.head_line && (
                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <Brain className="w-6 h-6 text-blue-400" />
                            <h3 className="text-xl font-bold text-white">Head Line</h3>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div>
                              <span className="text-sm text-blue-300 font-semibold">Direction: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.head_line.direction}</span>
                            </div>
                            <div>
                              <span className="text-sm text-blue-300 font-semibold">Quality: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.head_line.quality}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 italic">{analysis.features.lines.head_line.meaning}</p>
                        </div>
                      )}

                      {/* Heart Line */}
                      {analysis.features.lines.heart_line && (
                        <div className="p-6 bg-gradient-to-br from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6 text-pink-400" />
                            <h3 className="text-xl font-bold text-white">Heart Line</h3>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div>
                              <span className="text-sm text-pink-300 font-semibold">Curvature: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.heart_line.curvature}</span>
                            </div>
                            <div>
                              <span className="text-sm text-pink-300 font-semibold">Quality: </span>
                              <span className="text-slate-200 capitalize">{analysis.features.lines.heart_line.quality}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 italic">{analysis.features.lines.heart_line.meaning}</p>
                        </div>
                      )}

                      {/* Fate Line */}
                      {analysis.features.lines.fate_line && (
                        <div className="p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-amber-400" />
                            <h3 className="text-xl font-bold text-white">Fate Line</h3>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm text-amber-300 font-semibold">Strength: </span>
                            <span className="text-slate-200 capitalize">{analysis.features.lines.fate_line.strength}</span>
                          </div>
                          <p className="text-sm text-slate-300 italic">{analysis.features.lines.fate_line.meaning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fingers Analysis */}
                {analysis.features?.fingers && (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Hand className="w-6 h-6 text-emerald-400" />
                      Finger Analysis
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(analysis.features.fingers).map(([finger, data]: [string, any]) => (
                        <div key={finger} className="p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-white mb-2 capitalize">{finger} Finger</h3>
                          <div className="mb-3">
                            <span className="text-sm text-indigo-300 font-semibold">Length: </span>
                            <span className="text-slate-200 capitalize">{data.length}</span>
                          </div>
                          <p className="text-sm text-slate-300 italic">{data.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mounts */}
                {analysis.features?.mounts && (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Crown className="w-6 h-6 text-emerald-400" />
                      Palm Mounts
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(analysis.features.mounts).map(([mount, data]: [string, any]) => (
                        <div key={mount} className="p-6 bg-gradient-to-br from-emerald-600/10 to-green-600/10 border border-emerald-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-white mb-2 capitalize">Mount of {mount}</h3>
                          <div className="mb-3 space-y-1">
                            <div className="text-xs text-emerald-300">{data.location}</div>
                            <div>
                              <span className="text-sm text-emerald-300 font-semibold">Prominence: </span>
                              <span className="text-slate-200 capitalize">{data.prominence}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 italic">{data.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Life Insights */}
                {analysis.interpretation && (
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Award className="w-6 h-6 text-emerald-400" />
                      Life Insights
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {analysis.interpretation.personality && (
                        <div className="p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-purple-200 mb-2">Personality</h3>
                          <p className="text-slate-300">{analysis.interpretation.personality}</p>
                        </div>
                      )}
                      
                      {analysis.interpretation.career && (
                        <div className="p-6 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-blue-200 mb-2">Career Path</h3>
                          <p className="text-slate-300">{analysis.interpretation.career}</p>
                        </div>
                      )}
                      
                      {analysis.interpretation.relationships && (
                        <div className="p-6 bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-pink-200 mb-2">Relationships</h3>
                          <p className="text-slate-300">{analysis.interpretation.relationships}</p>
                        </div>
                      )}
                      
                      {analysis.interpretation.health && (
                        <div className="p-6 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-2xl">
                          <h3 className="text-lg font-bold text-green-200 mb-2">Health & Vitality</h3>
                          <p className="text-slate-300">{analysis.interpretation.health}</p>
                        </div>
                      )}
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
