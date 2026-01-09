import Header from "../components/Header";
import CategoryTabs from "../components/products/CategoryTabs";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";

const Products = () => {
  const { addItem } = useCart();
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"maps" | "pdfs" | "sheets">(
    "maps"
  );

  const [resources, setResources] = useState<any[]>([]);
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
      .eq("type", "sheet")
      .then(({ data }) => {
        setSheets(data || []);
      });
  }, []);

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .eq("type", "pdf")
      .then(({ data }) => {
        setPdfs(data || []);
      });
  }, []);

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .eq("type", "rotation-map")
      .then(({ data }) => {
        setResources(data || []);
      });
  }, []);

  const handleAddToCart = () => {
    Object.entries(selectedPlaces).forEach(([mapName, resourceId]) => {
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) return;

      addItem({
        id: resource.id,
        title: resource.title,
        map: mapName,
        price: resource.price,
      });
    });
  };

  const selectedResources = Object.values(selectedPlaces)
    .map((id) => resources.find((r) => r.id === id))
    .filter(Boolean);

  const selectedCount = selectedResources.length;

  const totalPrice = selectedResources.reduce(
    (sum: number, res: any) => sum + res.price,
    0
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Premium Resources
        </h1>
        <p className="mt-3 text-gray-400">
          Professional esports resources to elevate your gameplay and team
          performance
        </p>

        <div className="mt-8">
          <CategoryTabs active={activeTab} onChange={setActiveTab} />
        </div>
      </section>

      {/* ROTATION MAPS SECTION */}

      {activeTab === "maps" && (
        <section className="mt-16 px-6">
          <h2 className="text-center text-2xl font-semibold">
            Rotation Path Bundles
          </h2>

          <p className="text-center text-gray-400 mt-2 text-sm">
            Select one drop location from each map
          </p>

          {Object.keys(groupedByMap).length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              No rotation maps available yet.
            </p>
          ) : (
            <div className="mt-10 max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              {Object.entries(groupedByMap).map(([mapName, places]: any) => (
                <div key={mapName}>
                  <label className="block text-sm font-medium mb-2">
                    {mapName}
                  </label>

                  <select
                    value={selectedPlaces[mapName] || ""}
                    onChange={(e) =>
                      setSelectedPlaces((prev) => ({
                        ...prev,
                        [mapName]: e.target.value,
                      }))
                    }
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
                  >
                    <option value="">Select drop location</option>

                    {places.map((place: any) => (
                      <option key={place.id} value={place.id}>
                        {place.title} – ₹{place.price}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* SUMMARY BAR */}

              <div className="mt-6 flex items-center justify-between gap-4 max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {selectedCount} map selected
                  </p>
                  <p className="text-2xl font-semibold">₹{totalPrice}</p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={selectedCount === 0}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-8 py-3 rounded-xl font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* PDFS SECTION */}

      {activeTab === "pdfs" && (
        <section className="mt-16 px-6">
          <h2 className="text-center text-2xl font-semibold">
            Strategy Guides
          </h2>

          <p className="text-center text-gray-400 mt-2 text-sm">
            In-depth PDFs covering advanced tactics and techniques
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/40 transition"
              >
                {/* Thumbnail */}
                {pdf.thumbnail_url && (
                  <img
                    src={pdf.thumbnail_url}
                    alt={pdf.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-medium text-lg">{pdf.title}</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {pdf.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
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
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
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

      {/* SHEETS SECTION */}

      {activeTab === "sheets" && (
        <section className="mt-16 px-6">
          <h2 className="text-center text-2xl font-semibold">Team Resources</h2>

          <p className="text-center text-gray-400 mt-2 text-sm">
            Professional tracking and analysis tools for teams
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/40 transition"
              >
                {/* Thumbnail */}
                {sheet.thumbnail_url && (
                  <img
                    src={sheet.thumbnail_url}
                    alt={sheet.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-medium text-lg">{sheet.title}</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {sheet.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-purple-400 font-semibold">
                      ₹{sheet.price}
                    </span>

                    <button
                      onClick={() =>
                        addItem({
                          id: sheet.id,
                          title: sheet.title,
                          map: "Sheet",
                          price: sheet.price,
                        })
                      }
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sheets.length === 0 && (
            <p className="text-center text-gray-500 mt-12">
              No sheets available yet.
            </p>
          )}
        </section>
      )}

      {/* INFO MAPS SECTION */}

      <Footer />
    </main>
  );
};

export default Products;
