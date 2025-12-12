import { 
  LogOut, CheckSquare, Search, Bell, Settings, Menu, X, Command, Check, Clock, AlertCircle 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { 
  fetchUnreadNotifications, markNotificationAsRead, type Notification 
} from "../features/Notifications/notificationsSlice";
import type { AppDispatch } from "../store/store";
import { startNotificationHub, stopNotificationHub } from "../features/Notifications/notificationHub";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { unread } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  // ----------------- SignalR: Real-time notifications -----------------
  useEffect(() => {
    startNotificationHub((notif: Notification) => {
      dispatch({ type: "notifications/createNotification/fulfilled", payload: notif });
    });

    return () => stopNotificationHub();
  }, [dispatch]);

  // ----------------- Fetch initial unread notifications -----------------
  useEffect(() => {
    dispatch(fetchUnreadNotifications());

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  // ----------------- Notification sound -----------------
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    fetch("/sounds/notif.mp3")
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current.decodeAudioData(arrayBuffer);
      })
      .then(decodedData => { audioBufferRef.current = decodedData; })
      .catch(err => console.log("Audio load failed", err));
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const playNotificationSound = () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  };

  useEffect(() => {
    if (unread.length > prevUnreadCount) playNotificationSound();
    setPrevUnreadCount(unread.length);
  }, [unread.length]);

  // ----------------- Helper functions -----------------
  const handleLogout = () => console.log("Logout clicked");

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const displayName = user?.email || "User";
  const initials = user?.fullName ? getInitials(user.fullName) : "U";

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const getNotificationIcon = (type?: any) => {
    switch (type) {
      case "success": return <Check className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColorClasses = (type?: any) => {
    switch (type) {
      case "success": return "bg-green-50 border-green-200";
      case "warning": return "bg-orange-50 border-orange-200";
      case "error": return "bg-red-50 border-red-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };
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
              {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/users" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">Users</Link>
              <Link to="/projects" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">Projects</Link>
              <Link to="/tasks" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">Tasks</Link>
              <Link to="/taskmangement" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Taskmangement
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearchFocused ? <Command className="w-4 h-4 text-blue-500" /> : <Search className="w-4 h-4 text-gray-400" />}
              </div>
              <input
                type="text"
                placeholder="Search tasks, projects, or people..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all duration-300 focus:outline-none ${
                  isSearchFocused ? 'border-blue-500 bg-white shadow-lg ring-4 ring-blue-100' : 'border-gray-200 hover:bg-gray-100'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 relative">
            {/* Notifications */}
          {/* Notifications */}
              <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)} // just toggle menu
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Bell className={`w-5 h-5 transition-all duration-300 ${unread.length > 0 ? 'animate-pulse text-blue-600' : ''}`} />
                {unread.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {unread.length > 9 ? '9+' : unread.length}
                  </span>
                )}
              </button>



              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unread.length > 0 && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                            {unread.length} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {unread.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {unread.map((n: Notification) => (
                          <div
                            key={n.id}
                            className={`p-4 hover:bg-gray-50 transition-all duration-300 border-l-4 ${getNotificationColorClasses(n.type)}`}
                          >
                            <div className="flex gap-3">
                              {/* Icon */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColorClasses(n.type)}`}>
                                {getNotificationIcon(n.type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 font-medium leading-relaxed mb-1">
                                  {n.message}
                                </p>
                                
                                {/* Timestamp */}
                                {n.timestamp && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                    <Clock className="w-3 h-3" />
                                    <span>{n.timestamp}</span>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-2">
                                  {n.link && (
                                    <Link
                                      to={n.link}
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                      onClick={() => handleMarkRead(n.id)}
                                    >
                                      View Details
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => handleMarkRead(n.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-gray-600 text-xs font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <Check className="w-3 h-3" />
                                    Mark as Read
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No new notifications</p>
                        <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {unread.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

            {/* Profile */}
            <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-semibold text-sm">{initials}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
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
            <Link to="/dashboard" className="block px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">Dashboard</Link>
            <Link to="/projects" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Projects</Link>
            <Link to="/tasks" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Tasks</Link>
            <Link to="/team" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Team</Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link to="/settings" className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Settings</Link>
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


