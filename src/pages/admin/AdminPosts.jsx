import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Edit, Trash2, Eye, LogOut } from "lucide-react";
import { getStoredPosts, saveStoredPosts } from "../../utils/blogHelpers";

const AdminPosts = () => {
  const { logout } = useAuth();
  const [posts, setPosts] = useState([]);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const allPosts = getStoredPosts();
    setPosts(allPosts);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      saveStoredPosts(updatedPosts);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600">Manage your F1 content</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/posts/new"
              className="flex items-center gap-2 bg-[#B91C3C] text-white px-4 py-2 rounded-lg hover:bg-[#991B1B] transition-colors"
            >
              <Plus size={16} />
              New Post
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {formatDate(post.publishDate)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-2 text-gray-600 hover:text-[#B91C3C] transition-colors"
                          title="View Post"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-gray-600 hover:text-[#B91C3C] transition-colors"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
