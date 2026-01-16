import Header from "../components/Header";
import Footer from "../components/Footer";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { openRazorpay } from "../lib/razorpay";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeItem, total, clearCart } = useCart();

  /* ---------------- PROMO STATES ---------------- */
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  /* ---------------- FETCH ACTIVE COUPONS ---------------- */
  useEffect(() => {
    const fetchCoupons = async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("id, code, discount_percent, expires_at")
        .eq("active", true);

      if (!error && data) {
        const valid = data.filter(
          (c) => !c.expires_at || new Date(c.expires_at) > new Date()
        );
        setAvailableCoupons(valid);
      }
    };

    fetchCoupons();
  }, []);

  /* ---------------- APPLY PROMO ---------------- */
  const applyPromo = async (codeOverride?: string) => {
    if (!user) {
      setPromoError("Login required to apply promo");
      return;
    }

    const code = (codeOverride ?? promoCode).trim().toUpperCase();

    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (error || !promo) {
      setPromoError("Invalid promo code");
      setDiscountPercent(0);
      setAppliedPromo(null);
      return;
    }

    // ⏰ Expiry check
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      setPromoError("Promo code expired");
      setDiscountPercent(0);
      setAppliedPromo(null);
      return;
    }

    // 🔐 Per-user usage check
    const { data: usage } = await supabase
      .from("promo_usages")
      .select("id")
      .eq("promo_code_id", promo.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (usage) {
      setPromoError("You already used this promo code");
      setDiscountPercent(0);
      setAppliedPromo(null);
      return;
    }

    setPromoError("");
    setPromoCode(promo.code);
    setDiscountPercent(promo.discount_percent);
    setAppliedPromo(promo);
  };

  /* ---------------- PRICE CALC ---------------- */
  const discountAmount = Math.round((total * discountPercent) / 100);
  const finalAmount = Math.max(total - discountAmount, 0);

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = async () => {
    if (!user) {
      navigate("/auth?redirect=/cart");
      return;
    }

    try {
      // 1️⃣ Create order (discounted)
      const res = await fetch("/api/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: user.id,
    items: items.map((item) => ({
      id: item.id,
    })),
    promoCode: appliedPromo?.code || null,
  }),
});


      if (!res.ok) throw new Error("Order creation failed");

      const order = await res.json();

      // 2️⃣ Razorpay
      openRazorpay({
        order,
        user,
        onSuccess: async (response: any) => {
          try {
            // 3️⃣ Verify payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              alert("Payment verification failed");
              return;
            }

            // 4️⃣ Save purchases
            const rows = items.map((item) => ({
              user_id: user.id,
              resource_id: item.id,
              amount: item.price,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            }));

            const { error } = await supabase.from("purchases").upsert(rows, {
              onConflict: "user_id,resource_id",
              ignoreDuplicates: true,
            });

            if (error) {
              alert("Payment done, but saving purchase failed");
              return;
            }

            // 5️⃣ Save promo usage
            if (appliedPromo) {
              await supabase.from("promo_usages").insert({
                promo_code_id: appliedPromo.id,
                user_id: user.id,
              });
            }

            // 6️⃣ Clear + redirect
            clearCart();
            navigate("/my-resources");
          } catch (err) {
            console.error("Post-payment error:", err);
            alert("Something went wrong after payment");
          }
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
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
          {/* CART ITEMS */}
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

          {/* ORDER SUMMARY */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 text-sm text-gray-400 flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            {discountPercent > 0 && (
              <div className="mt-2 text-sm text-green-400 flex justify-between">
                <span>Discount ({discountPercent}%)</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}

            <div className="mt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>

            {/* AVAILABLE COUPONS */}
            {availableCoupons.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  Available Coupons
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => applyPromo(c.code)}
                      className="px-3 py-1 text-xs rounded-full border border-purple-500/40 text-purple-400 hover:bg-purple-600 hover:text-white transition"
                    >
                      {c.code} ({c.discount_percent}% OFF)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PROMO INPUT */}
            <div className="mt-4">
              <label className="text-sm text-gray-400">Promo Code</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => applyPromo()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-xs text-red-400 mt-2">{promoError}</p>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={items.length === 0}
              className="mt-6 w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {user ? `Pay ₹${finalAmount}` : "Login to Pay"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Cart;
