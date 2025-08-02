import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import IssuePopup from "../../components/ReportNewIssue";

function getStatusColor(status) {
  switch (status) {
    case "Reported":
      return "bg-gray-500";
    case "In Progress":
      return "bg-yellow-500";
    case "Resolved":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
}
function formatDate(dateString) {
  const options = { month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function calculateSince(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
    );
    const data = await res.json();
    return data.display_name || "Address not found";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Address not available";
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return +(R * c).toFixed(2); // Distance in km with 2 decimal places
}

const Dropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected === "All" || selected === "Any" ? label : selected}
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="origin-top-right absolute left-0 mt-2 w-46 rounded-md bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-10"
          >
            <div className="py-1" role="menu">
              {options.map((option) => (
                <a
                  href="#"
                  key={option}
                  className={`block px-4 py-2 text-sm ${
                    selected === option
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  setIsOpenIssuePopup,
}) => {
  const handleFilterChange = (filterName) => (value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <Dropdown
            label="Category"
            options={[
              "All",
              "Lighting",
              "Roads",
              "Cleanliness",
              "Public Safety",
              "Obstructions",
              "Water Supply",
            ]}
            selected={filters.category}
            onSelect={handleFilterChange("category")}
          />
          <Dropdown
            label="Status"
            options={["All", "Reported", "In Progress", "Resolved"]}
            selected={filters.status}
            onSelect={handleFilterChange("status")}
          />
          <Dropdown
            label="Distance"
            options={["Any", "< 1 Km", "1-3 Km", "> 3 Km"]}
            selected={filters.distance}
            onSelect={handleFilterChange("distance")}
          />
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400 group-hover:text-gray-600 duration-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-sm outline-none placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[280px]"
            placeholder="Search by title or location..."
          />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="w-full px-5 py-2 text-sm font-medium text-[#000000] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-md hover:bg-gray-200 transition-colors duration-500 cursor-pointer">
            My Issue
          </button>
          <button
            onClick={() => setIsOpenIssuePopup(true)}
            className="w-full px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors duration-500 cursor-pointer whitespace-nowrap"
          >
            Report New Issue
          </button>
        </div>
      </div>
    </header>
  );
};

const IssueCard = ({ issue, index }) => {
  const navigate = useNavigate();
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col cursor-pointer"
      variants={cardVariants}
      layout
      onClick={() => {
        navigate("/report-details", { state: issue.id });
      }}
    >
      <div className="relative">
        <img
          className="w-full h-40 object-cover"
          src={issue.imageUrl}
          alt={issue.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/1a202c/ffffff?text=${issue.category.replace(
              " ",
              "+"
            )}`;
          }}
        />
        <div
          className={`absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded-full ${
            issue.category === "Streetlight"
              ? "bg-orange-500"
              : issue.category === "Road"
              ? "bg-gray-600"
              : issue.category === "Water Supply"
              ? "bg-blue-500"
              : "bg-teal-500"
          }`}
        >
          {issue.category}
        </div>
        <div className="absolute top-3 right-3 text-xs font-semibold text-gray-800 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
          {issue.date}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-2 ${issue.statusColor}`}
            ></span>
            <p className="text-sm font-semibold text-gray-600">
              {issue.status}
            </p>
          </div>
          <p className="text-sm font-bold text-gray-800 text-right">
            {issue.title}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-3 h-10 flex-grow">
          {issue.description || issue.since}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center overflow-hidden">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{issue.address}</span>
          </div>
          <span className="font-semibold">{issue.distance} Km</span>
        </div>
      </div>
    </motion.div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border text-sm font-medium ${
              currentPage === page
                ? "bg-teal-50 border-teal-500 text-teal-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  const [isOpenIssuePopup, setIsOpenIssuePopup] = useState(false);
  console.log(isOpenIssuePopup);

  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    distance: "Any",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState(null);
  const [issuesData, setIssuesData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      }
    );
  }, []);

  useEffect(() => {
    const loadIssues = async () => {
      const rawIssues = JSON.parse(localStorage.getItem("issues_data")) || [];
      const resolved = await Promise.all(
        rawIssues.map(async (issue) => {
          const lat = issue.latitude;
          const lon = issue.longitude;
          const address = await reverseGeocode(lat, lon);
          const status = issue?.status || "Reported";

          let distance = 0;
          if (location) {
            distance = calculateDistance(
              location.latitude,
              location.longitude,
              lat,
              lon
            );
          }

          return {
            id: issue.id,
            category: issue.categories?.name || "Unknown",
            title: issue.title,
            status,
            statusColor: getStatusColor(status),
            date: formatDate(issue.created_at),
            since: calculateSince(issue.created_at),
            distance,
            location: { latitude: lat, longitude: lon },
            address,
            imageUrl:
              issue.issue_photos?.[0]?.image_url ||
              "https://placehold.co/600x400?text=No+Image",
          };
        })
      );
      setIssuesData(resolved);
    };

    if (location) {
      loadIssues();
    }
  }, [location]);

  const filteredIssues = issuesData?.filter((issue) => {
    if (filters.category !== "All" && issue.category !== filters.category)
      return false;
    if (filters.status !== "All" && issue.status !== filters.status)
      return false;

    const distanceValue = issue.distance;
    if (filters.distance === "< 1 Km" && distanceValue >= 1) return false;
    if (
      filters.distance === "1-3 Km" &&
      (distanceValue < 1 || distanceValue > 3)
    )
      return false;
    if (filters.distance === "> 3 Km" && distanceValue <= 3) return false;

    if (
      searchQuery &&
      !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !issue.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className=" bg-white">
      <Navbar />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="container mx-auto px-4">
          <Header
            filters={filters}
            setFilters={setFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsOpenIssuePopup={setIsOpenIssuePopup}
          />
          <main>
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
              >
                {paginatedIssues.length > 0 ? (
                  paginatedIssues.map((issue, index) => (
                    <IssueCard key={issue.id} issue={issue} index={index} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-16 text-gray-500"
                  >
                    <h3 className="text-xl font-semibold">No issues found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {isOpenIssuePopup && <IssuePopup />}
      </div>
      <Footer />
    </div>
  );
}
