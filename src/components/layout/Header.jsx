import { useState } from "react";
import { Menu, X, Calendar, Home, BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#B91C3C] rounded-full flex items-center justify-center">
              <div
                className="w-6 h-6 bg-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 0% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 50%, 100% 50%)",
                }}
              ></div>
            </div>
            <span className="text-xl font-bold text-gray-900">
              thefastestsector
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#B91C3C] transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/blog"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#B91C3C] transition-colors"
            >
              <BookOpen size={18} />
              <span>Blog</span>
            </Link>
            <Link
              to="/calendar"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#B91C3C] transition-colors"
            >
              <Calendar size={18} />
              <span>Calendar</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#B91C3C] transition-colors"
            >
              <Search size={18} />
              <span>Race Search</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#B91C3C]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#B91C3C] py-2"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/blog"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#B91C3C] py-2"
              >
                <BookOpen size={18} />
                <span>Blog</span>
              </Link>
              <Link
                to="/calendar"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#B91C3C] py-2"
              >
                <Calendar size={18} />
                <span>Calendar</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#B91C3C] py-2"
              >
                <Search size={18} />
                <span>Race Search</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
