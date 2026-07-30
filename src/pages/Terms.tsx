import React from 'react';
import { Scale, BookOpen, CreditCard, Ban } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Legals & Bilaterals</span>
          <h1 className="text-4xl font-serif italic text-gray-950 font-light ml-1">Terms of Service</h1>
          <div className="w-16 h-[1px] bg-brand-300 mx-auto mt-6"></div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider font-light mt-4">Effective: June 2026</p>
        </div>

        {/* Intro */}
        <div className="bg-white border border-brand-100 p-8 sm:p-12 shadow-sm rounded-none mb-10 text-sm text-gray-600 font-light leading-relaxed">
          <p className="mb-4">
            Welcome to the online sanctuary of <strong>Bloom & Bouquet</strong>. This service of fine-fragrances, boutique checkouts, and content coordinates is operated under the following standard bylaws.
          </p>
          <p>
            By accessing, browsing, registering an account, or acquiring products from our collections, you confirm that you have read, understood, and agreed to maintain compliance with these terms in their entirety.
          </p>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <Scale className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">1. Eligible Use & Accounts</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              To hold a secure account or finalize order processes, you must be 18 years or older. You hold full responsibility for keeping your login token or password secure, and you agree to alert our concierges instantly if any unauthorized access is discovered under your identity.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">2. Accuracy of Product Profiles</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              We expend great dedication to display perfume formulations, ingredients, photos, reviews, and categories accurately. However, because we utilize authentic organic flower extracts, minor variant traits (coloration changes in cold-pressed sandalwood, natural sedimentation) can occur. We do not warrant that monitor screen colors present bottle sizes or exact materials identically to reality.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <CreditCard className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">3. Payments, Billing & Shipping</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              All prices represent United States Dollars (USD) and exclude local sales taxes or custom tariffs unless specifically state otherwise on checkout details.
            </p>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              We reserve immediate authority to decline, restrict, or modify order requests at our administrative discretion. In the rare event of order cancellations, our team will process immediate full balance refunds within 3 business days back to your primary billing method.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <Ban className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">4. Disallowed Behaviors</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              When utilizing our online platform, you are strictly disallowed from:
            </p>
            <ul className="list-disc pl-5 text-xs text-gray-500 font-light space-y-2 leading-relaxed">
              <li>Using our custom illustrations, perfume slogans, or branding content for unauthorized, non-consensual monetization.</li>
              <li>Attempting database breaches or inserting malicious script layers into our application API pipelines.</li>
              <li>Simulating reviews or creating false customer testimonials to feed bad intent.</li>
            </ul>
          </div>
        </div>

        {/* Contact info support */}
        <div className="mt-12 text-center text-xs text-gray-400 font-light">
          Any inquiries regarding the bylaws can be handled directly via <a href="mailto:legal@bloomandbouquet.com" className="text-brand-500 hover:underline">legal@bloomandbouquet.com</a>.
        </div>

      </div>
    </div>
  );
};
