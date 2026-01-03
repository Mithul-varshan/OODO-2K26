import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Header = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              Global<span className="text-blue-500">Trotter</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {t("home")}
            </Link>
            <Link
              to="/my-trips"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {t("myTrips")}
            </Link>
            <Link
              to="/calendar"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Calendar
            </Link>
            <Link
              to="/budget"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Budget
            </Link>
            <Link
              to="/explore"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {t("explore")}
            </Link>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
            
            <button className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center hover:border-blue-500 transition-colors duration-200">
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center hover:border-blue-500 transition-colors duration-200"
            >
              <User className="w-5 h-5 text-gray-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                to="/my-trips"
                className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("myTrips")}
              </Link>
              <Link
                to="/explore"
                className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("explore")}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-300 hover:text-white transition-colors duration-200 py-2 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
