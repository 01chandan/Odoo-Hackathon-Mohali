import { useState } from "react";
import {
  CheckCircle,
  Mail,
  AlertTriangle,
  X,
  Info,
  AlertCircle,
} from "lucide-react";

// Simple Alert Hook
const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, type, title, message, duration };

    setAlerts((prev) => [...prev, newAlert]);

    if (duration > 0) {
      setTimeout(() => removeAlert(id), duration);
    }
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Predefined alert functions for easy use
  const alerts_api = {
    success: (title, message) => showAlert("success", title, message, 4000),
    error: (title, message) => showAlert("error", title, message, 6000),
    warning: (title, message) => showAlert("warning", title, message, 5000),
    info: (title, message) => showAlert("info", title, message, 5000),
    email: (title, message) => showAlert("email", title, message, 7000),

    // Quick preset alerts
    submitSuccess: () =>
      showAlert(
        "success",
        "Submitted Successfully!",
        "Your form has been submitted and we'll get back to you soon.",
        4000
      ),
    registrationSuccess: () =>
      showAlert(
        "email",
        "Registration Successful!",
        "Please check your email and verify your account to complete the process.",
        7000
      ),
    emailVerify: () =>
      showAlert(
        "email",
        "Verify Your Email",
        "A verification link has been sent to your email address. Please check your inbox.",
        6000
      ),
    loginSuccess: () =>
      showAlert(
        "success",
        "Welcome Back!",
        "You have successfully logged into your account.",
        3000
      ),
    profileUpdated: () =>
      showAlert(
        "success",
        "Profile Updated",
        "Your profile information has been successfully updated.",
        4000
      ),
  };

  return { alerts, removeAlert, ...alerts_api };
};

// Alert Component
const Alert = ({ alert, onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    email: {
      icon: Mail,
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
    },
  };

  const config = configs[alert.type] || configs.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`w-full max-w-md mx-auto mb-4 p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 ${config.bg} ${config.border}`}
    >
      <div className="flex items-start space-x-3">
        <IconComponent
          className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${config.textColor}`}>
            {alert.title}
          </h3>
          <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
            {alert.message}
          </p>
        </div>
        <button
          onClick={() => onClose(alert.id)}
          className={`flex-shrink-0 p-1.5 rounded-md transition-colors duration-200 ${config.iconColor} hover:bg-black hover:bg-opacity-10`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {alert.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${config.iconColor.replace(
              "text-",
              "bg-"
            )} opacity-60`}
            style={{ animation: `shrink ${alert.duration}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
};

// Alert Container - Fixed positioning
const AlertContainer = ({ alerts, onClose }) => (
  <div className="fixed top-4 right-4 z-50 w-full max-w-md pointer-events-none">
    <div className="pointer-events-auto">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} onClose={onClose} />
      ))}
    </div>
  </div>
);

// Main Demo Component
export default function SimpleAlertSystem() {
  const alertSystem = useAlerts();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Simple Alert System
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Easy Integration Examples
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={alertSystem.submitSuccess}
                className="px-3 py-1.5 bg-green-600 text-white text-[13.5px] font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Submit Success
              </button>
              <button
                onClick={alertSystem.registrationSuccess}
                className="px-3 py-1.5 bg-purple-600 text-white text-[13.5px]  font-medium rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Registration Success
              </button>
              <button
                onClick={alertSystem.emailVerify}
                className="px-3 py-1.5 bg-purple-600 text-white text-[13.5px]  font-medium rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Email Verification
              </button>
              <button
                onClick={alertSystem.loginSuccess}
                className="px-3 py-1.5 bg-green-600 text-white text-s[13.5px] font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Login Success
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() =>
                  alertSystem.error("Error!", "Something went wrong.")
                }
                className="px-3 py-1.5 bg-red-600 text-white text-sm [13.5px] nt-medium rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Custom Error
              </button>
              <button
                onClick={() =>
                  alertSystem.warning(
                    "Warning!",
                    "Please complete your profile."
                  )
                }
                className="px-3 py-1.5 bg-yellow-600 text-white text-[13.5px]  font-medium rounded-md hover:bg-yellow-700 transition-colors duration-200"
              >
                Custom Warning
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            How to Use in Your Code
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono">
            <div className="text-gray-600 mb-2">
              // 1. Add the hook to your component:
            </div>
            <div className="mb-4">const alertSystem = useAlerts();</div>

            <div className="text-gray-600 mb-2">
              // 2. Add the container to your JSX:
            </div>
            <div className="mb-4">
              &lt;AlertContainer alerts={alertSystem.alerts} onClose=
              {alertSystem.removeAlert} /&gt;
            </div>

            <div className="text-gray-600 mb-2">
              // 3. Show alerts anywhere:
            </div>
            <div className="mb-2">
              alertSystem.submitSuccess(); // Preset alert
            </div>
            <div className="mb-2">
              alertSystem.success('Title', 'Message'); // Custom
            </div>
            <div>alertSystem.error('Oops!', 'Something failed');</div>
          </div>
        </div>
      </div>

      <AlertContainer
        alerts={alertSystem.alerts}
        onClose={alertSystem.removeAlert}
      />

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
