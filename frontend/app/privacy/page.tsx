'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Calendar, Sparkles } from 'lucide-react';

export default function PrivacyPage() {
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
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400">
            Last updated: December 20, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-gray-400 leading-relaxed">
              At AstroAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our astrology platform and services. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-purple-400" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Birth date, time, and place for chart calculations</li>
                  <li>Profile picture (if provided)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Charts generated, predictions requested, and consultations booked</li>
                  <li>Device information, IP address, and browser type</li>
                  <li>Usage patterns and feature preferences</li>
                  <li>Communication with customer support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-3 text-purple-400" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Generate accurate birth charts and astrological predictions</li>
              <li>Provide personalized insights and recommendations</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates about your account and services</li>
              <li>Improve our AI algorithms and service quality</li>
              <li>Respond to customer support inquiries</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-purple-400" />
              Data Security
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular backups to prevent data loss</li>
              <li>Compliance with GDPR, CCPA, and other privacy regulations</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-purple-400" />
              Your Privacy Rights
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data</li>
              <li><strong className="text-white">Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong className="text-white">Object:</strong> Object to certain data processing activities</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-purple-400" />
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> Payment processors, hosting services, analytics tools</li>
              <li><strong className="text-white">Astrologers:</strong> Only for booked consultations, with your consent</li>
              <li><strong className="text-white">Legal Authorities:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-white">Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              All third parties are bound by strict confidentiality agreements and data protection requirements.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Personalize content and advertisements</li>
              <li>Improve site functionality and user experience</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-400" />
              Data Retention
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal obligations, dispute resolution, and fraud prevention. Anonymized data may be retained indefinitely for analytics and service improvement.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-400 leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
            <p className="text-gray-400 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-3 text-purple-400" />
              Contact Us
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-white mb-2"><strong>Email:</strong> privacy@astroai.com</p>
              <p className="text-white mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p className="text-white"><strong>Address:</strong> AstroAI Inc., 123 Cosmic Way, San Francisco, CA 94102</p>
            </div>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 mb-4">Related Documents</p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/help" className="text-purple-400 hover:text-purple-300 transition-colors">
              Help Center
            </Link>
            <Link href="/dashboard/settings" className="text-purple-400 hover:text-purple-300 transition-colors">
              Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
