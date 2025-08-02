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


  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (e) => {
    const key = e.target.value;
    setQuery(key);

    if (key.length > 3) {
      const filtered = searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(key.toLowerCase()) ||
          item.content.toLowerCase().includes(key.toLowerCase()) ||
          item.description.toLowerCase().includes(key.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleNavigate = (item, link) => {
    setActiveNav(item);
    navigate(link);
    setShowMobileMenu(false);
  };

  const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <>
        <motion.header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? '' : 'bg-transparent'}`}>
        <div className={`bg-white/90 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-xl`}>
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

            <div className="flex items-center space-x-4 gap-2">
              {/* Search Bar  */}
              <div className="relative shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-full flex items-center gap-1 px-2 py-1.5 group duration-300">
                <Search className="w-5 h-5 rounded-full" />
                <input
                  type="text"
                  id="search"
                  value={query}
                  onChange={handleSearch}
                  className="w-full text-sm text-gray-900 placeholder:text-sm outline-none placeholder:text-gray-400 group-hover:placeholder:text-gray-600 duration-300  min-w-[280px] placeholder:hover:text-medium"
                  placeholder="Search..."
                />

                {/* Dropdown results */}
                {query.length > 3 && results.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-md mt-1 z-50 max-h-60 overflow-hidden">
                    <p className="text-sm px-2 pt-2 pb-1 font-medium text-gray-500 border-b border-gray-200 flex items-center gap-2">
                      Top Search Results
                    </p>
                    {results.map((item, index) => {
                      const highlightMatch = (text) => {
                        const parts = text.split(
                          new RegExp(`(${query})`, "gi")
                        );
                        return parts.map((part, i) =>
                          part.toLowerCase() === query.toLowerCase() ? (
                            <mark
                              key={i}
                              className="bg-teal-500 text-[#ffffff] rounded-sm px-1"
                            >
                              {part}
                            </mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        );
                      };

                      return (
                        <li
                          key={index}
                          className="group px-2 py-2 hover:bg-slate-100 cursor-pointer text-sm duration-300 border-b border-gray-200 flex items-center gap-3 w-full"
                          onClick={() => {
                            navigate(item.path);
                            setQuery("");
                            setResults([]);
                          }}
                        >
                          {/* Icon */}
                          <span className="flex-shrink-0">
                            <CornerUpRight className="w-6 h-6 text-gray-600 p-1 bg-slate-100 rounded-md" />
                          </span>

                          {/* Text + Hover Tick */}
                          <div className="flex flex-col overflow-hidden w-full">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold text-[13.5px] truncate">
                                {highlightMatch(item.title)}
                              </span>
                            </div>

                            <span className="text-gray-500 text-xs truncate w-full">
                              {highlightMatch(item.description)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {query.length > 1 && results.length === 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-sm mt-1 z-50 p-2.5 text-sm text-gray-500">
                    No results found ...
                  </div>
                )}
              </div>

              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 duration-500 cursor-pointer rounded-lg  focus:outline-none  transition-colors"
                  >
                    Login
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    ref={userIconRef}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm hover:shadow-lg focus:outline-none  transition-all duration-200"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.initials
                    )}
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 transform transition-all duration-250 ease-out animate-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">Welcome back!</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate("/dashboard");
                          // Navigate to dashboard
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                      >
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          // Navigate to settings
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>

                      <hr className="my-1 border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none  transition-colors duration-200"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
            </motion.header>

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
