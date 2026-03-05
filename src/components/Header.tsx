import { NavLink, useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/e4a.svg";

const Header = () => {
  const { user, role, username, logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logo}
            alt="Esports4All Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-medium"
                  : "hover:text-white transition"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? "text-purple-400 font-medium"
                  : "hover:text-white transition"
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* USER AREA */}
        <div className="relative" ref={menuRef}>
          {user ? (
            <>
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="text-gray-300 hover:text-white"
              >
                <UserCircle size={30} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-lg z-50">
                  
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-medium text-white">
                      @{username || "user"}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-white/10">
                      {role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>

                  {/* DASHBOARD LINK */}
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-purple-400"
                    >
                      Dashboard
                    </button>
                  )}

                  {/* LOGOUT */}
                  <div className="border-t border-white/10 p-3">
                    <button
                      onClick={async () => {
                        await logout();
                        window.location.href = "/";
                      }}
                      className="w-full py-2 rounded-lg border border-white/10 hover:bg-red-500/10 text-red-400"
                    >
                      Log out
                    </button>
                  </div>

                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-gray-300 hover:text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;