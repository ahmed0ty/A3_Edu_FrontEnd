// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [notifyOpen, setNotifyOpen] = useState(false);

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center">
//       <Link to="/dashboard" className="text-xl font-bold text-blue-400">
//         EduPlatform 🚀
//       </Link>

//       <div className="flex items-center gap-6 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => setNotifyOpen(!notifyOpen)}
//             className="relative text-gray-300 hover:text-white"
//           >
//             🔔
//             <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
//               3
//             </span>
//           </button>

//           {notifyOpen && (
//             <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-xl shadow-lg p-4 z-50">
//               <p className="text-sm text-gray-300 border-b border-gray-700 pb-2">
//                 New course available 🎉
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Avatar */}
//         <div className="relative">
//           <img
//             src={user?.profileImage || "https://i.pravatar.cc/40"}
//             alt="avatar"
//             className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
//             onClick={() => setOpen(!open)}
//           />

//           {open && (
//             <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-xl shadow-lg py-2 z-50">
//               <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">
//                 👤 Profile
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400"
//               >
//                 🚪 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="
      bg-white/80 dark:bg-gray-900/80
      backdrop-blur-md
      border-b border-gray-200 dark:border-gray-800
      px-6 py-3
      flex justify-between items-center
      sticky top-0 z-50
      transition-colors duration-300
    ">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight flex items-center gap-2"
      >
        <span className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-lg text-sm font-extrabold">A3</span>
        Edu
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-gray-100 hover:bg-gray-200
            dark:bg-gray-800 dark:hover:bg-gray-700
            text-gray-600 dark:text-gray-300
            transition-all duration-200
          "
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifyOpen(!notifyOpen); setOpen(false); }}
            className="
              w-10 h-10 rounded-xl flex items-center justify-center relative
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-600 dark:text-gray-300
              transition-all duration-200
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notifyOpen && (
            <div className="
              absolute right-0 mt-2 w-72
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-2xl shadow-xl p-1 z-50
              animate-fadeIn
            ">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-2 uppercase tracking-wider">
                Notifications
              </p>
              {[
                { icon: "🎉", text: "New course available!", time: "2m ago" },
                { icon: "✅", text: "Quiz graded successfully", time: "1h ago" },
                { icon: "📢", text: "Instructor replied to you", time: "3h ago" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer transition-colors">
                  <span className="text-lg mt-0.5">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{n.text}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setOpen(!open); setNotifyOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <img
              src={user?.profileImage || "https://i.pravatar.cc/40"}
              alt="avatar"
              className="w-8 h-8 rounded-lg object-cover border-2 border-blue-500"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.role || "student"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="
              absolute right-0 mt-2 w-52
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-2xl shadow-xl py-1 z-50
              animate-fadeIn
            ">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-b-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}