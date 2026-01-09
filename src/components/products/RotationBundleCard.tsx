import { useState } from "react";
import { useCart } from "../../context/CartContext";



const maps = [
  { name: "Bermuda", options: ["Clock Tower", "Peak", "Mars Electric"] },
  { name: "Purgatory", options: ["Ski Lodge", "Brasilia"] },
  { name: "Kalahari", options: ["Council Hall", "Refinery"] },
  { name: "Alpine", options: ["Blue Ville", "Dock"] },
  { name: "Nexterra", options: ["Plazaria", "Grav Labs"] },
  { name: "Solara", options: ["Nova Base", "Power Plant"] },
];

const PRICE_PER_MAP = 99;
const MAX_PRICE = 599;

const RotationBundleCard = () => {
const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const selectedCount = Object.keys(selected).length;
  const price =
    selectedCount * PRICE_PER_MAP >= MAX_PRICE
      ? MAX_PRICE
      : selectedCount * PRICE_PER_MAP;

  return (
    
    <div className="w-full max-w-xl rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-lg font-semibold">Choose Your Rotation Paths</h3>
      <p className="text-sm text-gray-400 mt-1">
        Select one drop location from each map to get the complete rotation path guide
      </p>

      <div className="mt-6 space-y-4">
        {maps.map((map) => (
          <div key={map.name}>
            <label className="block text-sm mb-1">{map.name}</label>
            <select
              className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              value={selected[map.name] || ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  [map.name]: e.target.value,
                }))
              }
            >
              <option value="">Select drop location</option>
              {map.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            {selectedCount} maps selected
          </p>
          <p className="text-lg font-semibold">₹{price}</p>
        </div>

      <button
onClick={() => {
  Object.entries(selected).forEach(([mapName, dropLocation]) => {
    addItem({
      id: crypto.randomUUID(),
      title: "Rotation Path",
      map: `${mapName} – ${dropLocation}`,
      price: 99,
    });
  });
}}

  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
>
  Add to Cart
</button>

      </div>
    </div>
  );
};

export default RotationBundleCard;
