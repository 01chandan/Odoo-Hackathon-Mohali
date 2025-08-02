import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useAlert } from "./GlobalAlert/AlertContext";
import { getCookie, setCookies } from "../utils/cookies";

// --- SVG ICONS ---
const ArrowLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const MapPin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const User = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date
    .toLocaleString("en-US", {
      month: "long", // August
      day: "2-digit", // 01
      year: "numeric", // 2025
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", ""); // Remove comma between date and time
};

const Flag = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </svg>
);

// --- REUSABLE COMPONENTS ---

const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-medium rounded-full inline-block";
  const statusClasses = {
    Reported: "bg-blue-100 text-blue-800",
    "In Progress": "bg-teal-100 text-teal-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const ActivityItem = ({ item, isLast }) => (
  <div className="relative pl-8">
    {!isLast && (
      <div className="absolute left-3 top-3 -bottom-3 w-0.5 bg-gray-200"></div>
    )}
    <div className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500">
      <div className="h-3 w-3 rounded-full bg-white"></div>
    </div>
    <p className="font-semibold text-gray-800">{item.status}</p>
    <p className="text-sm text-gray-500">{formatTimestamp(item.changed_at)}</p>
    <p className="text-sm text-gray-500">{item.description}</p>
  </div>
);

//
const MapComponent = ({ lat, lng }) => {
  const mapRef = React.useRef(null);
  const [isScriptLoaded, setScriptLoaded] = React.useState(false);

  // Effect to load the Google Maps script
  React.useEffect(() => {
    const apiKey = "AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY"; // IMPORTANT: Replace with your actual API key

    // Check if the script is already loaded to avoid duplicates
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Google Maps script failed to load.");
    };

    // Append the script to the document head
    document.head.appendChild(script);

    // Cleanup function to remove the script if the component unmounts
    return () => {
      const existingScript = document.getElementById("google-maps-script");
      if (existingScript) {
        // It's generally safe to leave the script, but this is good practice
        // existingScript.remove();
      }
    };
  }, []);

  // Effect to initialize the map once the script is loaded
  React.useEffect(() => {
    if (isScriptLoaded && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      });
      new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
      });
    }
  }, [isScriptLoaded, lat, lng]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%" }}>
      {!isScriptLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-200">
          <p className="text-gray-500">Loading Map...</p>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

function ReportDetailsPage() {
  const { triggerAlert } = useAlert();
  const user = JSON.parse(localStorage.getItem("user_data"));
  const location = useLocation();
  const [reportData, setReportData] = useState({});
  const issue = location.state;

  useEffect(() => {
    if (issue) {
      fetch(`http://127.0.0.1:8000/get-issue-details/`, {
        method: "POST",
        body: JSON.stringify({
          issue: issue,
          access_token: getCookie("access_token"),
          refresh_token: getCookie("refresh_token"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to login");
          return response.json();
        })
        .then((response) => {
          if (response.error) {
            triggerAlert(response.error);
            setTimeout(() => {
              triggerAlert("");
            }, 3000);
          } else {
            triggerAlert(response.message);
            setTimeout(() => {
              triggerAlert("");
            }, 3000);
            const pro = response.issue;
            const logs = response.logs;
            // --- DUMMY DATA (with Lat/Lng) ---
            const tempData = {
              id: issue,
              title: pro.title,
              imageUrl: pro.issue_photos[0].image_url,
              category: pro.categories.name,
              status: pro.status,
              reportedBy: pro.is_anonymous
                ? "Anonymous"
                : `${pro.users_table.first_name} ${pro.users_table.last_name}`,
              timestamp: formatTimestamp(pro.created_at),
              description: pro.description,
              location: {
                address: "C.G. Road, Ahmedabad, Gujarat",
                lat: pro.latitude, // Latitude for the map marker
                lng: pro.longitude, // Longitude for the map marker
              },
              activity: response.logs,
            };
            setReportData(tempData);
            if (response.access) {
              setCookies(response);
            }
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        })
        .finally(() => {});
    }
  }, [issue]);

  const handleReportSpam = () => {
    fetch(`http://127.0.0.1:8000/report-spam/`, {
      method: "POST",
      body: JSON.stringify({
        issue: issue,
        user: user.id,
        access_token: getCookie("access_token"),
        refresh_token: getCookie("refresh_token"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to login");
        return response.json();
      })
      .then((response) => {
        if (response.error) {
          triggerAlert(response.error);
          setTimeout(() => {
            triggerAlert("");
          }, 3000);
        } else {
          const pro = response.issue;
          const logs = response.logs;
          triggerAlert(
            "This issue has been reported as spam. An admin will review it shortly."
          );
          setTimeout(() => {
            triggerAlert("");
          }, 3000);
          if (response.access) {
            setCookies(response);
          }
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      })
      .finally(() => {});
  };

  return (
    <div className=" bg-white">
      <Navbar />
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Issues</span>
            </button>
            <div className="text-sm text-gray-500 font-mono">
              ID: {reportData.id}
            </div>
          </header>

          <main className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative h-64 md:h-80 w-full">
              <img
                src={reportData.imageUrl}
                alt={reportData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {reportData.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
                    <span className="font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
                      {reportData.category}
                    </span>
                    <span>|</span>
                    <span>{reportData.timestamp}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {reportData.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Activity
                  </h2>
                  <div className="space-y-6">
                    {reportData.activity.map((item, index) => (
                      <ActivityItem
                        key={index}
                        item={item}
                        isLast={index === reportData.activity.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3">Status</h3>
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={reportData.status} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>
                      Reported by:{" "}
                      <span className="font-semibold">
                        {reportData.reportedBy}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3">Location</h3>
                  <div className="flex items-start gap-3 text-sm text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      {reportData.location.address}
                    </span>
                  </div>
                  {/* --- GOOGLE MAP INTEGRATION --- */}
                  <div className="h-48 rounded-md overflow-hidden border border-gray-200">
                    <MapComponent
                      lat={reportData.location.lat}
                      lng={reportData.location.lng}
                    />
                  </div>
                </div>

                <button
                  onClick={handleReportSpam}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-colors border border-red-200"
                >
                  <Flag className="w-5 h-5" />
                  <span>Report as Spam</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return <ReportDetailsPage />;
}
