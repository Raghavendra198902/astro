'use client';

import Link from 'next/link';
import { FileText, Scale, AlertCircle, CheckCircle, Ban, CreditCard, UserX, Sparkles } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AstroAI
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400">
            Last updated: December 20, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
          
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Scale className="w-6 h-6 mr-3 text-purple-400" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using AstroAI's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Description of Services</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              AstroAI provides AI-powered astrology services including:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Birth chart generation (Vedic and Western)</li>
              <li>Personalized predictions and insights</li>
              <li>Compatibility analysis</li>
              <li>Online consultations with professional astrologers</li>
              <li>Numerology, palmistry, and face reading services</li>
              <li>Panchang and daily predictions</li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-400 text-sm">
                <strong>Important:</strong> Our services are for entertainment and informational purposes only. Astrological predictions should not be used as a substitute for professional advice (medical, legal, financial, etc.).
              </p>
            </div>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-purple-400" />
              User Obligations
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              As a user of AstroAI, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years of age to use our services</li>
              <li>Use the platform in compliance with all applicable laws</li>
              <li>Not misuse, abuse, or attempt to hack our systems</li>
              <li>Not share, resell, or distribute our content without permission</li>
              <li>Respect intellectual property rights</li>
              <li>Not use automated systems to access our services</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Ban className="w-6 h-6 mr-3 text-red-400" />
              Prohibited Activities
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The following activities are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Creating fake or multiple accounts</li>
              <li>Impersonating others or providing false information</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Distributing malware, viruses, or harmful code</li>
              <li>Scraping, data mining, or automated data collection</li>
              <li>Harassing, threatening, or abusing other users or staff</li>
              <li>Violating intellectual property rights</li>
              <li>Using our services for illegal purposes</li>
              <li>Reverse engineering or decompiling our software</li>
            </ul>
          </section>

          {/* Subscriptions and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-purple-400" />
              Subscriptions and Payments
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Subscription Plans</h3>
                <p className="text-gray-400 leading-relaxed">
                  We offer Free and Pro subscription tiers. Pro subscriptions are billed monthly or annually and automatically renew unless canceled. Prices are subject to change with 30 days notice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Payment Processing</h3>
                <p className="text-gray-400 leading-relaxed">
                  All payments are processed securely through third-party payment providers. You authorize us to charge your payment method for all fees. Failed payments may result in service suspension.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Refund Policy</h3>
                <p className="text-gray-400 leading-relaxed">
                  We offer a 30-day money-back guarantee for Pro subscriptions. Refund requests must be submitted within 30 days of purchase. Consultation fees are non-refundable once the session is completed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cancellation</h3>
                <p className="text-gray-400 leading-relaxed">
                  You may cancel your subscription anytime through Account Settings. Cancellations take effect at the end of the current billing period. No prorated refunds for partial months.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property Rights</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              All content, features, and functionality on AstroAI, including:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Text, graphics, logos, icons, and images</li>
              <li>Software, algorithms, and AI models</li>
              <li>Astrological interpretations and predictions</li>
              <li>Charts, reports, and analysis</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              ...are owned by AstroAI or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">User-Generated Content</h2>
            <p className="text-gray-400 leading-relaxed">
              You retain ownership of any content you submit (profile information, questions, feedback). By submitting content, you grant AstroAI a worldwide, royalty-free license to use, reproduce, modify, and display such content for providing and improving our services. You represent that your content does not violate any rights or laws.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Disclaimer of Warranties</h2>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-gray-400 leading-relaxed">
                ASTROAI SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE ACCURACY, RELIABILITY, OR COMPLETENESS OF ASTROLOGICAL PREDICTIONS. USE OF OUR SERVICES IS AT YOUR OWN RISK.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASTROAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR OPPORTUNITIES, ARISING FROM YOUR USE OF OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <UserX className="w-6 h-6 mr-3 text-red-400" />
              Account Termination
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse or misuse of our platform</li>
              <li>Non-payment of fees</li>
              <li>At our sole discretion for any reason</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Upon termination, your right to use the services immediately ceases. We may delete your data after termination in accordance with our data retention policies.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Governing Law and Disputes</h2>
            <p className="text-gray-400 leading-relaxed">
              These Terms shall be governed by the laws of the State of California, USA, without regard to conflict of law provisions. Any disputes shall be resolved through binding arbitration in San Francisco, California. You waive the right to participate in class actions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We may revise these Terms at any time. Material changes will be notified via email or in-app notification. Your continued use after changes constitutes acceptance. If you don't agree to new terms, you must stop using our services.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Questions about these Terms? Contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-white mb-2"><strong>Email:</strong> legal@astroai.com</p>
              <p className="text-white mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p className="text-white"><strong>Address:</strong> AstroAI Inc., 123 Cosmic Way, San Francisco, CA 94102</p>
            </div>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 mb-4">Related Documents</p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/help" className="text-purple-400 hover:text-purple-300 transition-colors">
              Help Center
            </Link>
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
