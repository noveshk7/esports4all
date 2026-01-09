import { useNavigate } from "react-router-dom";

type ProductCardProps = {
  title: string;
  price: number;
  image: string;
};

const ProductCard = ({ title, price, image }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover rounded-lg mb-4"
      />

      <h3 className="font-semibold">{title}</h3>

      <p className="text-purple-400 mt-2">₹{price}</p>

      <button
        onClick={() => navigate("/products")}
        className="mt-4 w-full py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
      >
        Go to Products
      </button>
    </div>
  );
};

export default ProductCard;
