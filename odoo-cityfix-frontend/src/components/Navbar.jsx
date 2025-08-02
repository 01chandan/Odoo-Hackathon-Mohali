import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  Search,
  MapPin,
  Loader2,
  AlertCircle,
  CornerUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookies, cleanCookies } from "../utils/cookies";
import { useAlert } from "./GlobalAlert/AlertContext";
import { searchableItems } from "../utils/searchContent";

// --- Location Component with Google Geocoding API ---
const LocationDisplay = memo(() => {
  const [location, setLocation] = useState("Fetching location...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    if (!navigator.geolocation) {
      if (isMounted) {
        setStatus("error");
        setLocation("Geolocation not supported.");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isMounted) return;
        const { latitude, longitude } = position.coords;
        const API_KEY = "AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY";
        
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.status === "OK" && isMounted) {
            const address = data.results[0]?.address_components;
            const find = (type) => address?.find(c => c.types.includes(type))?.long_name;
            const sublocality = find("sublocality_level_1") || find("neighborhood");
            const city = find("locality");
            setLocation(sublocality && city ? `${sublocality}, ${city}` : city || "Your Location");
            setStatus("success");
          } else {
            throw new Error(`Geocoding failed: ${data.status}`);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching location name:", error);
            setStatus("error");
            setLocation("Could not fetch location.");
          }
        }
      },
      () => {
        if (isMounted) {
          setStatus("error");
          setLocation("Location access denied.");
        }
      }
    );

    return () => { isMounted = false; };
  }, []);

  const locationIcons = {
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    success: <MapPin className="w-4 h-4 text-teal-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 ml-4 hidden sm:flex">
      {locationIcons[status]}
      <span className="truncate max-w-[150px]">{location}</span>
    </div>
  );
});

// --- MAIN HEADER COMPONENT ---
export default function ProfessionalHeader() {
  const { triggerAlert } = useAlert();
  const navigate = useNavigate();
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Deriving auth state from cookies/localStorage
  const accessToken = getCookie("access_token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  const [userdata, setUserdata] = useState(null);

  const [activeNav, setActiveNav] = useState("Home");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);

  // Effect to load user data from localStorage when logged in
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const storedUserData = JSON.parse(localStorage.getItem("user_data"));
        if (storedUserData) {
          setUserdata(storedUserData);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    } else {
      setUserdata(null);
    }
  }, [isLoggedIn]);

  // User object derived from state
  const user = {
    email: userdata?.email,
    name: `${userdata?.first_name || ''} ${userdata?.last_name || ''}`.trim(),
    initials: `${userdata?.first_name?.[0] || ''}${userdata?.last_name?.[0] || ''}`,
  };

  // Auth check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/check_auth/", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: getCookie("access_token"),
            refresh_token: getCookie("refresh_token"),
          }),
        });
        const data = await response.json();
        if (data.authenticated) {
          if (data.access) {
            setCookies(data);
          }
          setIsLoggedIn(true);
        } else if (data.authenticated === false) {
          handleLogout(false); // Logout without showing alert
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    checkAuth();
  }, []);

  const navItems = {
    Home: "/",
    Issues: "/track-issues",
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        userIconRef.current && !userIconRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (showAlert = true) => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    cleanCookies();
    localStorage.removeItem("user_data");
    if (showAlert) {
      triggerAlert("Logged out successfully.");
      setTimeout(() => triggerAlert(""), 3000);
    }
    navigate("/");
  };

  const handleSearch = (e) => {
    const key = e.target.value;
    setQuery(key);
    if (key.length > 2) {
      setResults(searchableItems.filter(item => 
        item.title.toLowerCase().includes(key.toLowerCase()) ||
        item.description.toLowerCase().includes(key.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  };

  const handleNavigate = (item, link) => {
    setActiveNav(item);
    navigate(link);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="bg-transparent m-3 sticky top-4 z-40">
        <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-xl">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-2">
              <button onClick={() => handleNavigate("Home", "/")} className="flex-shrink-0">
                <img src="/images/logo.svg" className="h-9" alt="CityFix Logo" />
              </button>
              <LocationDisplay />
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              {Object.entries(navItems).map(([item, link]) => (
                <button key={item} onClick={() => handleNavigate(item, link)} className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-300 rounded-lg">
                  {activeNav === item && <motion.span layoutId="activePill" className="absolute inset-0 bg-teal-50 rounded-lg z-0" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                  <span className="relative z-10">{item}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input type="text" value={query} onChange={handleSearch} className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition-all" placeholder="Search issues..." />
                <AnimatePresence>
                {query.length > 2 && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {results.length > 0 ? (
                      <ul>
                        {results.map((item) => (
                          <li key={item.path}>
                            <button onClick={() => { handleNavigate(item.title, item.path); setQuery(''); setResults([]); }} className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors">
                              <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-gray-500">No results found.</p>
                    )}
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {isLoggedIn ? (
                <div className="relative">
                  <button ref={userIconRef} onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm hover:ring-4 hover:ring-teal-500/20 focus:outline-none transition-all">
                    {user.initials || '...'}
                  </button>
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div ref={dropdownRef} initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15, ease: "easeOut" }} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500">Welcome back!</p>
                        </div>
                        <div className="py-1">
                          <button onClick={() => { setShowUserDropdown(false); navigate('/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"><Home className="w-4 h-4" /> Dashboard</button>
                          <button onClick={() => { setShowUserDropdown(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"><Settings className="w-4 h-4" /> Settings</button>
                        </div>
                        <div className="pt-1 border-t border-gray-100">
                          <button onClick={() => handleLogout()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" /> Logout</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="px-5 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 transition-colors cursor-pointer rounded-full focus:outline-none">
                  Login
                </button>
              )}
              
              <div className="lg:hidden">
                <button onClick={() => setShowMobileMenu(true)} className="p-2 rounded-md text-gray-600">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30" onClick={() => setShowMobileMenu(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-lg">Menu</h3>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <nav className="p-4">
                {Object.entries(navItems).map(([item, link]) => (
                  <button key={item} onClick={() => handleNavigate(item, link)} className={`w-full text-left px-4 py-3 rounded-lg font-medium ${activeNav === item ? 'bg-teal-50 text-teal-600' : 'text-gray-700'}`}>
                    {item}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
