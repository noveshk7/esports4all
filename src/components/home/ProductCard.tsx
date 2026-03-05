import { useNavigate } from "react-router-dom";

type ProductCardProps = {
  title: string;
  image: string;
  type: string;
};

const ProductCard = ({ title, image, type }: ProductCardProps) => {
  const navigate = useNavigate();

  const formatType = (t: string) => {
    if (t === "rotation-place") return "Rotation Path";
    if (t === "pdf") return "PDF";
    if (t === "sheet") return "Sheet";
    if (t === "info-map") return "Info Map";
    if (t === "hq-map") return "HQ Map";
    return t;
  };

  const getTypeColor = (t: string) => {
    if (t === "pdf")
      return "bg-blue-500/20 text-blue-400";
    if (t === "sheet")
      return "bg-green-500/20 text-green-400";
    if (t === "rotation-place")
      return "bg-orange-500/20 text-orange-400";
    if (t === "info-map")
      return "bg-cyan-500/20 text-cyan-400";
    if (t === "hq-map")
      return "bg-purple-500/20 text-purple-400";

    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/40 transition hover:scale-105">

      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover rounded-lg mb-4"
      />

      {/* TYPE BADGE */}
      <span
        className={`inline-block text-xs px-2 py-1 rounded mb-2 ${getTypeColor(type)}`}
      >
        {formatType(type)}
      </span>

      <h3 className="font-semibold">{title}</h3>

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