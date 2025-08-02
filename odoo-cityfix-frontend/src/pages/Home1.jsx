import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Heart,
  ChevronDown,
  MoveHorizontal,
  MapPin,
  Clock,
  AlertTriangle,
  Camera,
  Send,
  TrendingUp,
  Globe,
  Leaf,
} from "lucide-react";
import "../index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

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
      <div className="text-teal-400 mb-4">
        {React.cloneElement(icon, { className: "w-12 h-12 mx-auto" })}
      </div>
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">
        {displayValue.toLocaleString()}+
      </p>
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
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("touchmove", handleMove);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto aspect-[16/12] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-2xl shadow-teal-900/20"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afterImg})` }}
      />
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${beforeImg})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
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

// --- HERO SECTION ---
const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="mb-8"
        >
          <div className="inline-flex items-center bg-teal-500/10 border border-teal-500/20 rounded-full px-6 py-2 text-teal-300 text-sm font-medium backdrop-blur-sm">
            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 animate-pulse"></div>
            Community-Driven Platform
          </div>
        </motion.div>

        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6"
        >
          <motion.span variants={wordVariants} className="block">
            CityFix
          </motion.span>
          <motion.span variants={wordVariants} className="text-teal-400 block">
            Reimagined
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Report local issues, track their resolution, and be part of the
          change.
          <span className="text-teal-300"> Connect your community</span> to a
          better future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <Link to="/track-issues">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-2xl shadow-teal-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Report Issue Now
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </Link>
          <Link to="/track-issues">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <MapPin className="w-5 h-5 mr-2" />
              View Nearby Reports
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-teal-300/70"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- NEARBY REPORTS SECTION ---
const NearbyReportsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const mockReports = [
    {
      id: 1,
      title: "Broken Streetlight on Park Avenue",
      category: "Infrastructure",
      status: "In Progress",
      timeAgo: "2 days ago",
      distance: "0.3 km",
      priority: "medium",
      votes: 15,
    },
    {
      id: 2,
      title: "Pothole near Central Mall",
      category: "Roads",
      status: "Reported",
      timeAgo: "5 hours ago",
      distance: "0.8 km",
      priority: "high",
      votes: 23,
    },
    {
      id: 3,
      title: "Overflowing Garbage Bin",
      category: "Sanitation",
      status: "Resolved",
      timeAgo: "1 week ago",
      distance: "1.2 km",
      priority: "low",
      votes: 8,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Reported":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Resolved":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-teal-50 border border-teal-100 rounded-full px-4 py-2 text-teal-600 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 mr-2" />
            Within 3km of your location
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your <span className="text-teal-600">Neighborhood</span> Reports
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with local issues and see real-time updates from your
            community members.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${getPriorityColor(
                    report.priority
                  )}`}
                />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                {report.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {report.timeAgo}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {report.distance} away
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                  {report.category}
                </span>
                <div className="flex items-center text-gray-400">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-xs">{report.votes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 text-teal-600 bg-teal-50 rounded-2xl font-semibold hover:bg-teal-100 transition-colors"
          >
            View All Reports
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// --- BEFORE AFTER SECTION (KEPT AS IS) ---
const BeforeAfterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-4xl aspect-square mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900">
            From <span className="text-[#00D5BE]">Reality</span> to Reality
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            See the tangible impact of community reports. A small contribution
            makes our environment clean and green.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BeforeAfterSlider
            afterImg="/images/before.png"
            beforeImg="/images/after.png"
          />
        </motion.div>
      </div>
    </section>
  );
};

// --- IMPACT SECTION ---
const ImpactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const impactStats = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Community",
      description: "Connected citizens across 50+ cities worldwide",
      metric: "50+",
      label: "Cities",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Environmental Impact",
      description: "Reduced carbon footprint through efficient reporting",
      metric: "2.5M",
      label: "CO₂ Saved",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Response Time",
      description: "Average issue resolution time improved significantly",
      metric: "65%",
      label: "Faster",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-br from-teal-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 text-teal-600 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4 mr-2" />
            Building a Better Tomorrow
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our Contribution to a{" "}
            <span className="text-teal-600">Cleaner World</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every report, every resolution, every community action contributes
            to building sustainable, responsive cities for future generations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg shadow-teal-500/10 text-teal-600 mb-6 group-hover:shadow-2xl group-hover:shadow-teal-500/20 transition-all"
              >
                {stat.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {stat.title}
              </h3>
              <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                {stat.description}
              </p>
              <div className="text-4xl font-black text-teal-600 mb-1">
                {stat.metric}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-12 text-center text-white shadow-2xl shadow-teal-500/25"
        >
          <h3 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are actively improving their
            communities, one report at a time.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-10 py-4 bg-white text-teal-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5 mr-2" />
            Start Reporting Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// --- STATS SECTION ---
const StatsSection = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">
            Our Collective Impact
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-teal-200">
            Every report contributes to a better tomorrow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            label="Hours Saved for Authorities"
            icon={<Zap />}
            delay={2}
          />
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
        {/* <NearbyReportsSection /> */}
        <BeforeAfterSection />
        <ImpactSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
