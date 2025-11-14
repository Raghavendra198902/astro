'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Hand, 
  Upload, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ZoomIn,
  RotateCw,
  Crop,
  Info,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  FileImage,
  Settings,
  Layout
} from 'lucide-react';

interface PalmistryFormData {
  // Hand Selection
  handSelection: 'left' | 'right' | 'both';
  dominantHand: 'left' | 'right';
  
  // Image Upload
  leftHandImage: File | null;
  rightHandImage: File | null;
  leftHandPreview: string | null;
  rightHandPreview: string | null;
  
  // Analysis Preferences
  analysisType: 'quick' | 'detailed' | 'comprehensive';
  focusLines: string[];
  includeMounts: boolean;
  includeFingers: boolean;
  includeMarkings: boolean;
  
  // Additional Details
  age: number | null;
  gender: 'male' | 'female' | 'other';
  
  // Focus Areas
  focusAreas: string[];
  
  // Privacy
  saveToProfile: boolean;
  shareAnonymous: boolean;
}

export default function AdvancedPalmistryForm() {
  const router = useRouter();
  const leftHandInputRef = useRef<HTMLInputElement>(null);
  const rightHandInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PalmistryFormData>({
    handSelection: 'right',
    dominantHand: 'right',
    leftHandImage: null,
    rightHandImage: null,
    leftHandPreview: null,
    rightHandPreview: null,
    analysisType: 'detailed',
    focusLines: ['life', 'head', 'heart'],
    includeMounts: true,
    includeFingers: true,
    includeMarkings: true,
    age: null,
    gender: 'male',
    focusAreas: [],
    saveToProfile: true,
    shareAnonymous: false,
  });

  const palmLines = [
    { id: 'life', name: 'Life Line', description: 'Vitality & life path', icon: Heart },
    { id: 'head', name: 'Head Line', description: 'Intelligence & thinking', icon: Eye },
    { id: 'heart', name: 'Heart Line', description: 'Emotions & relationships', icon: Heart },
    { id: 'fate', name: 'Fate Line', description: 'Career & destiny', icon: TrendingUp },
    { id: 'sun', name: 'Sun Line', description: 'Success & fame', icon: Sparkles },
    { id: 'marriage', name: 'Marriage Line', description: 'Relationships & unions', icon: Users },
  ];

  const focusAreaOptions = [
    { id: 'career', name: 'Career & Success', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'relationships', name: 'Love & Relationships', icon: Heart, color: 'text-pink-500' },
    { id: 'health', name: 'Health & Vitality', icon: Heart, color: 'text-green-500' },
    { id: 'wealth', name: 'Wealth & Finance', icon: TrendingUp, color: 'text-yellow-500' },
    { id: 'family', name: 'Family & Children', icon: Users, color: 'text-purple-500' },
    { id: 'spiritual', name: 'Spiritual Growth', icon: Sparkles, color: 'text-indigo-500' },
  ];

  const handleImageUpload = useCallback((hand: 'left' | 'right', file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [`${hand}Image`]: 'Please upload a valid image file' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [`${hand}Image`]: 'Image size should be less than 10MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [`${hand}HandImage`]: file,
        [`${hand}HandPreview`]: reader.result as string,
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${hand}Image`];
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileDrop = useCallback((hand: 'left' | 'right', e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(hand, file);
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((hand: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(hand, file);
  }, [handleImageUpload]);

  const removeImage = (hand: 'left' | 'right') => {
    setFormData(prev => ({
      ...prev,
      [`${hand}HandImage`]: null,
      [`${hand}HandPreview`]: null,
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.handSelection === 'both') {
        if (!formData.leftHandImage) newErrors.leftImage = 'Please upload left hand image';
        if (!formData.rightHandImage) newErrors.rightImage = 'Please upload right hand image';
      } else if (formData.handSelection === 'left' && !formData.leftHandImage) {
        newErrors.leftImage = 'Please upload left hand image';
      } else if (formData.handSelection === 'right' && !formData.rightHandImage) {
        newErrors.rightImage = 'Please upload right hand image';
      }
    }

    if (step === 2) {
      if (formData.focusLines.length === 0) {
        newErrors.focusLines = 'Please select at least one palm line to analyze';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('handSelection', formData.handSelection);
      submitData.append('dominantHand', formData.dominantHand);
      
      if (formData.leftHandImage) {
        submitData.append('leftHandImage', formData.leftHandImage);
      }
      if (formData.rightHandImage) {
        submitData.append('rightHandImage', formData.rightHandImage);
      }
      
      submitData.append('analysisType', formData.analysisType);
      submitData.append('focusLines', JSON.stringify(formData.focusLines));
      submitData.append('includeMounts', String(formData.includeMounts));
      submitData.append('includeFingers', String(formData.includeFingers));
      submitData.append('includeMarkings', String(formData.includeMarkings));
      
      if (formData.age) submitData.append('age', String(formData.age));
      submitData.append('gender', formData.gender);
      submitData.append('focusAreas', JSON.stringify(formData.focusAreas));
      submitData.append('saveToProfile', String(formData.saveToProfile));
      submitData.append('shareAnonymous', String(formData.shareAnonymous));

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/dashboard/palmistry');
    } catch (error) {
      console.error('Palmistry analysis error:', error);
      setErrors({ submit: 'Failed to submit palmistry analysis. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFocusLine = (lineId: string) => {
    setFormData(prev => ({
      ...prev,
      focusLines: prev.focusLines.includes(lineId)
        ? prev.focusLines.filter(id => id !== lineId)
        : [...prev.focusLines, lineId]
    }));
  };

  const toggleFocusArea = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Hand className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Palm Reading Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your palm images for detailed analysis
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500 text-white'
                        : 'border-gray-300 text-gray-400 dark:border-gray-600'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Upload' : step === 2 ? 'Analysis' : 'Preferences'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            {/* Step 1: Hand Selection & Upload */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileImage className="w-6 h-6 text-purple-500" />
                    Hand Selection & Upload
                  </h2>

                  {/* Hand Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Which hand(s) do you want to analyze? *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'left', label: 'Left Hand', icon: '👈' },
                        { value: 'right', label: 'Right Hand', icon: '👉' },
                        { value: 'both', label: 'Both Hands', icon: '👐' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, handSelection: option.value as any }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.handSelection === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{option.icon}</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dominant Hand */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Which is your dominant hand? *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'right', label: 'Right Hand (Right-handed)' },
                        { value: 'left', label: 'Left Hand (Left-handed)' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, dominantHand: option.value as any }))}
                          className={`p-3 rounded-xl border-2 transition-all text-sm ${
                            formData.dominantHand === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Left Hand Upload */}
                  {(formData.handSelection === 'left' || formData.handSelection === 'both') && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Left Hand Image *
                      </label>
                      {!formData.leftHandPreview ? (
                        <div
                          onDrop={(e) => handleFileDrop('left', e)}
                          onDragOver={(e) => e.preventDefault()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 ${
                            errors.leftImage ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          onClick={() => leftHandInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Drop your left hand image here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                          <input
                            ref={leftHandInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect('left', e)}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                          <img
                            src={formData.leftHandPreview}
                            alt="Left hand preview"
                            className="w-full h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('left')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Left hand uploaded
                          </div>
                        </div>
                      )}
                      {errors.leftImage && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.leftImage}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Right Hand Upload */}
                  {(formData.handSelection === 'right' || formData.handSelection === 'both') && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Right Hand Image *
                      </label>
                      {!formData.rightHandPreview ? (
                        <div
                          onDrop={(e) => handleFileDrop('right', e)}
                          onDragOver={(e) => e.preventDefault()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 ${
                            errors.rightImage ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          onClick={() => rightHandInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Drop your right hand image here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                          <input
                            ref={rightHandInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect('right', e)}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                          <img
                            src={formData.rightHandPreview}
                            alt="Right hand preview"
                            className="w-full h-64 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('right')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Right hand uploaded
                          </div>
                        </div>
                      )}
                      {errors.rightImage && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.rightImage}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Image Guidelines */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Image Guidelines for Best Results
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Use good lighting, preferably natural light</li>
                          <li>• Keep your palm flat and fingers slightly spread</li>
                          <li>• Ensure palm lines are clearly visible</li>
                          <li>• Avoid shadows or blurry images</li>
                          <li>• Hold camera parallel to your palm (not at an angle)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Analysis Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-purple-500" />
                    Analysis Configuration
                  </h2>

                  {/* Analysis Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Analysis Depth *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          value: 'quick', 
                          label: 'Quick Analysis', 
                          desc: 'Major lines overview',
                          time: '~5 min'
                        },
                        { 
                          value: 'detailed', 
                          label: 'Detailed Analysis', 
                          desc: 'Lines, mounts & markings',
                          time: '~10 min'
                        },
                        { 
                          value: 'comprehensive', 
                          label: 'Comprehensive', 
                          desc: 'Complete palmistry reading',
                          time: '~15 min'
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, analysisType: option.value as any }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.analysisType === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {option.desc}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {option.time}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Palm Lines Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Focus Palm Lines * (Select at least one)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {palmLines.map((line) => {
                        const Icon = line.icon;
                        const isSelected = formData.focusLines.includes(line.id);
                        return (
                          <button
                            key={line.id}
                            type="button"
                            onClick={() => toggleFocusLine(line.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                {line.name}
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {line.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.focusLines && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.focusLines}
                      </p>
                    )}
                  </div>

                  {/* Additional Analysis Features */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Additional Features
                    </label>
                    <div className="space-y-3">
                      {[
                        { 
                          key: 'includeMounts', 
                          label: 'Analyze Mounts', 
                          desc: 'Planetary mounts analysis (Venus, Mars, Jupiter, etc.)'
                        },
                        { 
                          key: 'includeFingers', 
                          label: 'Finger Analysis', 
                          desc: 'Length, shape, and positioning of fingers'
                        },
                        { 
                          key: 'includeMarkings', 
                          label: 'Special Markings', 
                          desc: 'Stars, crosses, triangles, and other formations'
                        },
                      ].map((feature) => (
                        <button
                          key={feature.key}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [feature.key]: !prev[feature.key as keyof PalmistryFormData] }))}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            formData[feature.key as keyof PalmistryFormData]
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                {feature.label}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {feature.desc}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              formData[feature.key as keyof PalmistryFormData]
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {formData[feature.key as keyof PalmistryFormData] && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Details & Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Layout className="w-6 h-6 text-purple-500" />
                    Personal Details & Focus Areas
                  </h2>

                  {/* Age & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Age (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : null }))}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-700 dark:text-white transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Areas of Life to Focus On (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {focusAreaOptions.map((area) => {
                        const Icon = area.icon;
                        const isSelected = formData.focusAreas.includes(area.id);
                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => toggleFocusArea(area.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${isSelected ? area.color : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {area.name}
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy Options */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Privacy Settings
                    </label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, saveToProfile: !prev.saveToProfile }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.saveToProfile
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                Save to Profile
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Keep analysis in your profile history
                              </div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            formData.saveToProfile
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {formData.saveToProfile && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, shareAnonymous: !prev.shareAnonymous }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.shareAnonymous
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                Anonymous Analysis
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Your personal details won't be stored
                              </div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            formData.shareAnonymous
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {formData.shareAnonymous && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Analysis Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Hand(s):</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white capitalize">
                          {formData.handSelection}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Depth:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white capitalize">
                          {formData.analysisType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Focus Lines:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {formData.focusLines.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Focus Areas:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                          {formData.focusAreas.length || 'All'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Palm
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Advanced palm reading technology' },
            { icon: Shield, title: 'Secure & Private', desc: 'Your images are encrypted' },
            { icon: Zap, title: 'Instant Results', desc: 'Get detailed reading in minutes' },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {feature.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
