import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/admin/Admin";
import BlogEditor from "./pages/admin/BlogEditor";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

// Main App Component
function AppContent() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/admin/posts/new"
          element={
            <ProtectedRoute>
              <BlogEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/edit/:id"
          element={
            <ProtectedRoute>
              <BlogEditor />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Root App with Providers
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
