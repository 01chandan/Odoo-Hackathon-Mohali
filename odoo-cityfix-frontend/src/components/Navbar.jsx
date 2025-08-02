import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  Search,
  CornerUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookies, cleanCookies } from "../utils/cookies";
import { useAlert } from "./GlobalAlert/AlertContext";
import { searchableItems } from "../utils/searchContent";

export default function ProfessionalHeader() {
  const { triggerAlert } = useAlert();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userdata = JSON.parse(localStorage.getItem("user_data"));
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  const [isLoggedIn, setIsLoggedIn] = useState(accessToken ? true : false);
  const [activeNav, setActiveNav] = useState("Home");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userIconRef = useRef(null);

  // Mock user data
  const user = {
    email: userdata?.email,
    name: `${userdata?.first_name} ${userdata?.last_name}`,
    initials: `${userdata?.first_name?.[0]}${userdata?.last_name?.[0]}`,
    avatar: null,
    bio: "Hello! There.",
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/check_auth/", {
      method: "POST",
      body: JSON.stringify({
        access_token: getCookie("access_token"),
        refresh_token: getCookie("refresh_token"),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.authenticated) {
          if (data.access) {
            setCookies(data);
          }
        } else if (!data.authenticated && data.authenticated !== undefined) {
          handleLogout();
        }
      })
      .catch((error) => {
        console.error("Error checking auth:", error);
      });
  }, []);

  const navItems = {
    Home: "/",
    Issues: "/track-issues",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when window resizes
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setShowMobileMenu(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    cleanCookies();
    triggerAlert("Logged out successfully.");
    setTimeout(() => {
      triggerAlert("");
    }, 3000);
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

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  setActiveNav("Home");
                  navigate("/");
                }}
                className="flex items-center space-x-2 transition-opacity duration-200 hover:opacity-80 focus:outline-none  rounded-md"
              >
                <img src="./images/logo.svg" className="w-26" alt="" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {Object.entries(navItems).map(([item, link]) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    navigate(link);
                  }}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none rounded-md cursor-pointer ${
                    activeNav === item
                      ? "text-teal-600"
                      : "text-gray-700 hover:text-teal-600 duration-200 "
                  }`}
                >
                  {item}
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 transform transition-transform duration-300 ${
                      activeNav === item ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  {/* Hover underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-gray-400 transform transition-all duration-300 ${
                      activeNav !== item ? "hover:left-0 hover:right-0" : ""
                    }`}
                  />
                </button>
              ))}
            </nav>

            {/* Auth Section */}
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
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/15 bg-opacity-25 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleMobileMenu}
          />

          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-medium text-gray-900">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-4">
              {Object.entries(navItems).map(([item, link]) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    navigate(link);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-6 py-3 text-left text-base font-medium transition-colors duration-200 cursor-pointer ${
                    activeNav === item
                      ? "text-teal-600 bg-teal-50 border-r-2 border-teal-600"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
            {!isLoggedIn && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors duration-500 cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
