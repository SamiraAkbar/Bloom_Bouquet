import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Award, Compass, Wind } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Our Heritage</span>
          <h1 className="text-4xl md:text-5xl font-serif italic text-gray-950 font-light leading-snug">
            The Art of Fine <span className="font-normal not-italic text-brand-500">Perfumery</span>
          </h1>
          <div className="w-24 h-[1px] bg-brand-300 mx-auto mt-6"></div>
        </div>

        {/* Hero Image Block */}
        <div className="relative mb-20 overflow-hidden bg-brand-100 aspect-[21/9] border border-brand-100 shadow-sm">
          <img 
            src="/src/assets/images/about_perfume_heritage_banner_1780570764215.png" 
            alt="Artisanal perfume formulation" 
            className="w-full h-full object-cover animate-fade-in"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/45 via-brand-900/10 to-transparent"></div>
        </div>

        {/* Content Section 1: Philosophy & Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-2xl font-serif italic text-gray-950 font-light mb-6">Our Olfactory Philosophy</h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              At Bloom & Bouquet, we define perfumery as the visual translation of memories and raw nature into atmosphere. Founded in Grasse, France, the absolute epicenter of high perfumery, our small laboratory blends the centuries-old art of botanical extractions with contemporary formulation.
            </p>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              We do not synthesize. Every single decant boasts 100% natural flower absolutes, sustainably distilled rose petals, cold-pressed citrus zests, and precious organic oud oil. We design fragrances that do not merely sit on your skin—they interact with your natural body temperature to produce a uniquely individual sillage.
            </p>
          </div>
          <div className="border border-brand-200 bg-white p-8 relative">
            <div className="absolute top-4 left-4 border-l border-t border-brand-200 w-8 h-8"></div>
            <div className="absolute bottom-4 right-4 border-b border-r border-brand-200 w-8 h-8"></div>
            <span className="text-brand-500 font-serif italic text-4xl block mb-4">“</span>
            <p className="text-base text-gray-800 font-serif italic font-light leading-relaxed mb-6">
              "A perfume is a temple of silence. It is the invisible conversation between who you are and the world that surrounds you."
            </p>
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-800">— S. Vance, Chief Perfumer</span>
          </div>
        </div>

        {/* Sourcing and Standards Grid */}
        <div className="bg-white border border-brand-100 p-8 sm:p-12 shadow-sm rounded-none mb-24">
          <div className="text-center mb-12">
            <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-400">Our Pillars</span>
            <h3 className="text-xl md:text-2xl font-serif italic text-gray-900 mt-1">Sustainably Harvested Absolutes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-brand-50 text-brand-500 rounded-full">
                <Leaf className="w-5 h-5 pointer-events-none" />
              </div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-900">100% Vegan & Bio</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">We refuse simulated fixatives. No phthalates, petroleums, or animal by-products.</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-brand-50 text-brand-500 rounded-full">
                <Compass className="w-5 h-5 pointer-events-none" />
              </div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-900">Conscious Origin</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Our Jasmine Sambac is harvested at pre-dawn in India. Our Vetiver is micro-farmed in Haiti.</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-brand-50 text-brand-500 rounded-full">
                <Wind className="w-5 h-5 pointer-events-none" />
              </div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-900">Complex Shifts</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Our formulation ensures beautiful, long-lasting dry-down with exquisite longevity.</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-brand-50 text-brand-500 rounded-full">
                <Award className="w-5 h-5 pointer-events-none" />
              </div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-900">Artisanal Decanting</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Every premium flacon is sealed by hand with gold foil wrap in numbered collections.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Laboratory craftsmanship */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative order-last lg:order-first">
            <div className="aspect-[4/5] bg-brand-100 border border-brand-200 p-2 pb-6 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600" 
                alt="Distilling botanicals" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 block">The Laboratory</span>
            <h3 className="text-3xl font-serif italic text-gray-950 font-light">Crafted With Extreme Precision</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Before a bottle leaves our boutique, each batch undergoes a 6-week maceration and cold filtration process. This patient maturation allows molecular bonding between raw woody resins and volatile top oils. The result is a smooth, atmospheric transition that is safe for sensitive skin and exquisitely comforting.
            </p>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              When you wear a perfume by Bloom & Bouquet, you buy into an unbroken chain of human craftsmanship. From the flower fields of Provence to our clean formulation lab, we build masterpieces designed to outlive trends.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
