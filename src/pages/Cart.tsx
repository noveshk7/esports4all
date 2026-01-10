import Header from "../components/Header";
import Footer from "../components/Footer";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { openRazorpay } from "../lib/razorpay";
import { supabase } from "../lib/supabase";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeItem, total, clearCart } = useCart();

  const handlePayment = async () => {
    if (!user) {
      navigate("/auth?redirect=/cart");
      return;
    }

    try {
      // 1️⃣ Create Razorpay order
      const res = await fetch("http://127.0.0.1:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!res.ok) {
        throw new Error("Order creation failed");
      }

      const order = await res.json();

      // 2️⃣ Open Razorpay Checkout
      openRazorpay({
        order,
        user,
        onSuccess: async (response: any) => {
          try {
            console.log("Payment success:", response);

            // 🔐 VERIFY PAYMENT
            const verifyRes = await fetch(
              "http://127.0.0.1:5000/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyRes.ok) {
              alert("Payment verification request failed");
              return;
            }

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              alert("Payment verification failed");
              return;
            }

            // 💾 SAVE PURCHASES
            const rows = items.map((item) => ({
              user_id: user.id,
              resource_id: item.id,
              amount: item.price,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            }));

            const { error } = await supabase
  .from("purchases")
  .upsert(rows, {
    onConflict: "user_id,resource_id",
    ignoreDuplicates: true,
  });

if (error) {
  console.error("SUPABASE UPSERT ERROR:", error);
  alert("Payment done, but purchase could not be saved.");
  return;
}



            // 🧹 CLEAR CART
            clearCart();

            // 🚀 REDIRECT
            navigate("/my-resources");
          } catch (err) {
            console.error("POST PAYMENT ERROR:", err);
            alert("Something went wrong after payment");
          }
        },
      });
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed. Check console.");
    }
  };

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
              onClick={handlePayment}
              disabled={items.length === 0}
              className="mt-6 w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {user ? `Pay ₹${total}` : "Login to Pay"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Cart;
