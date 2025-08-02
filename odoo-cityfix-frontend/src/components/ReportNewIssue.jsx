import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Image,
  Camera,
  X,
  ChevronsUpDown,
  Check,
  AlertTriangle,
  Wind,
  Droplets,
  Trash2,
  Lightbulb,
  Construction,
} from "lucide-react";
export default function App() {
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Dummy data
  const categories = [
    {
      name: "Roads",
      icon: <Construction className="w-5 h-5 mr-2 text-teal-500" />,
    },
    {
      name: "Lighting",
      icon: <Lightbulb className="w-5 h-5 mr-2 text-teal-500" />,
    },
    {
      name: "Water Supply",
      icon: <Droplets className="w-5 h-5 mr-2 text-teal-500" />,
    },
    {
      name: "Cleanliness",
      icon: <Trash2 className="w-5 h-5 mr-2 text-teal-500" />,
    },
    {
      name: "Public Safety",
      icon: <AlertTriangle className="w-5 h-5 mr-2 text-teal-500" />,
    },
    {
      name: "Obstructions",
      icon: <Wind className="w-5 h-5 mr-2 text-teal-500" />,
    },
  ];

  // function to handle images
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5)); // Limit to 5 images
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLocation = () => {
    setLocationError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(
            "Could not retrieve location. Please enable location services."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description || images.length === 0 || !location) {
      setErrorMessage(
        "Please fill out all fields, upload at least one image, and set your location."
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // form submit
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));
    formData.append("location", JSON.stringify(location));
    formData.append("category", category);
    formData.append("description", description);

    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setImages([]);
      setLocation(null);
      setCategory("");
      setDescription("");
    }, 3000);
  };

  // Image UI
  const ImageUploader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-1 bg-teal-50/50 rounded-xl border-2 border-dashed border-teal-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-teal-600 hover:bg-teal-50"
        >
          <Image className="w-6 h-6 mb-2" />
          <span className="font-semibold text-sm">Upload from Gallery</span>
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <img
                  src={image.url}
                  alt={`upload-preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const LocationSelector = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-4 bg-teal-50/50 rounded-xl"
    >
      <div
        className={`w-full p-4 rounded-lg overflow-hidden flex items-center justify-center ${
          location ? "bg-teal-200" : "bg-gray-200"
        }`}
      >
        {location ? (
          <div className="text-center text-teal-800 p-2">
            <MapPin className="mx-auto text-teal-600" />
            <p className="font-bold mt-2">Location Acquired!</p>
            <p className="text-xs">
              Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto" />
            <p>Map will be shown here</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const CategorySelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedCategoryData = categories.find((c) => c.name === category);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left p-2 text-sm bg-white rounded-xl shadow-sm border border-gray-200"
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
              className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100"
            >
              {categories.map((cat) => (
                <li
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    setIsOpen(false);
                  }}
                  className="flex items-center p-3 hover:bg-teal-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                >
                  {cat.icon}
                  {cat.name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const DescriptionInput = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue in detail..."
        className="w-full p-2 text-sm bg-white rounded-xl shadow-sm border border-gray-200 h-20 resize-none focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
      />
    </motion.div>
  );

  // main Component
  return (
    <div className=" demo3-container bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl shadow-teal-500/10 p-6"
        >
          <div className="text-center mb-3">
            <h1 className="text-[15px] font-bold text-teal-900">
              Report New Issue
            </h1>
            <p className="text-gray-500 mt-0.5 text-[13px]">
              Help us improve your community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Add Photos">
              <ImageUploader />
            </Section>

            <Section title="Your Location">
              <LocationSelector />
            </Section>

            <Section title="Choose Category">
              <CategorySelector />
            </Section>

            <Section title="Provide Description">
              <DescriptionInput />
            </Section>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-teal-500 text-white font-bold p-2 text-sm font-medium rounded-xl hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/30 disabled:bg-gray-400 disabled:shadow-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Success/Error Modals */}
      <AnimatePresence>
        {showSuccess && (
          <Modal
            type="success"
            message="Issue reported successfully! Thank you."
          />
        )}
        {showError && <Modal type="error" message={errorMessage} />}
      </AnimatePresence>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-sm font-semibold text-teal-800 mb-2">{title}</h2>
    {children}
  </div>
);

const Modal = ({ type, message }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
