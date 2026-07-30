import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ShieldAlert, Sparkles, Truck } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'fragrance' | 'order' | 'sustainability';
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "What is the concentration of Bloom & Bouquet fragrances?",
    answer: "All our precious offerings are formulated as pure Extrait de Parfum or high-concentration Eau de Parfum (ranging between 18% to 26% aromatic compounds). This high ratio ensures beautiful longevity and an exquisite, deep scent transformation throughout the day.",
    category: 'fragrance'
  },
  {
    id: 2,
    question: "Why does my perfume have slight sedimentation or minor color variance?",
    answer: "Because we prioritize natural botanical absolutes and pure organic distillations, slight color differences or natural oil crystallization can occur between seasonal batches. This is completely standard and acts as a proud indicator of genuine nature at play, resembling premium wine development. It does not alter your scent profile.",
    category: 'fragrance'
  },
  {
    id: 3,
    question: "How do I maximize sillage and longevity?",
    answer: "For premium sillage, apply to clean, damp skin on primary pulse nodes: the wrists, side of the throat, inner elbows, and directly behind the knees. Avoid rubbing your wrists together after spraying, as this breaks down delicate volatile floral top oils and speeds up the dry-down process unnecessarily.",
    category: 'fragrance'
  },
  {
    id: 4,
    question: "Do you offer discovery sample kits?",
    answer: "Yes, indeed! We offer curations containing 2ml decants of our signature line. It is our absolute philosophy that a user should experience a sillage on their skin for several days before investing in a full 100ml flacon. The cost of your Discovery Kit is redeemable against subsequent full bottle purchases.",
    category: 'order'
  },
  {
    id: 5,
    question: "Is your perfume safe for sensitive skin or allergen-prone individuals?",
    answer: "We adhere strictly to international IFRA guidelines and formulate with clean carrier organic cane alcohols. However, because natural botanical essences contain natural flower pollen and rare organic compounds, we strongly recommend performing a 24-hour test patch inside your forearm with our discovery vials before routine application.",
    category: 'sustainability'
  },
  {
    id: 6,
    question: "How are your ingredients sourced?",
    answer: "We cooperate directly with small family-owned organic cooperatives. Our Damask rose absolute is sourced from Bulgaria's rose valley, our sacred sandalwood is from sustainable Australian reserves, and our sweet jasmin is hand-harvested in Grasse during dawn when oil concentrations peek.",
    category: 'sustainability'
  },
  {
    id: 7,
    question: "What is your return policy for open bottles?",
    answer: "Due to the intimate, high-luxury nature of Extrait de Parfum, we can only authorize full returns on unopened and sealed perfume boxes. However, each full flacon purchase ships with a complimentary 2ml sample vial of the identical scent. We strongly guide our patrons to wear the 2ml companion sample before opening the primary beautiful presentation box.",
    category: 'order'
  },
  {
    id: 8,
    question: "How long does shipping take, and do you ship globally?",
    answer: "We fulfill all domestic fine fragrances orders within 2 business days. Premium ground shipping generally takes between 3 to 5 business days. Due to liquid alcohol shipping restrictions under aviation rules, international shipping is handled via specialized secure logistics, which typically takes 8 to 14 business days.",
    category: 'order'
  }
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fragrance' | 'order' | 'sustainability'>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(faq => {
    if (activeCategory === 'all') return true;
    return faq.category === activeCategory;
  });

  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Boutique Information</span>
          <h1 className="text-4xl font-serif italic text-gray-950 font-light ml-1">Frequently Asked Questions</h1>
          <div className="w-16 h-[1px] bg-brand-300 mx-auto mt-6"></div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex justify-center space-x-2 sm:space-x-4 border-b border-brand-100 pb-2 mb-12">
          {['all', 'fragrance', 'order', 'sustainability'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat as any); setOpenId(null); }}
              className={`text-[10px] uppercase tracking-widest font-bold pb-2 px-3 transition-colors ${
                activeCategory === cat 
                  ? 'text-brand-500 border-b-2 border-brand-500' 
                  : 'text-gray-400 hover:text-brand-500'
              }`}
            >
              {cat === 'all' ? 'All Inquiries' : cat === 'fragrance' ? 'Scent & Oils' : cat === 'order' ? 'Fulfillment & Returns' : 'Sourcing & Integrity'}
            </button>
          ))}
        </div>

        {/* FAQS Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white border border-brand-100 p-6 transition-all shadow-sm hover:border-brand-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-0"
                >
                  <span className="font-serif italic text-base font-light text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-400 shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-185' : 'rotate-0'}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-brand-50 pt-4 text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Call to Assistance */}
        <div className="mt-16 bg-white border border-brand-100 p-8 text-center">
          <HelpCircle className="w-8 h-8 text-brand-300 mx-auto mb-4 stroke-1" />
          <h3 className="font-serif italic text-lg text-gray-950 font-light mb-2">Unanswered Curiosity?</h3>
          <p className="text-xs text-gray-500 font-light max-w-sm mx-auto mb-6">
            Our expert perfume concierges are always ready to guide your olfactory choices.
          </p>
          <a 
            href="mailto:curious@bloomandbouquet.com" 
            className="inline-flex bg-brand-600 hover:bg-brand-700 text-white text-[10px] uppercase font-bold tracking-widest px-6 py-3 transition-colors"
          >
            Email Scent Concierge
          </a>
        </div>

      </div>
    </div>
  );
};
