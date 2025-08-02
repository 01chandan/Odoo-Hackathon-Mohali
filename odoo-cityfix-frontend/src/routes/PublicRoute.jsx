import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
