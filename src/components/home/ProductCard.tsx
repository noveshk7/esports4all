const ProductCard = ({ title, price }: { title: string; price: number }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="h-40 bg-black/40 rounded mb-4" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-purple-400 mt-2">₹{price}</p>

      <button className="mt-4 w-full py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
