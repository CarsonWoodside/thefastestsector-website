import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { getStoredPosts } from "../utils/blogHelpers";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Get posts from localStorage
    const allPosts = getStoredPosts();
    const foundPost = allPosts.find((p) => p.slug === slug);
    setPost(foundPost);

    if (foundPost) {
      document.title = `${foundPost.title} | The Fastest Sector`;

      // Find related posts by category or tags
      const related = allPosts
        .filter((p) => p.id !== foundPost.id && p.published)
        .filter(
          (p) =>
            p.category === foundPost.category ||
            p.tags.some((tag) => foundPost.tags.includes(tag))
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article URL copied to clipboard!");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <Link to="/blog" className="text-[#B91C3C] hover:text-[#991B1B]">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#B91C3C] hover:text-[#991B1B] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-[#B91C3C] text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <button
              onClick={shareArticle}
              className="flex items-center gap-2 text-gray-600 hover:text-[#B91C3C] transition-colors"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.readTime}</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#B91C3C] prose-a:no-underline hover:prose-a:text-[#991B1B] prose-strong:text-[#B91C3C] prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-[#B91C3C] prose-blockquote:bg-red-50"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={18} className="text-gray-500" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="hover:text-[#B91C3C] transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <div className="text-xs text-gray-500">
                    {formatDate(relatedPost.publishDate)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
