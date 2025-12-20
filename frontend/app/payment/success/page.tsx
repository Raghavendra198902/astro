'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Crown, Sparkles, ArrowRight, Download, Mail, Calendar } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const plan = searchParams.get('plan') || 'pro';
  const amount = searchParams.get('amount') || '999';
  const transactionId = searchParams.get('txn_id') || `TXN${Date.now()}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard?upgraded=true');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-3xl opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Welcome to AstroAI Pro
            </p>
            <p className="text-gray-400">
              Your subscription has been activated and you now have full access to all premium features.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold capitalize">{plan}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-semibold">₹{amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-white font-mono text-sm">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{new Date().toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Next Billing Date</span>
                <span className="text-white">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              What's Next?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Receipt sent to your email</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">All Pro features unlocked</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Access to premium learning content</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Priority customer support enabled</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Redirecting to dashboard in <span className="text-purple-400 font-semibold">{countdown}</span> seconds...
            </p>
          </div>
        </div>

        {/* Support Notice */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/help" className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>support@astroai.com</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
