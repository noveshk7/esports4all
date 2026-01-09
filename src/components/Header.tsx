import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, role, logout } = useAuth();

  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          COACH SELZER
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "Products" },
            { to: "/my-resources", label: "My Resources" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((item) => (
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

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            aria-label="Cart"
            className="relative text-gray-300 hover:text-white transition"
          >
            <ShoppingCart size={18} />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-purple-600 text-white rounded-full px-1">
                {items.length}
              </span>
            )}
          </button>

          {/* Login */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-white/10">
                {role === "admin" ? "Admin" : "User"}
              </span>

              <button
                onClick={logout}
                className="text-sm text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </div>
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
