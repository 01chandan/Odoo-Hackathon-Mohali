import { useState } from "react";
import { Camera, X, MapPin, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAlert } from "../components/GlobalAlert/AlertContext";
import { getCookie, setCookies } from "../utils/cookies";

const Dashboard = () => {
  const navigate = useNavigate();
  const { triggerAlert } = useAlert();
  let userdata = JSON.parse(localStorage.getItem("user_data"));

  const [profileData, setProfileData] = useState({
    profile_pic: userdata?.profile_pic || "",
    first_name: userdata?.first_name || "",
    last_name: userdata?.last_name || "",
    initials: `${userdata?.first_name?.[0]}${userdata?.last_name?.[0]}`,
    email: userdata?.email || "",
    bio: userdata?.bio || "Hello! There.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    fetch(`http://127.0.0.1:8000/edit-profile-data/`, {
      method: "POST",
      body: JSON.stringify({
        tempData,
        access_token: getCookie("access_token"),
        refresh_token: getCookie("refresh_token"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update");
        return response.json();
      })
      .then((response) => {
        if (response.error) {
          triggerAlert(response.error);
          setTimeout(() => {
            triggerAlert("");
          }, 3000);
        } else {
          triggerAlert("Profile updated successfully!");
          setTimeout(() => {
            triggerAlert("");
          }, 3000);
          setProfileData(tempData);
          localStorage.setItem("user_data", JSON.stringify(response.user));
          userdata = JSON.parse(localStorage.getItem("user_data"));
          if (response.access) {
            setCookies(response);
          }
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    setIsEditing(false);
  };

  const handleDiscard = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#5ab2ff] hover:bg-[#4a9de6] text-white rounded-xl font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-[#5ab2ff] hover:text-blue-500 hover:bg-opacity-10 rounded-xl font-medium transition-all"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => navigate("/change-password")}
                      className="flex items-center gap-2 px-4 py-2 text-[#5ab2ff] hover:text-blue-500 hover:bg-opacity-10 rounded-xl font-medium transition-all"
                    >
                      <Edit3 size={16} />
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden">
                    {tempData.profile_pic ? (
                      <img
                        src={tempData.profile_pic}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-400">
                        {tempData.initials}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="profile-pic-upload"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setTempData((prev) => ({
                                ...prev,
                                profile_pic: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() =>
                          document.getElementById("profile-pic-upload").click()
                        }
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <Camera size={14} className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>

                {/* Name and Basic Info */}
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempData.first_name}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                        className="text-2xl font-semibold text-gray-900 bg-transparent border-b border-gray-200 focus:border-[#5ab2ff] outline-none pb-1 w-full transition-colors"
                      />
                      <input
                        type="text"
                        value={tempData.last_name}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                        className="text-2xl font-semibold text-gray-900 bg-transparent border-b border-gray-200 focus:border-[#5ab2ff] outline-none pb-1 w-full transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {profileData.first_name}
                      </h2>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {profileData.last_name}
                      </h2>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.location}
                          onChange={(e) =>
                            setTempData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className="bg-transparent border-b border-gray-200 focus:border-[#5ab2ff] outline-none transition-colors"
                          placeholder="Add location"
                        />
                      ) : (
                        <span>{profileData.location || "No location set"}</span>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-4">
                    {isEditing ? (
                      <textarea
                        value={tempData.bio}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#5ab2ff] outline-none transition-colors resize-none"
                        rows="3"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {profileData.bio || "No bio added yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
