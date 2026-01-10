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

    handler: function (response: any) {
      onSuccess(response); // ✅ response passed correctly
    },

    prefill: {
      email: user.email,
    },

    theme: {
      color: "#7c3aed",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
