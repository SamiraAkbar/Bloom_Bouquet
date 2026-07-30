import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="bg-brand-50 min-h-screen py-16 text-brand-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Boutique Inquiries</span>
          <h1 className="text-4xl font-serif italic text-gray-950 font-light ml-1">Contact Scent Concierge</h1>
          <div className="w-16 h-[1px] bg-brand-300 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coordinates */}
          <div className="lg:col-span-5 space-y-8 bg-brand-100/50 border border-brand-100 p-8 sm:p-10">
            <h2 className="font-serif italic text-xl text-gray-950 font-light mb-6 border-b border-brand-200 pb-3">The Scent Salons</h2>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-brand-500 mt-1 shrink-0" />
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-900 mb-1">Dhaka Flagship Atelier</h3>
                <p className="text-xs text-gray-650 font-light leading-relaxed">
                  House 22, Road 11, Banani, <br />
                  Dhaka 1213, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-brand-500 mt-1 shrink-0" />
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-900 mb-1">Gulshan Boutique</h3>
                <p className="text-xs text-gray-650 font-light leading-relaxed">
                  House 8, Road 79, Gulshan-2, <br />
                  Dhaka 1212, Bangladesh
                </p>
              </div>
            </div>

            <div className="border-t border-brand-200 pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+880 2 2222-6789</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>concierge@bloomandbouquet.com</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>Mon — Sat: 10:00 - 19:00 (BST)</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-brand-100 p-8 sm:p-10">
            <h2 className="font-serif italic text-xl text-gray-950 font-light mb-6">Send an Inquiry</h2>
            
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact_name" className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Name</label>
                      <input 
                        id="contact_name"
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-500 bg-brand-50 text-xs font-light text-brand-800"
                        placeholder="Your name..."
                      />
                    </div>
                    <div>
                      <label htmlFor="contact_email" className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Email</label>
                      <input 
                        id="contact_email"
                        type="email" 
                        required
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-500 bg-brand-50 text-xs font-light text-brand-800"
                        placeholder="Your email address..."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact_message" className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1">Inquiry details</label>
                    <textarea 
                      id="contact_message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-brand-100 focus:outline-none focus:border-brand-500 bg-brand-50 text-xs font-light text-brand-800"
                      placeholder="Specify your product, sillage preferences, or custom corporate requests..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white text-[10px] uppercase font-bold tracking-widest py-4 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Transmit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-brand-50 text-brand-700 border border-brand-100 text-center space-y-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-wider">Your Inquiry Was Received</p>
                  <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                    A dedicated scent advisor from our Dhaka flagship atelier will personally evaluate your words and respond within 24 business hours.
                  </p>
                  <button 
                    onClick={() => setSent(false)}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-600 hover:text-brand-400 mt-4 underline"
                  >
                    Send Another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};
