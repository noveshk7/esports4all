import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, role, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/my-resources", label: "My Resources" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/src/assets/e4a.jpeg"
              alt="Coach Selzer Logo"
              className="h-14 w-14 object-contain"
            />

            <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ESPORTS4ALL
            </span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
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

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded bg-white/10">
                  {role === "admin" ? "Admin" : "User"}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/"); // 🔥 optional but recommended
                  }}
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="hidden md:block text-sm text-gray-300 hover:text-white"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-black z-40 md:hidden pt-20 px-6">
          <div className="flex flex-col gap-6 text-white text-lg">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {role === "admin" && (
              <NavLink to="/admin" onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
            )}

            <div className="border-t border-white/10 pt-6">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/auth");
                    setOpen(false);
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
