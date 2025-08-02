import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [showMessage, setShowMessage] = useState("");

  const triggerAlert = (message, duration = 3000) => {
    setShowMessage(message);
    setTimeout(() => {
      setShowMessage("");
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ showMessage, triggerAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook to use the alert context
export const useAlert = () => useContext(AlertContext);
