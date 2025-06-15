import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Eye, ArrowLeft } from "lucide-react";
import QuillEditor from "../../components/QuillEditor";
import { categories } from "../../data/blogPosts";
import { getStoredPosts, saveStoredPosts } from "../../utils/blogHelpers";

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: categories[0], // <-- Make sure this is categories[0], not just categories
    tags: [],
    featuredImage: "",
    published: false,
    author: "The Fastest Sector",
    publishDate: new Date().toISOString().split("T")[0], // <-- Make sure you split and take [0] for date
  });

  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const allPosts = getStoredPosts();
      const existingPost = allPosts.find((p) => p.id === parseInt(id));
      if (existingPost) {
        setPost(existingPost);
        setTagInput(existingPost.tags.join(", "));
      }
    }
  }, [id, isEditing]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title) => {
    setPost((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleTagsChange = (value) => {
    setTagInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setPost((prev) => ({ ...prev, tags }));
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = (publish = false) => {
    if (!post.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!post.content.trim()) {
      alert("Please enter some content");
      return;
    }

    const postData = {
      ...post,
      published: publish,
      readTime: calculateReadTime(post.content),
      id: isEditing ? post.id : Date.now(),
      metaDescription:
        post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160),
    };

    const allPosts = getStoredPosts();
    let updatedPosts;
    if (isEditing) {
      updatedPosts = allPosts.map((p) => (p.id === postData.id ? postData : p));
    } else {
      updatedPosts = [postData, ...allPosts];
    }
    saveStoredPosts(updatedPosts);

    alert(`Post ${publish ? "published" : "saved as draft"} successfully!`);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            title="Back to all posts"
          >
            <ArrowLeft size={20} />
            Back to Posts
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={showPreview ? "Edit this post" : "Preview this post"}
            >
              <Eye size={16} />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => handleSave(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              title="Save as draft"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#B91C3C] text-white rounded-lg hover:bg-[#991B1B]"
              title="Publish this post"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            {showPreview ? (
              <div className="bg-white rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-gray-400">(Required)</span>
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Post title..."
                    className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400"
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                    URL Slug{" "}
                    <span className="text-gray-400">
                      (Auto-generated, but editable)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={post.slug}
                    onChange={(e) =>
                      setPost((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="post-slug"
                    className="w-full text-sm text-gray-600 border-b border-gray-200 pb-2 outline-none"
                  />
                </div>

                <div className="bg-white rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt{" "}
                    <span className="text-gray-400">
                      (Short summary for blog listings)
                    </span>
                  </label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) =>
                      setPost((prev) => ({ ...prev, excerpt: e.target.value }))
                    }
                    placeholder="Brief description of your post..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
                  />
                </div>

                <div className="bg-white rounded-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content{" "}
                    <span className="text-gray-400">
                      (Format your text with the toolbar above)
                    </span>
                  </label>
                  <QuillEditor
                    value={post.content}
                    onChange={(content) =>
                      setPost((prev) => ({ ...prev, content }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4">Post Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category{" "}
                    <span className="text-gray-400">
                      (Choose a category for your post)
                    </span>
                  </label>
                  <select
                    value={post.category}
                    onChange={(e) =>
                      setPost((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags{" "}
                    <span className="text-gray-400">
                      (Separate with commas, e.g. F1, McLaren, Analysis)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="F1, McLaren, Analysis"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL{" "}
                    <span className="text-gray-400">
                      (Paste a direct image link)
                    </span>
                  </label>
                  <input
                    type="url"
                    value={post.featuredImage}
                    onChange={(e) =>
                      setPost((prev) => ({
                        ...prev,
                        featuredImage: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt="Featured image preview"
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date{" "}
                    <span className="text-gray-400">
                      (Set the date this post will appear)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={post.publishDate}
                    onChange={(e) =>
                      setPost((prev) => ({
                        ...prev,
                        publishDate: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">Post Stats</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Words:{" "}
                  {post.content.replace(/<[^>]*>/g, "").split(/\s+/).length}
                </p>
                <p>Read time: {calculateReadTime(post.content)}</p>
                <p>Characters: {post.content.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
