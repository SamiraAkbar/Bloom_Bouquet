import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Star, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Quote, 
  Heart, 
  ShoppingBag, 
  TrendingUp, 
  Leaf, 
  Award 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

// Mock customer testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: "Genevieve Thorne",
    role: "Collector & Scent Enthusiast",
    rating: 5,
    quote: "Rose Oud Lumineuse has completely redefined my fragrance wardrobe. It is warm, sophisticated, and stays on the skin like a delicate velvet veil. Absolute luxury in a bottle.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Julian Vance",
    role: "GQ Stylist",
    rating: 5,
    quote: "The Santal Impérial works miracles. Woodsy yet creamy, it's a scent that draws comments wherever I go. Bloom & Bouquet's presentation and bottle design are stunning masterpieces.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Amara Lin",
    role: "Wellness Blogger",
    rating: 5,
    quote: "As someone highly sensitive to synthetic fumes, I adore their commitment to natural precious flower absolutes. Jardin de Jasmin feels like a fresh botanical garden at sunrise.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
  }
];

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position for high-end parallax movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Carousel State for New Arrivals / Best Sellers
  const [carouselTab, setCarouselTab] = useState<'new' | 'bestsellers'>('new');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Autoplay for Testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000); // 5 seconds autoplay delay

    return () => clearInterval(interval);
  }, [currentTestimonial]);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching homepage products:", err);
        setLoading(false);
      });
  }, []);

  // Filter products for sections
  const trendingProducts = products.filter(p => p.inStock).slice(0, 3);
  const carouselProducts = products.filter(p => 
    carouselTab === 'new' ? (p.id === '2' || p.id === '5' || p.id === '6') : (p.id === '1' || p.id === '3' || p.id === '4')
  );

  const handleNextCarousel = () => {
    if (carouselProducts.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const handlePrevCarousel = () => {
    if (carouselProducts.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-50 overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Soft elegant gradient blur and video-image overlay */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(1.05)`,
          }}
        >
          <img 
            src="/src/assets/images/perfume_vanity_hero_1780569486342.png"
            alt="Bloom & Bouquet Premium Perfume Spray"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Velvety light pink-rose vintage overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-950/40 to-brand-950/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/50 to-transparent"></div>
        </div>

        <div 
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white will-change-transform"
          style={{
            transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
            opacity: Math.max(0, 1 - scrollY / 700),
          }}
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-brand-100">La Collection Royale</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-6 italic"
            >
              Your Signature <br />
              <span className="font-normal not-italic text-brand-200">Scent</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-base md:text-lg text-brand-100/90 mb-10 font-light tracking-wide leading-relaxed"
            >
              Artisanal French perfumery curated with hand-harvested blossoms, amber resins, and noble woods. Indulge in an exquisite sensory journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center space-x-3 bg-brand-200 hover:bg-brand-300 text-brand-900 text-xs uppercase tracking-widest font-bold px-8 py-4 transition-all hover:shadow-lg shadow-brand-900/20 cursor-pointer"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#story"
                className="inline-flex items-center justify-center space-x-3 border border-white/40 hover:border-white text-white text-xs uppercase tracking-widest font-bold px-8 py-4 bg-white/5 backdrop-blur-sm transition-all cursor-pointer"
              >
                <span>Our Heritage</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Elegant down scroll indicator line */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 opacity-70">
          <span className="text-[8px] uppercase tracking-[0.4em] text-white">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Curated Ensembles</span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900 font-light">Explore Categories</h2>
            <p className="text-gray-500 text-xs max-w-md mx-auto mt-2 font-light">Perfect balances of top, heart, and base notes tailored for every identity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category: Women */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group relative h-[450px] overflow-hidden bg-brand-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800" 
                alt="Women's Perfumes" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[9px] uppercase tracking-[0.3em] text-brand-200 block mb-1">Delicate & Floral</span>
                <h3 className="text-2xl font-serif italic font-light mb-4">Women's Essences</h3>
                <Link to="/shop?category=women" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-white hover:text-brand-200 transition-colors">
                  <span>Discover Women</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Category: Men */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group relative h-[450px] overflow-hidden bg-brand-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800" 
                alt="Men's Colognes" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[9px] uppercase tracking-[0.3em] text-brand-200 block mb-1">Crisp, Bold & Smoked</span>
                <h3 className="text-2xl font-serif italic font-light mb-4">Men's Fragrances</h3>
                <Link to="/shop?category=men" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-white hover:text-brand-200 transition-colors">
                  <span>Discover Men</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Category: Unisex */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group relative h-[450px] overflow-hidden bg-brand-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800" 
                alt="Unisex Fragrances" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[9px] uppercase tracking-[0.3em] text-brand-200 block mb-1">Harmonious & Avant-Garde</span>
                <h3 className="text-2xl font-serif italic font-light mb-4">Unisex Blends</h3>
                <Link to="/shop?category=unisex" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-white hover:text-brand-200 transition-colors">
                  <span>Discover Unisex</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Scent of the season</span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900 font-light flex items-center gap-2">
                <span className="text-brand-400 not-italic font-sans">#</span>
                Trending Masterpieces
              </h2>
            </div>
            <Link to="/shop" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-500 hover:text-brand-600 border-b border-brand-200 pb-1">
              <span>View full wardrobe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white border border-brand-100 p-4 h-[400px] flex flex-col justify-end">
                  <div className="h-6 w-1/3 bg-gray-200 mb-4 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-brand-100">
               <p className="text-sm font-serif italic text-gray-500">Our signature collection is currently dry. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {trendingProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. NEW ARRIVALS / BEST SELLERS CAROUSEL SLIDER */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex space-x-4 border-b border-brand-100 pb-2">
              <button 
                onClick={() => { setCarouselTab('new'); setCarouselIndex(0); }}
                className={`text-[11px] uppercase tracking-[0.25em] font-bold pb-2 transition-all ${carouselTab === 'new' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-brand-500'}`}
              >
                New Additions
              </button>
              <span className="text-gray-200">|</span>
              <button 
                onClick={() => { setCarouselTab('bestsellers'); setCarouselIndex(0); }}
                className={`text-[11px] uppercase tracking-[0.25em] font-bold pb-2 transition-all ${carouselTab === 'bestsellers' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400 hover:text-brand-500'}`}
              >
                Prestige Best Sellers
              </button>
            </div>
          </div>

          <div className="relative mt-12 bg-brand-50 border border-brand-100 p-8 sm:p-12 md:max-w-4xl mx-auto">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center italic text-gray-400">Loading fine fragrances...</div>
            ) : carouselProducts.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center italic text-gray-400">No items categorized in this segment yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Carousel Image container */}
                <div className="aspect-[3/4] md:h-[400px] overflow-hidden bg-brand-100 relative shadow-sm border border-brand-100">
                  <motion.img 
                    key={carouselProducts[carouselIndex].id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    src={carouselProducts[carouselIndex].imageUrl}
                    alt={carouselProducts[carouselIndex].name}
                    className="w-full h-full object-cover"
                  />
                  {carouselTab === 'new' ? (
                    <div className="absolute top-4 left-4 bg-brand-500 text-white text-[8px] uppercase tracking-[0.25em] px-2 py-1 font-bold">New Arrival</div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-brand-600 text-white text-[8px] uppercase tracking-[0.25em] px-2 py-1 font-bold">Best Seller</div>
                  )}
                </div>

                {/* Carousel Info Card */}
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-2">Category: {carouselProducts[carouselIndex].category}</span>
                  <h3 className="text-3xl font-serif italic text-brand-800 font-light mb-3">{carouselProducts[carouselIndex].name}</h3>
                  
                  {/* Rating presentation */}
                  <div className="flex items-center space-x-1.5 mb-4 text-brand-400">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">({carouselProducts[carouselIndex].rating || '4.9'})</span>
                  </div>

                  <p className="text-sm text-gray-500 font-light leading-relaxed mb-6 italic">
                    "{carouselProducts[carouselIndex].description}"
                  </p>

                  <div className="flex items-baseline space-x-2 mb-8">
                    <span className="text-2xl font-light text-brand-900">${Number(carouselProducts[carouselIndex]?.price || 0).toFixed(2)}</span>
                    <span className="text-xs text-gray-400 font-mono tracking-wider">USD</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Link 
                      to={`/product/${carouselProducts[carouselIndex].id}`}
                      className="bg-brand-600 text-white hover:bg-brand-700 text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-3.5 transition-all text-center flex-grow"
                    >
                      Examine Fragrance
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Slider Navigation Controls */}
            {!loading && carouselProducts.length > 1 && (
              <div className="absolute md:bottom-12 md:right-12 bottom-4 right-4 flex items-center space-x-3">
                <button 
                  onClick={handlePrevCarousel}
                  className="p-2 border border-brand-200 bg-white text-gray-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors rounded-full shadow-sm cursor-pointer"
                  aria-label="Previous fragrance"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{carouselIndex + 1}/{carouselProducts.length}</span>
                <button 
                  onClick={handleNextCarousel}
                  className="p-2 border border-brand-200 bg-white text-gray-600 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors rounded-full shadow-sm cursor-pointer"
                  aria-label="Next fragrance"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="story" className="py-24 bg-brand-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Elegant asymmetrical image collage design */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/5] bg-brand-200/40 border border-brand-200 p-4 pb-8 shadow-sm">
                <img 
                  src="/src/assets/images/perfume_story_image_1780568798742.png" 
                  alt="Precious rose absolutes distillation" 
                  className="w-full h-full object-cover shadow-inner"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-1/2 aspect-square border-8 border-brand-50 shadow-lg hidden md:block">
                <img 
                  src="/src/assets/images/artisan_perfume_filling_1780570612754.png" 
                  alt="Floral perfume bottle formulation" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Content layout */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 block">Our Heritage</span>
              <h2 className="text-4xl font-serif italic text-gray-950 font-light leading-snug">
                Born in Grasse, <br />
                <span className="not-italic font-normal text-brand-500">Perfected</span> in wild hearts.
              </h2>
              <div className="w-20 h-[1px] bg-brand-300"></div>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                At Bloom & Bouquet, we view perfumery as an orchestration of nature's deepest secrets. Every single essence is distilled over weeks in traditional wood-fired coppers, capturing the untamable energy of nocturnal jasmine, sacred sandalwood, and royal peonies.
              </p>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                We design complex, atmospheric fragrance shifts that evolve with your natural warmth. Uncompromisingly botanical, sustainable, and entirely vegan. Built for the modern aesthete.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-start space-x-3">
                  <Leaf className="w-5 h-5 text-brand-400 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800">100% Pure Absolutes</h4>
                    <p className="text-[11px] text-gray-400 font-light mt-1">Direct from Grasse growers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-brand-400 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800">Artisanal Small Batches</h4>
                    <p className="text-[11px] text-gray-400 font-light mt-1">Numbered collectable decants</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SPECIAL OFFERS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-brand-600 text-white py-16 px-8 sm:px-16 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Sparkles backdrop effect */}
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1512207724313-a4e675ec79ab?auto=format&fit=crop&q=80&w=1200" 
                alt="Rose gold background essence" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 max-w-xl">
              <span className="text-[9px] uppercase tracking-[0.3em] text-brand-200 font-bold block mb-2">Exquisite Privilege</span>
              <h2 className="text-3xl sm:text-4xl font-serif italic font-light mb-4 text-brand-50">
                Scent of Solstice: <span className="font-normal not-italic text-brand-300">20% Off</span>
              </h2>
              <p className="text-xs sm:text-sm text-brand-100/90 font-light leading-relaxed mb-6">
                Receive an automatic 20% discount on any purchase exceeding $150. Includes our luxury hand-blown signature velvet case and 3 complimentary discovery decants.
              </p>
              <div className="inline-flex items-center space-x-4">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-1 border border-brand-300 rounded font-bold text-brand-200">CODE: SOLSTICE20</span>
                <span className="text-[10px] text-brand-100/60 font-light">Limited time only</span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link 
                to="/shop" 
                className="inline-flex items-center space-x-2 bg-brand-50 hover:bg-brand-100 text-brand-900 border-none font-bold uppercase tracking-widest text-[10px] px-8 py-4 transition-all shadow-md"
              >
                <span>Acquire Privilege</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (TESTIMONIALS SLIDER) */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-500 mb-3 block">Society Voices</span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900 font-light">The Connoisseur Testimonials</h2>
          </div>

          <div className="relative bg-white border border-brand-100 p-8 sm:p-16 text-center max-w-3xl mx-auto shadow-sm">
            
            {/* Testimonials Quote Symbol */}
            <div className="flex justify-center mb-8">
              <Quote className="w-10 h-10 text-brand-200 stroke-1" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={TESTIMONIALS[currentTestimonial].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex justify-center text-amber-400 mb-4">
                  {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-base sm:text-lg text-gray-800 font-light font-serif italic leading-relaxed">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </p>

                <div className="flex flex-col items-center mt-6">
                  <img 
                    src={TESTIMONIALS[currentTestimonial].avatar} 
                    alt={TESTIMONIALS[currentTestimonial].name} 
                    className="w-14 h-14 rounded-full object-cover border border-brand-100 mb-3"
                  />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-900">{TESTIMONIALS[currentTestimonial].name}</h4>
                  <span className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">{TESTIMONIALS[currentTestimonial].role}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonials controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 right-4 sm:right-6 flex justify-between pointer-events-none">
              <button 
                onClick={handlePrevTestimonial}
                className="p-1.5 border border-brand-100 bg-white hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors pointer-events-auto rounded-full shadow-sm cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextTestimonial}
                className="p-1.5 border border-brand-100 bg-white hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors pointer-events-auto rounded-full shadow-sm cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${currentTestimonial === index ? 'w-4 bg-brand-500' : 'bg-brand-200'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-brand-50 border border-brand-100 p-8 sm:p-16 relative">
          
          <div className="absolute top-4 left-4 border-l border-t border-brand-200 w-10 h-10"></div>
          <div className="absolute bottom-4 right-4 border-r border-b border-brand-200 w-10 h-10"></div>

          <div className="max-w-xl mx-auto">
            <div className="inline-flex justify-center p-3 bg-white border border-brand-100 rounded-full mb-6 text-brand-400">
              <Mail className="w-5 h-5" />
            </div>

            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-500 block mb-3">Newsletter</span>
            <h2 className="text-3xl font-serif italic text-gray-950 font-light mb-4">Subscribe to Private Releases</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto mb-8 font-light">
              Gain exclusive first-access invites to our seasonal decant drops, rare botanical extractions, and secret society private sales.
            </p>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form 
                  key="newsletter-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe} 
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input 
                    id="email"
                    type="email" 
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-3 text-xs bg-white border border-brand-200 focus:outline-none focus:border-brand-500 font-light rounded-none text-brand-800"
                  />
                  <button 
                    type="submit" 
                    className="bg-brand-600 hover:bg-brand-700 text-white text-[10px] uppercase font-bold tracking-widest px-6 py-3 transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="newsletter-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold uppercase tracking-wider max-w-md mx-auto"
                >
                  Welcome to Bloom & Bouquet's Inner Circle. Privileges awaits.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
};
