import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import "../index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Enhanced dummy data with more realistic content
const nearbyReports = [
  {
    id: 'CF-130',
    title: 'Broken Streetlight on Elm St.',
    category: 'Lighting',
    status: 'Reported',
    imageUrl: 'https://images.unsplash.com/photo-1588821321573-a25a3b37a83c?q=80&w=800&auto=format&fit=crop',
    priority: 'High',
    reportedBy: 'Sarah M.',
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
    reportedBy: 'Mike R.',
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
    reportedBy: 'Alex K.',
    timeAgo: '3 days ago',
    upvotes: 8
  },
];

const features = [
  {
    icon: '📍',
    title: 'Hyperlocal Focus',
    description: 'See issues within 3-5km radius of your location',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🔄',
    title: 'Real-time Tracking',
    description: 'Follow your report from submission to resolution',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'Upvote and collaborate on community issues',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: '⚡',
    title: 'Quick Reporting',
    description: 'Report issues in under 30 seconds',
    color: 'from-orange-500 to-red-500'
  }
];

// Enhanced SVG Icons
const ArrowRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const CheckCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Zap = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const Heart = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// Responsive floating particles component
const FloatingParticles = () => {
  const [particleCount, setParticleCount] = useState(20);

  useEffect(() => {
    const updateParticleCount = () => {
      if (window.innerWidth < 640) {
        setParticleCount(8);
      } else if (window.innerWidth < 1024) {
        setParticleCount(12);
      } else {
        setParticleCount(20);
      }
    };

    updateParticleCount();
    window.addEventListener('resize', updateParticleCount);
    return () => window.removeEventListener('resize', updateParticleCount);
  }, []);

  const particles = Array.from({ length: particleCount }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-teal-400/20 rounded-full"
      animate={{
        y: [-20, -40, -20],
        x: [-10, 10, -10],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ));
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
};

// Enhanced Status Badge with responsive design
const StatusBadge = ({ status, priority }) => {
  const statusStyles = {
    'Reported': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'In Progress': 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    'Resolved': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  };
  
  const priorityDot = {
    'Critical': 'bg-red-500 animate-pulse',
    'High': 'bg-orange-500',
    'Medium': 'bg-yellow-500',
    'Low': 'bg-green-500'
  };

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-2"
    >
      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${priorityDot[priority]}`}></div>
      <span className={`text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm ${statusStyles[status]} shadow-lg`}>
        {status}
      </span>
    </motion.div>
  );
};

// Responsive animated counter
const AnimatedCounter = ({ value, label, icon, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const end = value;
        const duration = 2000;
        const incrementTime = duration / end;
        
        const counter = setInterval(() => {
          start += Math.ceil(end / 50);
          if (start >= end) {
            setDisplayValue(end);
            clearInterval(counter);
          } else {
            setDisplayValue(start);
          }
        }, incrementTime);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);
    
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:border-teal-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10">
        <div className="text-teal-400 mb-3 sm:mb-4 lg:mb-6 transform group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon, { className: 'w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto' })}
        </div>
        <p className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
          {displayValue.toLocaleString()}+
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium">{label}</p>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};

// Fully responsive Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      />
      
      {/* Responsive floating geometric shapes */}
      <motion.div style={{ y: y1 }} className="absolute top-10 sm:top-20 left-4 sm:left-10 lg:left-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-xl"></motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 lg:right-20 w-24 sm:w-32 lg:w-48 h-24 sm:h-32 lg:h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></motion.div>
      <motion.div style={{ y: y1 }} className="absolute top-1/2 left-2 sm:left-5 lg:left-10 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-gradient-to-r from-green-500/20 to-teal-500/20 rotate-45 blur-xl"></motion.div>
      
      <FloatingParticles />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
            🚀 Trusted by 50,000+ citizens nationwide
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent block">
            Transform Your
          </span>
          <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent block">
            Community
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
        >
          The most advanced civic engagement platform that connects citizens with local authorities. 
          Report issues, track progress, and witness real change in your neighborhood.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(45, 212, 191, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl sm:rounded-2xl font-bold text-white text-base sm:text-lg shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2 sm:gap-3">
              🔥 Report Issue Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl font-bold text-white text-base sm:text-lg hover:bg-white/20 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2 sm:gap-3">
              📍 Explore Reports
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🗺️
              </motion.div>
            </span>
          </motion.button>
        </motion.div>

        {/* Responsive Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-4"
        >
          {[
            { number: '15K+', label: 'Issues Resolved' },
            { number: '50+', label: 'Cities Active' },
            { number: '98%', label: 'Satisfaction Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div 
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Fully responsive Nearby Reports Section
const NearbyReportsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [filter, setFilter] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50/50 to-blue-50/50 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            📍 Live Updates from Your Area
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
            Community Issues
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent block sm:inline"> Near You</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Stay connected with your community. See what issues your neighbors are reporting 
            and track the progress of local improvements within a 5km radius.
          </p>
        </motion.div>

        {/* Responsive Filter buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8 sm:mb-12 px-4"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-gray-200 w-full max-w-md sm:max-w-none sm:w-auto">
            <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-0">
              {['All', 'Reported', 'In Progress', 'Resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    filter === status 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {nearbyReports.map((report, i) => (
            <motion.div
              key={report.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ y: -8, rotateX: 5 }}
              onHoverStart={() => setHoveredCard(report.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative overflow-hidden">
                <motion.img 
                  className="h-48 sm:h-56 lg:h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={report.imageUrl} 
                  alt={report.title}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <StatusBadge status={report.status} priority={report.priority} />
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-3">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 sm:px-3 py-1 rounded-full w-fit">
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-500">{report.timeAgo}</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                  {report.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {report.reportedBy.charAt(0)}
                    </div>
                    <span className="truncate">by {report.reportedBy}</span>
                  </div>
                  
                  <motion.div 
                    className="flex items-center gap-1 text-xs sm:text-sm text-gray-500"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    <span>{report.upvotes}</span>
                  </motion.div>
                </div>
              </div>

              {/* Hover overlay - only on larger screens */}
              <AnimatePresence>
                {hoveredCard === report.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hidden sm:flex absolute inset-0 bg-gradient-to-br from-teal-500/90 to-blue-600/90 items-center justify-center"
                  >
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    >
                      View Details →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16 px-4"
        >
          <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-xl sm:rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base">
            View All Reports in Your Area
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Responsive Features Section
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gray-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Why Choose
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent block sm:inline"> CityFix?</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Experience the future of civic engagement with cutting-edge features designed for maximum impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-teal-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 h-full">
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Responsive Stats Section
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5"></div>
      <FloatingParticles />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Impact That
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent block sm:inline"> Matters</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Every report creates a ripple effect of positive change in communities nationwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <AnimatedCounter 
            value={15420} 
            label="Issues Resolved" 
            icon={<CheckCircle />} 
            delay={0}
          />
          <AnimatedCounter 
            value={50000} 
            label="Active Citizens" 
            icon={<Users />} 
            delay={1}
          />
          <AnimatedCounter 
            value={12000} 
            label="Hours Saved" 
            icon={<Zap />} 
            delay={2}
          />
        </div>

        {/* Additional responsive impact metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Real Stories, Real Change</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-teal-400">98%</p>
                <p className="text-gray-400 text-sm sm:text-base">Resolution Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400">72h</p>
                <p className="text-gray-400 text-sm sm:text-base">Avg Response Time</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-400">4.9/5</p>
                <p className="text-gray-400 text-sm sm:text-base">User Satisfaction</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Responsive Call to Action Section
const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <FloatingParticles />
      
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Ready to Transform Your Community?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Join thousands of citizens who are already making a difference. 
            Start reporting issues and see real change happen in your neighborhood.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-gray-900 font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors duration-300 shadow-xl"
            >
              🚀 Get Started Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300"
            >
              📱 Download App
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <NearbyReportsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
