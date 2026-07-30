import React from 'react';
import { ShieldCheck, Eye, Key, Globe } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Boutique Trust</span>
          <h1 className="text-4xl font-serif italic text-gray-950 font-light ml-1">Privacy Charter</h1>
          <div className="w-16 h-[1px] bg-brand-300 mx-auto mt-6"></div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider font-light mt-4">Last amended: June 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-white border border-brand-100 p-8 sm:p-12 shadow-sm rounded-none mb-10 text-sm text-gray-600 font-light leading-relaxed">
          <p className="mb-4">
            At <strong>Bloom & Bouquet</strong>, our admiration for the elegance of natural essences is matched only by our dedication to protecting your private credentials. This Privacy Charter details how we protect your personal identity, safe-guard processed card checkouts, and maintain the clean, non-invasive digital standard of our online space.
          </p>
          <p>
            By using our services, shopping our wardrobes, or subscribing to our private news circle, you fully authorize the terms mapped within this charter.
          </p>
        </div>

        {/* Section Grid */}
        <div className="space-y-8">
          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <Eye className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Information We Gather</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              We gather basic customer details essential only for premium order fulfillment:
            </p>
            <ul className="list-disc pl-5 text-xs text-gray-500 font-light space-y-2 leading-relaxed">
              <li><strong>Contact Credentials:</strong> Your full name, mailing/shipping physical address, email address, and cell phone number.</li>
              <li><strong>Secure Transactions:</strong> Checkout details analyzed securely by certified Stripe servers. Your actual raw card numbers never hit or stay on our internal databases.</li>
              <li><strong>Visual Selections:</strong> Wishlisted items, preferred perfume collections (Men/Women/Unisex), and order history logs.</li>
            </ul>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <Key className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Encryption & Secure Storage</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              All transactions are fully shielded under transport-layer encryption (SSL/TLS). Your user-dashboard account credentials are salted and hashed on remote servers. We enforce strict role-based access so only privileged administrative concierges inspect your mailing files.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">No Marketing Solicitation</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              We value quiet elegance. We strictly refuse to monetize, share, rent, or lease your physical mailing addresses or email values with aggressive third-party data conglomerates. Scent circle subscription remains completely voluntary, and you have instant authority to click "unsubscribe" at any given second.
            </p>
          </div>

          <div className="bg-white border border-brand-100 p-8">
            <div className="flex items-center space-x-3 mb-4 text-brand-500">
              <Globe className="w-5 h-5" />
              <h2 className="font-serif italic text-lg text-gray-950 font-light">Global Standards compliance</h2>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              We fully align our processing logic with international privacy guidelines, including the General Data Protection Regulation (GDPR) and state laws:
            </p>
            <ul className="list-disc pl-5 text-xs text-gray-500 font-light space-y-2 leading-relaxed">
              <li><strong>Transparency:</strong> You hold full rights of request to inspect any personal dossier we keep about you.</li>
              <li><strong>Correction:</strong> You can edit dashboard details or invoke deletion requirements at your preference.</li>
              <li><strong>Opt-Out:</strong> Consent to cookies can be altered via your browser preferences anytime.</li>
            </ul>
          </div>
        </div>

        {/* Contact info support */}
        <div className="mt-12 text-center text-xs text-gray-400 font-light">
          Any inquiries regarding your private credentials can be safely addressed to <a href="mailto:privacy@bloomandbouquet.com" className="text-brand-500 hover:underline">privacy@bloomandbouquet.com</a>.
        </div>

      </div>
    </div>
  );
};
