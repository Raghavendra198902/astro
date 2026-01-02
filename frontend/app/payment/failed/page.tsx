'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle, Mail, Phone, ArrowLeft } from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment processing failed';
  const plan = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'monthly';

  const commonIssues = [
    {
      title: 'Insufficient Funds',
      description: 'Please ensure your account has sufficient balance or try a different payment method.'
    },
    {
      title: 'Card Declined',
      description: 'Your card may have been declined by your bank. Please contact your bank or try another card.'
    },
    {
      title: 'Network Issue',
      description: 'A network error occurred during payment processing. Please check your connection and try again.'
    },
    {
      title: 'Invalid Card Details',
      description: 'Please verify your card number, expiry date, and CVV are correct.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Error Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-full blur-3xl opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              We couldn't process your payment
            </p>
            <p className="text-gray-400">
              {reason}
            </p>
          </div>

          {/* Common Issues */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-yellow-400" />
              Common Issues & Solutions
            </h3>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-4">
                  <h4 className="text-white font-semibold mb-1">{issue.title}</h4>
                  <p className="text-sm text-gray-400">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What You Can Do */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              What You Can Do
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-purple-400 font-bold">1.</span>
                <span className="text-gray-300">Check your payment details and try again</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-400 font-bold">2.</span>
                <span className="text-gray-300">Try a different payment method (UPI, Net Banking)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-400 font-bold">3.</span>
                <span className="text-gray-300">Contact your bank to authorize the transaction</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-400 font-bold">4.</span>
                <span className="text-gray-300">Reach out to our support team for assistance</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href={`/checkout?plan=${plan}&billing=${billing}`}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </Link>
            <Link
              href="/pricing"
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Pricing</span>
            </Link>
          </div>

          {/* No Charge Notice */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6">
            <p className="text-sm text-blue-300 text-center">
              <strong>Don't worry!</strong> Your card was not charged. You can try again anytime.
            </p>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Still having issues? Our support team is here to help
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/help" 
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>support@astroai.com</span>
            </Link>
            <Link 
              href="/help" 
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>+91 1800-123-4567</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
