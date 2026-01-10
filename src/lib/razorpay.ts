export const openRazorpay = ({
  order,
  user,
  onSuccess,
}: {
  order: any;
  user: any;
  onSuccess: (response: any) => void;
}) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    name: "Esports4All",
    description: "Purchase Resources",
    order_id: order.id,

    handler: (response: any) => {
      onSuccess(response); // ✅ keep as-is
    },

    prefill: {
      email: user.email,
    },

    theme: {
      color: "#7c3aed",
    },
  };

  if (!(window as any).Razorpay) {
    alert("Razorpay SDK not loaded");
    return;
  }

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
