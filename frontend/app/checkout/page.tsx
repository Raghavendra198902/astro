'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CreditCard, Lock, CheckCircle, AlertCircle, ArrowLeft, Shield, 
  Crown, Sparkles, Calendar, IndianRupee, Check, Info
} from 'lucide-react';

interface PlanDetails {
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'pro';
  const billing = (searchParams.get('billing') || 'monthly') as 'monthly' | 'yearly';

  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [upiData, setUpiData] = useState({
    upiId: ''
  });

  const planDetails: Record<string, PlanDetails> = {
    pro: {
      name: 'Pro',
      price: billing === 'monthly' ? 999 : 9990,
      billing,
      features: [
        'Unlimited predictions & charts',
        'Advanced palmistry & face reading',
        'Detailed Dasha analysis',
        'Life events prediction',
        'Priority support',
        'Export reports as PDF',
        'Lifetime data access'
      ]
    }
  };

  const currentPlan = planDetails[plan];
  const savingsAmount = billing === 'yearly' ? (999 * 12) - 9990 : 0;
  const yearlyPrice = billing === 'yearly' ? currentPlan.price : 999 * 12;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardData(prev => ({ ...prev, [name]: formatCardNumber(value) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Integrate with actual payment gateway (Stripe, Razorpay, etc.)
      const response = await fetch('/api/v1/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: plan,
          billing: billing,
          payment_method: paymentMethod,
          payment_details: paymentMethod === 'card' ? cardData : upiData
        })
      });

      if (response.ok) {
        setStep('success');
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard?upgraded=true');
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-400 mb-6">
              Your {currentPlan.name} plan has been activated. Redirecting to dashboard...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pricing</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              {/* Plan Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{currentPlan.name} Plan</h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {billing} billing
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {currentPlan.price}
                    </div>
                    <p className="text-sm text-gray-400">
                      /{billing === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                </div>

                {billing === 'yearly' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                    <div className="flex items-center space-x-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">You Save ₹{savingsAmount}/year</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      That's ₹{Math.round(yearlyPrice / 12)}/month instead of ₹999/month
                    </p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trial Notice */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300 font-semibold mb-1">7-Day Free Trial</p>
                  <p className="text-sm text-gray-400">
                    You won't be charged until {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}. 
                    Cancel anytime during the trial period.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:order-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

              {/* Payment Method Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'card'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                      paymentMethod === 'card' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <span className="text-sm text-white">Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">📱</span>
                    <span className="text-sm text-white">UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 rounded-xl border transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">🏦</span>
                    <span className="text-sm text-white">Banking</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Month
                        </label>
                        <input
                          type="text"
                          name="expiryMonth"
                          value={cardData.expiryMonth}
                          onChange={handleCardChange}
                          placeholder="MM"
                          maxLength={2}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Year
                        </label>
                        <input
                          type="text"
                          name="expiryYear"
                          value={cardData.expiryYear}
                          onChange={handleCardChange}
                          placeholder="YY"
                          maxLength={2}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiData.upiId}
                      onChange={(e) => setUpiData({ upiId: e.target.value })}
                      placeholder="yourname@upi"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Select Bank
                    </label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Security Notice */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-semibold mb-1">Secure Payment</p>
                    <p className="text-sm text-gray-400">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Start Free Trial</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400">
                  By confirming your subscription, you agree to our{' '}
                  <Link href="/terms" className="text-purple-400 hover:underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
