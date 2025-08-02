import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/GlobalAlert/AlertContext";

export default function ForgotPassword() {
  const { triggerAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.includes("change") ? "Change" : "Forgot";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let e = "";
    if (email) e = "Email is required";
    else if (!emailRegex.test(email)) e = "Please enter a valid email";

    setError(error);
    return error === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    fetch(`http://127.0.0.1:8000/forgot-password/`, {
      method: "POST",
      body: JSON.stringify({ email }),
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
          setEmail("");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      })
      .finally(() => {
        setLoading(false);
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
              {type} Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your registered email address and we'll send you a reset
              link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 placeholder:text-[13.4px] text-sm border rounded-lg focus:ring-[1.2px] duration-500 focus:ring-teal-500 outline-none focus:border-transparent transition-all ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email"
                />
              </div>
              {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-sm px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                loading
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 active:transform active:scale-95"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
