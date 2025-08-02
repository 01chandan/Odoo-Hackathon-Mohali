import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
//  Sample Data
const issuesData = [
  {
    id: 1,
    category: "Streetlight",
    title: "Streetlight not working",
    status: "In Progress",
    statusColor: "bg-yellow-500",
    date: "Aug 19",
    since: "since last 2 days",
    distance: 2.8,
    location: "geeta bridge, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/1a202c/ffffff?text=Streetlight",
  },
  {
    id: 2,
    category: "Road",
    title: "Pothole on main road",
    status: "Reported",
    statusColor: "bg-red-500",
    date: "Jun 02",
    description:
      "The main road in xg road ahmedabad, is riddled with potholes, making it dangerous and difficult to travel on.",
    distance: 1.1,
    location: "C.G road, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/4a5568/ffffff?text=Pothole",
  },
  {
    id: 3,
    category: "Garbage Collection",
    title: "Garbage not collected",
    status: "Completed",
    statusColor: "bg-green-500",
    date: "Jun 25",
    description:
      "Garbage is not collected since week it’s smell bad and very difficult to leave here.",
    distance: 1.1,
    location: "I.T society, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/718096/ffffff?text=Garbage",
  },
  {
    id: 4,
    category: "Streetlight",
    title: "Flickering streetlight",
    status: "Reported",
    statusColor: "bg-red-500",
    date: "Aug 14",
    since: "since last 5 days",
    distance: 3.2,
    location: "near gandhi ashram, ahmedabad",
    imageUrl: "https://placehold.co/600x400/1a202c/ffffff?text=Streetlight",
  },
  {
    id: 5,
    category: "Water Supply",
    title: "Leaky pipe on sidewalk",
    status: "In Progress",
    statusColor: "bg-yellow-500",
    date: "Aug 20",
    description:
      "Constant water leakage from the main pipeline is causing water logging.",
    distance: 0.5,
    location: "maninagar, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/2c5282/ffffff?text=Water+Leak",
  },
  {
    id: 6,
    category: "Garbage Collection",
    title: "Overflowing dustbin",
    status: "Reported",
    statusColor: "bg-red-500",
    date: "Aug 21",
    description: "The public dustbin has been overflowing for three days now.",
    distance: 1.5,
    location: "navrangpura, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/718096/ffffff?text=Garbage",
  },
  {
    id: 7,
    category: "Road",
    title: "Cracked pavement",
    status: "Completed",
    statusColor: "bg-green-500",
    date: "Jul 10",
    description:
      "Pavement is cracked and uneven, posing a risk to pedestrians.",
    distance: 4.0,
    location: "satellite, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/4a5568/ffffff?text=Road",
  },
  {
    id: 8,
    category: "Streetlight",
    title: "Dim Streetlight",
    status: "In Progress",
    statusColor: "bg-yellow-500",
    date: "Aug 22",
    since: "since last week",
    distance: 0.8,
    location: "bodakdev, ahmedabad, gujarat",
    imageUrl: "https://placehold.co/600x400/1a202c/ffffff?text=Streetlight",
  },
];

const ITEMS_PER_PAGE = 6;

// Normal Components

const Dropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected === "All" || selected === "Any" ? label : selected}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((option) => (
                <a
                  href="#"
                  key={option}
                  className={`block px-4 py-2 text-sm ${
                    selected === option
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                  role="menuitem"
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

const Header = ({ filters, setFilters, searchQuery, setSearchQuery }) => {
  const handleFilterChange = (filterName) => (value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="py-6 px-4 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <Dropdown
            label="Category"
            options={[
              "All",
              "Streetlight",
              "Road",
              "Garbage Collection",
              "Water Supply",
            ]}
            selected={filters.category}
            onSelect={handleFilterChange("category")}
          />
          <Dropdown
            label="Status"
            options={["All", "Reported", "In Progress", "Completed"]}
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
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-sm outline-none placeholder:text-gray-400 group-hover:placeholder:text-gray-600 duration-300 min-w-[280px] placeholder:hover:text-medium border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Search by title or location..."
          />
        </div>
      </div>
    </header>
  );
};

const IssueCard = ({ issue, index }) => {
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
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col"
      variants={cardVariants}
      layout
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
            <span className="truncate">{issue.location}</span>
          </div>
          <span className="font-semibold">{issue.distance} Km</span>
        </div>
      </div>
    </motion.div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Previous</span>
          <ArrowLeft className="h-5 w-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`${
              currentPage === page
                ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    distance: "Any",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIssues = issuesData.filter((issue) => {
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
      !issue.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4">
        <Header
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
    </div>
  );
}
