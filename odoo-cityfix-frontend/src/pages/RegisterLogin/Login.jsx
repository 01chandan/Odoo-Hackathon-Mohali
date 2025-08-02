import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/GlobalAlert/AlertContext";
import { setCookies } from "../../utils/cookies";

const AuthPage = () => {
  const { triggerAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("Login");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    if (activeTab === "signup") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
      if (!formData.confirm_password) {
        newErrors.confirm_password = "Confirm password is required";
      }
      if (formData.confirm_password !== formData.password) {
        newErrors.confirm_password =
          "Confirm password and Password must be the same.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call

    if (activeTab === "signup") {
      fetch(`http://127.0.0.1:8000/register/`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to register");
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
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirm_password: "",
              agreeToTerms: false,
            });
          }
          setIsLoading(false);
          setActiveTab("Login");
        })
        .catch((error) => {
          console.error("Error: ", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      fetch(`http://127.0.0.1:8000/login/`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
            localStorage.setItem("user_data", JSON.stringify(response.user));
            localStorage.setItem(
              "issues_data",
              JSON.stringify(response.issues)
            );
            if (response.access) {
              setCookies(response);
            }
            setFormData({
              email: "",
              password: "",
            });
            navigate("/track-issues");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error: ", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex p-2">
      {/* left Side - Image/Design */}
      <div className="hidden lg:block relative">
        {/* Back to Website Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="cursor-pointer flex items-center gap-2 text-white/80 bg-white/18 px-2 py-1 rounded-full hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm">Back to website</span>
          </Link>
        </div>
        {/* Content */}
        <img
          src="./images/login.webp"
          className="h-[calc(100vh-20px)] rounded-2xl"
          alt=""
        />
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-[65%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            {/* <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-lg mb-4">
              <span className="text-white font-bold text-xl">ML</span>
            </div> */}
            <h1 className="text-3xl font-bold text-gray-900 mb-1 transition-all ease-in-out duration-300">
              {activeTab === "Login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-gray-600 text-sm">
              {activeTab === "Login"
                ? "Login in to your account to continue"
                : "Join us today and start your journey"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab("Login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "Login"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "signup"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields - Only for Signup */}
            {activeTab === "signup" && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-3 placeholder:text-[13.4px] pr-4 py-2 text-sm border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Chandan"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 text-sm placeholder:text-[13.4px] border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g. Kumar"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className={activeTab === "signup" ? "animate-fade-in" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 placeholder:text-[13.4px] text-sm border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className={activeTab === "signup" ? "animate-fade-in" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-2 placeholder:text-[13.4px] text-sm border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>
            {activeTab === "Login" ? (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[13px] text-teal-600 hover:underline block cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            ) : (
              <>
                {/* Confirm Password Field */}
                <div
                  className={activeTab === "signup" ? "animate-fade-in" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-2 placeholder:text-[13.4px] text-sm border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter confirm password"
                    />
                    {formData.confirm_password !== "" && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {formData.password === formData.confirm_password ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </button>
                    )}
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.confirm_password}
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="flex items-start justify-start gap-2"></div>
            {/* Terms Checkbox - Only for Signup */}
            {activeTab === "signup" && (
              <div className="animate-fade-in">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-0.5 w-3.5 h-3.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-teal-600 hover:underline">
                      Terms & Conditions
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 text-sm px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                isLoading
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 active:transform active:scale-95"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {activeTab === "Login"
                    ? "Loging in..."
                    : "Creating account..."}
                </div>
              ) : activeTab === "Login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Footer Links */}
            <div className="text-center">
              {activeTab === "Login" ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-teal-600 hover:underline font-medium cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("Login")}
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
