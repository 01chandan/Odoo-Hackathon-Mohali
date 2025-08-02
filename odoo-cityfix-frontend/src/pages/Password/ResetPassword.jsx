import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/GlobalAlert/AlertContext";

export default function ResetPassword() {
  const { triggerAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const hash = location.hash.substring(1).replace("access_token=", "");

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Confirm password is required";
    }
    if (formData.confirm_password !== formData.password) {
      newErrors.confirm_password =
        "Confirm password and Password must be the same.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    console.log(1);
    fetch(`http://127.0.0.1:8000/reset-password/`, {
      method: "POST",
      body: JSON.stringify({
        access_token: hash,
        new_password: formData.password,
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
        } else {
          triggerAlert(response.message);
          setFormData({
            password: "",
            confirm_password: "",
          });
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          triggerAlert("");
        }, 3000);
      });
  };

  return (
    <div className="min-h-screen flex p-2">
      {/* left Side - Image/Design */}
      <div className="hidden lg:block relative">
        {/* Back to Website Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/login"
            className="cursor-pointer flex items-center gap-2 text-white/80 bg-white/18 px-2 py-1 rounded-full hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-sm">Back to Login</span>
          </Link>
        </div>
        {/* Content */}
        <img
          src="./images/login.webp"
          className="h-[calc(100vh-20px)] rounded-2xl"
          alt=""
        />
      </div>

      <div className="w-full lg:w-[65%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 transition-all ease-in-out duration-300">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your new password below to update your account credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="animate-fade-in">
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

            {/* Confirm Password Field */}
            <div className="animate-fade-in">
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
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
