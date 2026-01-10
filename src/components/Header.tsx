import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, UserCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/e4a.svg";

const Header = () => {
  const { user, role, username, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/my-resources", label: "My Resources" },
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
            className="h-16 md:h-16 w-auto object-contain"
          />
        </div>

        {/* DESKTOP NAV LINKS */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative">
          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="relative text-gray-300 hover:text-white"
          >
            <ShoppingCart size={18} />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-purple-600 text-white rounded-full px-1">
                {items.length}
              </span>
            )}
          </button>

          {/* USER MENU */}
          {user ? (
            <>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="text-gray-300 hover:text-white"
              >
                <UserCircle size={30} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-lg z-50">
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-medium text-white">
                      @{username ?? "user"}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-white/10">
                      {role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>

                  {/* LINKS */}
                  <div className="flex flex-col text-sm">
                    {links.map((item) => (
                      <button
                        key={item.to}
                        onClick={() => {
                          navigate(item.to);
                          setUserMenuOpen(false);
                        }}
                        className="px-4 py-2 text-left hover:bg-white/5"
                      >
                        {item.label}
                      </button>
                    ))}

                    {role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setUserMenuOpen(false);
                        }}
                        className="px-4 py-2 text-left hover:bg-white/5 text-purple-400"
                      >
                        Dashboard
                      </button>
                    )}
                  </div>

                  {/* LOGOUT */}
                  <div className="border-t border-white/10 p-3">
                    <button
                      onClick={async () => {
                        await logout();
                        window.location.href = "/"; // 🔥 MOBILE SAFE
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
