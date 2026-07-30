import React from 'react';
import { Truck, Wine, ShieldCheck, RefreshCw } from 'lucide-react';

export const Shipping = () => {
  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Boutique Logistics</span>
          <h1 className="text-4xl font-serif italic text-gray-950 font-light ml-1">Shipping & Returns</h1>
          <div className="w-16 h-[1px] bg-brand-300 mx-auto mt-6"></div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-white border border-brand-100 p-8 space-y-4">
            <div className="flex items-center space-x-3 text-brand-500">
              <Truck className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Complimentary Delivery</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              We are delighted to offer complimentary premium ground shipping on all orders over <strong>$150 USD</strong>. For smaller orders, a luxury secure ground shipping rate of $15 applies within the US.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8 space-y-4">
            <div className="flex items-center space-x-3 text-brand-500">
              <Wine className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Signature Presentation</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Every Bloom & Bouquet bottle is encased in our proprietary blush-pink cylindrical hard box, lined with velvet cushioning, and secured with hand-waxed silk seals. Perfect for direct elegant gifting.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8 space-y-4">
            <div className="flex items-center space-x-3 text-brand-500">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Aviation Liquid Restrictions</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              Because of high-concentration cane alcohol content, our products are classified as hazardous freight under flight rules. Thus, some territories only support ground travel route pathways.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8 space-y-4">
            <div className="flex items-center space-x-3 text-brand-500">
              <RefreshCw className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Return Paradigm</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
              We offer full refunds on unopened primary products returned within 30 days of arrival. Each full bottle purchase comes with an identical small test vial, so you can sample your sillage before opening the box.
            </p>
          </div>

        </div>

        {/* Steps */}
        <div className="bg-white border border-brand-100 p-8 sm:p-10 mb-12">
          <h2 className="font-serif italic text-xl text-gray-950 font-light mb-6 border-b border-brand-50 pb-2">How to Return</h2>
          
          <div className="space-y-6">
            <div className="flex space-x-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-50 border border-brand-300 text-brand-600 text-xs font-bold font-mono flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">Pre-Test the Vial</p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">Ensure you fall completely in love with the sillage using the complimentary 2ml sample before unsealing the 100ml presentation glass.</p>
              </div>
            </div>

            <div className="flex space-x-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-50 border border-brand-300 text-brand-600 text-xs font-bold font-mono flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">Request a Return Slip</p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">If you decide of a return, simply contact <a href="mailto:concierge@bloomandbouquet.com" className="text-brand-500 hover:underline font-medium">concierge@bloomandbouquet.com</a> for an easy ground shipping return slip.</p>
              </div>
            </div>

            <div className="flex space-x-4 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-50 border border-brand-300 text-brand-600 text-xs font-bold font-mono flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold mb-1">Secure Packaging Delivery</p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">Affix the ground slip label over the brown shipping outer carton box, ensuring the hard pink boutique cylindrical case remains pristine.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
