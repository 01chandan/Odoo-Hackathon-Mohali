import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Mail, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Verification = () => {
  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(5);
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);

  const location = useLocation();
  const hash = location.hash.substring(1).replace("access_token=", "");

  function getCookie() {
    const parts = hash.split("&expires_at=");
    if (parts.length === 2) return parts[0];
    return hash; // Return the full hash if no expires_at found
  }

  useEffect(() => {
    const token = getCookie();
    console.log("Hash:", hash);
    console.log("Token:", token);

    if (hash !== "" && token) {
      fetch("http://127.0.0.1:8000/verify_user/", {
        method: "POST",
        body: JSON.stringify({ access_token: token }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) throw new Error("Failed to verify");
          return response.json();
        })
        .then((response) => {
          console.log("Response data:", response);
          if (response.error) {
            setStatus(response.error);
            setHasError(true);
          } else {
            setStatus(response.message);
            setIsVerified(true);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
          setStatus("Verification failed. Please try again.");
          setHasError(true);
        });
    } else if (hash === "") {
      setStatus("No verification token found");
      setHasError(true);
    } else {
      setStatus("Invalid verification token");
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    if (isVerified && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && isVerified) {
      // Redirect to home page
      window.location.href = "/";
    }
  }, [countdown, isVerified]);

  const getIcon = () => {
    if (hasError) {
      return <AlertCircle className="w-20 h-20 mx-auto text-red-500" />;
    } else if (isVerified) {
      return <CheckCircle className="w-20 h-20 mx-auto text-green-500" />;
    } else {
      return (
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-teal-600" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      );
    }
  };

  const getTitle = () => {
    if (hasError) return "Verification Failed";
    if (isVerified) return "Email Verified!";
    return "Verifying Email";
  };

  const getDescription = () => {
    if (hasError) return "There was an issue verifying your email address.";
    if (isVerified) return "Your email has been successfully verified.";
    return "Please wait while we verify your email address...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-teal-100">
          <div className="space-y-6">
            <div className="relative">
              {getIcon()}
              {isVerified && (
                <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-green-100 opacity-20 animate-pulse"></div>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getTitle()}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {getDescription()}
              </p>

              {/* Display actual status message */}
              {status !== "verifying" && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    hasError
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : isVerified
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-teal-50 text-teal-800 border border-teal-200"
                  }`}
                >
                  {status}
                </div>
              )}
            </div>

            {/* Countdown and redirect section - only show when verified */}
            {isVerified && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-teal-800 text-sm font-medium">
                  Redirecting to home page in {countdown} seconds...
                </p>
                <div className="mt-3 w-full bg-teal-200 rounded-full h-1">
                  <div
                    className="bg-teal-600 h-1 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(5 - countdown) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              {isVerified && (
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Go to Home Page Now
                </button>
              )}

              {hasError && (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Verification;
