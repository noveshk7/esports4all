import Header from "../components/Header";
import CategoryTabs from "../components/products/CategoryTabs";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

const Products = () => {
  const { addItem, isInCart } = useCart();

  const [pdfs, setPdfs] = useState<any[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [infoMaps, setInfoMaps] = useState<any[]>([]);
  const [hqMaps, setHqMaps] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<
    "maps" | "pdfs" | "sheets" | "info-maps" | "hq-maps"
  >("maps");

  const [selectedPlaces, setSelectedPlaces] = useState<Record<string, string>>(
    {}
  );

  const groupedByMap = resources.reduce((acc: any, res: any) => {
    if (!res.map_name) return acc;
    acc[res.map_name] = acc[res.map_name] || [];
    acc[res.map_name].push(res);
    return acc;
  }, {});

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .eq("type", "pdf")
      .then(({ data }) => {
        setPdfs(data || []);
      });

    supabase
      .from("resources")
      .select("*")
      .eq("type", "sheet")
      .then(({ data }) => {
        setSheets(data || []);
      });

    supabase
      .from("resources")
      .select("*")
      .eq("type", "rotation-map")
      .then(({ data }) => {
        setResources(data || []);
      });

    supabase
      .from("resources")
      .select("*")
      .eq("type", "info-map")
      .then(({ data }) => {
        setInfoMaps(data || []);
      });

    supabase
      .from("resources")
      .select("*")
      .eq("type", "hq-map")
      .then(({ data }) => {
        setHqMaps(data || []);
      });
  }, []);

  const handleAddToCart = () => {
    Object.entries(selectedPlaces).forEach(([mapName, id]) => {
      const res = resources.find((r) => r.id === id);
      if (!res) return;

      // ✅ Skip if already in cart
      if (isInCart(res.id)) return;

      addItem({
        id: res.id,
        title: res.title,
        map: mapName,
        price: res.price,
      });
    });
  };

  const selectedResources = Object.values(selectedPlaces)
    .map((id) => resources.find((r) => r.id === id))
    .filter(Boolean);

  const totalPrice = selectedResources.reduce(
    (sum: number, r: any) => sum + r.price,
    0
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      {/* HERO */}
      <section className="pt-28 px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Premium Resources
        </h1>
        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          Professional esports resources to elevate your gameplay
        </p>

        <div className="mt-8">
          <CategoryTabs active={activeTab} onChange={setActiveTab} />
        </div>
      </section>

      {/* MAPS */}
      {activeTab === "maps" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl font-semibold">
            Rotation Path Bundles
          </h2>

          <p className="text-center text-gray-400 mt-2 text-sm">
            Select one drop location from each map
          </p>

          <div className="mt-8 max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 space-y-6">
            {Object.entries(groupedByMap).map(([map, places]: any) => (
              <div key={map}>
                <label className="block text-sm mb-2">{map}</label>
                <select
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
                  value={selectedPlaces[map] || ""}
                  onChange={(e) =>
                    setSelectedPlaces((p) => ({
                      ...p,
                      [map]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select drop location</option>
                  {places.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.title} – ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* SUMMARY */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-4">
              <div>
                <p className="text-sm text-gray-400">
                  {selectedResources.length} selected
                </p>
                <p className="text-xl font-semibold">₹{totalPrice}</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedResources.length === 0}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-xl"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PDFS */}
      {activeTab === "pdfs" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl font-semibold">
            Strategy Guides
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {pdf.thumbnail_url && (
                  <img
                    src={pdf.thumbnail_url}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-medium">{pdf.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {pdf.description}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-purple-400 font-semibold">
                      ₹{pdf.price}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          id: pdf.id,
                          title: pdf.title,
                          map: "PDF",
                          price: pdf.price,
                        })
                      }
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHEETS */}
      {activeTab === "sheets" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl font-semibold">
            Team Resources
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sheets.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {s.thumbnail_url && (
                  <img
                    src={s.thumbnail_url}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{s.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-purple-400 font-semibold">
                      ₹{s.price}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          id: s.id,
                          title: s.title,
                          map: "Sheet",
                          price: s.price,
                        })
                      }
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INFO MAPS */}
{activeTab === "info-maps" && (
  <section className="mt-12 px-4 sm:px-6">
    <h2 className="text-center text-xl sm:text-2xl font-semibold">
      Info Maps
    </h2>

    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {infoMaps.map((item) => {
        const alreadyAdded = isInCart(item.id);

        return (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          >
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {item.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-purple-400 font-semibold">
                  ₹{item.price}
                </span>

                <button
                  disabled={alreadyAdded}
                  onClick={() =>
                    addItem({
                      id: item.id,
                      title: item.title,
                      map: "Info Map",
                      price: item.price,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm ${
                    alreadyAdded
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {alreadyAdded ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}

{/* HQ MAPS */}
{activeTab === "hq-maps" && (
  <section className="mt-12 px-4 sm:px-6">
    <h2 className="text-center text-xl sm:text-2xl font-semibold">
      HQ Maps
    </h2>

    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {hqMaps.map((item) => {
        const alreadyAdded = isInCart(item.id);

        return (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          >
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {item.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-purple-400 font-semibold">
                  ₹{item.price}
                </span>

                <button
                  disabled={alreadyAdded}
                  onClick={() =>
                    addItem({
                      id: item.id,
                      title: item.title,
                      map: "HQ Map",
                      price: item.price,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm ${
                    alreadyAdded
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {alreadyAdded ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}


      <Footer />
    </main>
  );
};

export default Products;
