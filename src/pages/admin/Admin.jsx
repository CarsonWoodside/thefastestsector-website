import { useAuth } from "../../contexts/AuthContext";
import AdminLogin from "./AdminLogin";
import AdminPosts from "./AdminPosts";

const Admin = () => {
  const { isAuthenticated } = useAuth();

  // Show login if not authenticated, otherwise show admin dashboard
  return isAuthenticated ? <AdminPosts /> : <AdminLogin />;
};

export default Admin;
