import { LogOut, CheckSquare, Search, Bell, Settings, Menu, X, Command } from "lucide-react";
import { useState } from "react";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
    
  const user = useSelector((state: RootState) => state.auth.user);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.email || "User";
  const initials = user?.fullName ? getInitials(user.fullName) : "U";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/users"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Users
              </Link>

              <Link to="/projects" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Projects
              </Link>
              <Link to="/tasks" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Tasks
              </Link>
              <Link to="#" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Team
              </Link>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearchFocused ? (
                  <Command className="w-4 h-4 text-blue-500" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                placeholder="Search tasks, projects, or people..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all duration-300 focus:outline-none ${
                  isSearchFocused
                    ? 'border-blue-500 bg-white shadow-lg ring-4 ring-blue-100'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-semibold text-sm">
                    {initials}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 font-medium group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              <span className="hidden xl:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <a href="#" className="block px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
              Dashboard
            </a>
            <a href="#" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Projects
            </a>
            <a href="#" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Tasks
            </a>
            <a href="#" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Team
            </a>
            <div className="border-t border-gray-200 my-2"></div>
            <a href="#" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}