import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useAlert } from "./AlertContext";

const GlobalToast = () => {
  const { showMessage } = useAlert();

  if (!showMessage) return null;

  const lowerMessage = showMessage.toLowerCase();

  const getType = () => {
    if (
      lowerMessage.includes("success") ||
      lowerMessage.includes("created") ||
      lowerMessage.includes("registered") ||
      lowerMessage.includes("logged in") ||
      lowerMessage.includes("email sent") ||
      lowerMessage.includes("completed") ||
      lowerMessage.includes("done")
    ) {
      return "success";
    } else if (
      lowerMessage.includes("fail") ||
      lowerMessage.includes("error") ||
      lowerMessage.includes("not found") ||
      lowerMessage.includes("unauthorized") ||
      lowerMessage.includes("conflict")
    ) {
      return "error";
    } else if (
      lowerMessage.includes("warning") ||
      lowerMessage.includes("already exists") ||
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("deprecated")
    ) {
      return "warning";
    } else {
      return "info";
    }
  };

  const type = getType();

  const typeStyles = {
    success: {
      bg: "bg-green-500",
      Icon: CheckCircle,
    },
    error: {
      bg: "bg-red-500",
      Icon: AlertCircle,
    },
    warning: {
      bg: "bg-yellow-500",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-500",
      Icon: Info,
    },
  };

  const { bg, Icon } = typeStyles[type];

  return (
    <div
      className={`${bg} fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right`}
    >
      <Icon className="w-4.5 h-4.5" />
      <span>{showMessage}</span>
    </div>
  );
};

export default GlobalToast;
