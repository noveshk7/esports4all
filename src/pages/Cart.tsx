import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { items, removeItem, total } = useCart();

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.map}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold">₹{item.price}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-gray-400 text-center mt-10">
                Your cart is empty
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 text-sm text-gray-400 flex justify-between">
              <span>Items ({items.length})</span>
              <span>₹{total}</span>
            </div>

            <div className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate("/auth?redirect=/cart");
                } else {
                  // payment will be here later
                  alert("Proceed to payment");
                }
              }}
              className="mt-6 w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
            >
              {user ? "Proceed to Pay" : "Login to Pay"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Cart;
