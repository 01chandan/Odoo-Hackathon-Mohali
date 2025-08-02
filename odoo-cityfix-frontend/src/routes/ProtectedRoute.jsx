import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
