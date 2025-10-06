import { useState } from "react";
import { Menu, X, Calendar, Home, BookOpen, Search, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useLiveRaceStatus } from "../../hooks/useLiveRaceStatus";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isRaceActive } = useLiveRaceStatus();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="The Fastest Sector"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            {/* Conditionally rendered Live Race Link */}
            {isRaceActive && (
              <Link
                to="/live"
                className="flex items-center space-x-2 text-red-600 animate-pulse hover:text-red-800 transition-colors"
              >
                <Radio size={18} />
                <span className="font-bold">Live</span>
              </Link>
            )}
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
              {isRaceActive && (
                <Link
                  to="/live-race"
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Live Race
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
