import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Zap, Heart, ChevronDown, MoveHorizontal } from 'lucide-react';
import "../index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- MOCK DATA ---
const nearbyReports = [
  {
    id: 'CF-130',
    title: 'Broken Streetlight on Elm St.',
    category: 'Lighting',
    status: 'Reported',
    imageUrl: 'https://images.unsplash.com/photo-1588821321573-a25a3b37a83c?q=80&w=800&auto=format&fit=crop',
    priority: 'High',
    timeAgo: '2 hours ago',
    upvotes: 12
  },
  {
    id: 'CF-129',
    title: 'Deep pothole causing vehicle damage',
    category: 'Roads',
    status: 'In Progress',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
    priority: 'Critical',
    timeAgo: '1 day ago',
    upvotes: 28
  },
  {
    id: 'CF-127',
    title: 'Overflowing waste bin attracting pests',
    category: 'Cleanliness',
    status: 'Resolved',
    imageUrl: 'https://images.unsplash.com/photo-1604735533923-7e4b524512d7?q=80&w=800&auto=format&fit=crop',
    priority: 'Medium',
    timeAgo: '3 days ago',
    upvotes: 8
  },
];

const features = [
  { icon: '📍', title: 'Hyperlocal Focus', description: 'See issues within a 3-5km radius.' },
  { icon: '🔄', title: 'Real-time Tracking', description: 'Follow your report from submission to resolution.' },
  { icon: '🤝', title: 'Community Driven', description: 'Upvote and collaborate on community issues.' },
  { icon: '⚡', title: 'Quick Reporting', description: 'Report issues in under 30 seconds.' }
];

// --- REUSABLE & ANIMATED COMPONENTS ---

const AnimatedCounter = ({ value, label, icon, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const increment = end / totalFrames;

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, frameDuration);
      return () => clearInterval(counter);
    }
  }, [isInView, value]);
    
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
      className="text-center"
    >
      <div className="text-teal-400 mb-4">{React.cloneElement(icon, { className: 'w-12 h-12 mx-auto' })}</div>
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">{displayValue.toLocaleString()}+</p>
      <p className="text-base md:text-lg text-gray-400">{label}</p>
    </motion.div>
  );
};

const BeforeAfterSlider = ({ beforeImg, afterImg }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);

    const handleMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percent);
    };

    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-4xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-2xl shadow-teal-900/20">
            <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afterImg})` }} />
            <motion.div 
                className="absolute inset-0 w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${beforeImg})`, clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} 
            />
            <motion.div 
                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <MoveHorizontal className="w-5 h-5 text-teal-700" />
                </div>
            </motion.div>
        </div>
    );
};


 

const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="https://cdn.pixabay.com/video/2020/06/11/42443-432838942_large.mp4"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-shadow-lg"
        >
          <motion.span variants={wordVariants}>Your</motion.span>{" "}
          <motion.span variants={wordVariants}>Community,</motion.span>{" "}
          <motion.span variants={wordVariants} className="text-teal-400">
            Reimagined.
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 text-shadow"
        >
          Report local issues, track their resolution, and be part of the change. CityFix connects you to a better neighborhood.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a href="#" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-teal-500 rounded-lg shadow-lg hover:bg-teal-600 transform hover:-translate-y-1 transition-all">
            Report an Issue Now
          </a>
           <a href="#" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm hover:bg-white/20 transform hover:-translate-y-1 transition-all">
            View Nearby Reports
          </a>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/70"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  );
};
const NearbyReportsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const controls = useAnimation();
    useEffect(() => { if (isInView) controls.start("visible"); }, [isInView, controls]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } })
    };

    return (
        <section ref={ref} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">What's Happening Nearby</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Live updates on issues reported by your neighbors.</p>
                </motion.div>
                <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                    {nearbyReports.map((report, i) => (
                        <motion.div
                            key={report.id} custom={i} variants={cardVariants} initial="hidden" animate={controls}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
                        >
                            <div className="relative">
                                <img className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500" src={report.imageUrl} alt={report.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <span className="text-sm font-semibold bg-teal-500/80 px-3 py-1 rounded-full">{report.category}</span>
                                    <h3 className="mt-2 text-xl font-bold">{report.title}</h3>
                                </div>
                            </div>
                            <div className="p-6 flex justify-between items-center text-sm text-gray-600">
                                <p>{report.timeAgo}</p>
                                <div className="flex items-center gap-1 text-red-500">
                                    <Heart className="w-4 h-4" />
                                    <span>{report.upvotes}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BeforeAfterSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    return (
        <section ref={ref} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">From Report to Reality</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        See the tangible impact of community reports. A small contribution makes our environment clean and green.
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
                    <BeforeAfterSlider
                        afterImg="/images/before.png"
                        beforeImg="/images/after.png"
                    />
                </motion.div>
            </div>
        </section>
    );
};

const StatsSection = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Our Collective Impact</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-teal-200">Every report contributes to a better tomorrow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCounter value={15420} label="Issues Resolved" icon={<CheckCircle />} delay={0} />
          <AnimatedCounter value={50000} label="Active Citizens" icon={<Users />} delay={1} />
          <AnimatedCounter value={12000} label="Hours Saved for Authorities" icon={<Zap />} delay={2} />
        </div>
      </div>
    </section>
  );
};
 

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <NearbyReportsSection />
        <BeforeAfterSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
