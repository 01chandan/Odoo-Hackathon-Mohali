import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  X,
  ChevronsUpDown,
  Check,
  AlertTriangle,
  Wind,
  Droplets,
  Trash2,
  Lightbulb,
  Construction,
  Loader2,
  Plus,
  Edit2,
} from "lucide-react";

// --- SUB-COMPONENTS (Moved outside for performance and to fix state issues) ---

const ImageUploader = ({ images, onImageChange, onRemoveImage }) => {
  const fileInputRef = useRef(null);
  return (
    <div>
      <AnimatePresence>
        {images.length === 0 ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="flex flex-col items-center justify-center w-full h-40 p-6 bg-teal-50/50 rounded-xl border-2 border-dashed border-teal-300/50 cursor-pointer hover:bg-teal-50 transition-colors"
          >
            <ImageIcon className="w-10 h-10 text-teal-400 mb-2" />
            <p className="font-semibold text-teal-800">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-teal-600">Max 5 images</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.url}
                  layout
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative group aspect-square"
                >
                  <img
                    src={image.url}
                    alt={`upload-preview-${index}`}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {images.length < 5 && (
              <motion.button
                type="button"
                layout
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors"
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            )}
          </div>
        )}
      </AnimatePresence>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onImageChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

const LocationSelector = ({
  location,
  status,
  error,
  onLocation,
  onLocationUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  const handleAddressChange = (e) => {
    onLocationUpdate({ ...location, address: e.target.value });
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // User is finishing editing, so geocode the new address
      setIsGeocoding(true);
      setGeocodingError("");
      const API_KEY = "AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location.address
      )}&key=${API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          onLocationUpdate({ ...location, lat, lng });
        } else {
          throw new Error("Could not find address.");
        }
      } catch (err) {
        setGeocodingError("Invalid address. Please try again.");
      }
      setIsGeocoding(false);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
      {status === "success" && location ? (
        <div className="space-y-3">
          <div className="h-40 rounded-lg overflow-hidden border border-gray-200 relative">
            <MapPreview lat={location.lat} lng={location.lng} />
            {isGeocoding && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600">
                Location Address
              </label>
              <button
                type="button"
                onClick={handleEditToggle}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> {isEditing ? "Done" : "Edit"}
              </button>
            </div>
            <textarea
              value={location.address}
              onChange={handleAddressChange}
              readOnly={!isEditing}
              className={`w-full text-sm p-2 rounded-md border transition-all resize-none ${
                isEditing
                  ? "bg-white border-teal-400 ring-1 ring-teal-400"
                  : "bg-transparent border-transparent text-gray-800"
              }`}
              rows="2"
            />
            {geocodingError && (
              <p className="text-xs text-red-600 mt-1">{geocodingError}</p>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onLocation}
          className="w-full flex items-center justify-center gap-3 p-3 text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition-colors"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Fetching GPS
              Location...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" /> Set Current Location
            </>
          )}
        </button>
      )}
      {status === "error" && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};

const CategorySelector = ({ category, categories, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategoryData = categories.find((c) => c.name === category);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left p-3 text-sm bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <span className="flex items-center">
          {selectedCategoryData ? (
            <>
              {selectedCategoryData.icon}
              <span className="font-semibold text-gray-800">
                {selectedCategoryData.name}
              </span>
            </>
          ) : (
            <span className="text-gray-500">Select a category</span>
          )}
        </span>
        <ChevronsUpDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 p-1"
          >
            {categories.map((cat) => (
              <li
                key={cat.name}
                onClick={() => {
                  onCategoryChange(cat.name);
                  setIsOpen(false);
                }}
                className="flex items-center p-2 text-sm text-gray-700 hover:bg-teal-50 cursor-pointer rounded-lg"
              >
                {cat.icon} {cat.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const MapPreview = ({ lat, lng }) => {
  const mapRef = useRef(null);
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const apiKey = "AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY";
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }
    const scriptId = "google-maps-script-modal";
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isScriptLoaded && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 16,
        disableDefaultUI: true,
        styles: [{ stylers: [{ saturation: -100 }, { lightness: 20 }] }],
      });
      new window.google.maps.Marker({ position: { lat, lng }, map: map });
    }
  }, [isScriptLoaded, lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-sm font-semibold text-teal-800 mb-3">{title}</h2>
    {children}
  </motion.div>
);

const Toast = ({ type, message }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      className="fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl text-white"
      style={{ backgroundColor: isSuccess ? "#10B981" : "#EF4444" }}
    >
      <div className="flex items-center">
        {isSuccess ? (
          <Check className="w-6 h-6 mr-3" />
        ) : (
          <AlertTriangle className="w-6 h-6 mr-3" />
        )}
        <p className="font-semibold">{message}</p>
      </div>
    </motion.div>
  );
};

// --- MAIN MODAL COMPONENT ---
export default function ReportIssueModal({ onClose }) {
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    {
      name: "Roads",
      icon: <Construction className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Lighting",
      icon: <Lightbulb className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Water Supply",
      icon: <Droplets className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Cleanliness",
      icon: <Trash2 className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Public Safety",
      icon: <AlertTriangle className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Obstructions",
      icon: <Wind className="w-5 h-5 mr-3 text-gray-500" />,
    },
  ];

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLocation = useCallback(() => {
    setLocationStatus("loading");
    setLocationError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const API_KEY = "AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
              setLocation({
                lat: latitude,
                lng: longitude,
                address:
                  data.results[0]?.formatted_address || "Address not found",
              });
              setLocationStatus("success");
            } else {
              throw new Error("Geocoding failed");
            }
          } catch (error) {
            setLocationStatus("error");
            setLocationError("Could not fetch address.");
          }
        },
        () => {
          setLocationStatus("error");
          setLocationError(
            "Location access denied. Please enable it in your browser settings."
          );
        }
      );
    } else {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description || images.length === 0 || !location) {
      setErrorMessage("Please complete all fields to submit a report.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    console.log("Latitude:", location.lat);
    console.log("Longitude:", location.lng);

    setIsSubmitting(true);
    setErrorMessage("");
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));
    formData.append("location", JSON.stringify(location));
    formData.append("category", category);
    formData.append("description", description);
    console.log("--- Submitting Form Data ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl shadow-teal-500/10 flex flex-col h-[85vh] max-h-[750px]"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100">
          <div className="text-left">
            <h1 className="text-xl font-bold text-teal-900">
              Report New Issue
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Help us improve your community.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          id="report-issue-form"
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white"
        >
          <Section title="1. Add Photos">
            <ImageUploader
              images={images}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
            />
          </Section>
          <Section title="2. Set Location">
            <LocationSelector
              location={location}
              status={locationStatus}
              error={locationError}
              onLocation={handleLocation}
              onLocationUpdate={setLocation}
            />
          </Section>
          <Section title="3. Provide Details">
            <div className="space-y-4">
              <CategorySelector
                category={category}
                categories={categories}
                onCategoryChange={setCategory}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full p-3 text-sm bg-white rounded-xl shadow-sm border border-gray-200 h-24 resize-none focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
              />
            </div>
          </Section>
        </form>

        <div className="flex-shrink-0 p-6 sm:p-8 border-t border-gray-100">
          <motion.button
            type="submit"
            form="report-issue-form"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-teal-500 text-white font-bold py-3 text-base rounded-xl hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/30 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Submit Issue"
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <Toast
            type="success"
            message="Issue reported successfully! Thank you."
          />
        )}
        {showError && <Toast type="error" message={errorMessage} />}
      </AnimatePresence>
    </div>
  );
}
