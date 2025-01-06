import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  if (!user || user.role !== "Admin") {
    // Redirect to the home page or an unauthorized page if the user is not an admin
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
