import Header from "../components/Header";
import CategoryTabs from "../components/products/CategoryTabs";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/* SEARCH BAR */
const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="max-w-6xl mx-auto mb-6">
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
    />
  </div>
);



const Products = () => {
  const [mapSearch, setMapSearch] = useState("");
  const [pdfSearch, setPdfSearch] = useState("");
  const [sheetSearch, setSheetSearch] = useState("");

  const [pdfs, setPdfs] = useState<any[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [infoMaps, setInfoMaps] = useState<any[]>([]);
  const [hqMaps, setHqMaps] = useState<any[]>([]);
  const [rotationPlaces, setRotationPlaces] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<
    "maps" | "pdfs" | "sheets" | "info-maps" | "hq-maps"
  >("maps");

  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchByType = async (type: string, setter: any) => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false });

      setter(data || []);
    };

    fetchByType("pdf", setPdfs);
    fetchByType("sheet", setSheets);
    fetchByType("info-map", setInfoMaps);
    fetchByType("hq-map", setHqMaps);
    fetchByType("rotation-place", setRotationPlaces);
  }, []);

  const filterBySearch = (items: any[], query: string) => {
    if (!query) return items;

    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");

    return items.filter((item) =>
      item.title.toLowerCase().replace(/\s+/g, "").includes(normalizedQuery),
    );
  };

  /* GROUP ROTATION PLACES BY MAP */
  const placesByMap = rotationPlaces.reduce((acc: any, place: any) => {
    if (!place.map_name) return acc;
    acc[place.map_name] = acc[place.map_name] || [];
    acc[place.map_name].push(place);
    return acc;
  }, {});

  const order = [
  "Bermuda",
  "Purgatory",
  "Kalahari",
  "Alpine",
  "NeXTerra",
  "Solara",
];

const mapNames = Object.keys(placesByMap).sort(
  (a, b) => order.indexOf(a) - order.indexOf(b)
);

  /* SORT FUNCTION */
 const sortResources = (items: any[]) => {
  const sorted = [...items];

  if (sortOption === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortOption === "az") {
    sorted.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }

  return sorted;
};

  const mapImages: Record<string, string> = {
    bermuda: "/maps/bermuda.jpg",
    purgatory: "/maps/purgatory.jpg",
    kalahari: "/maps/kalahari.jpg",
    alpine: "/maps/alpine.jpg",
    nexterra: "/maps/nexterra.jpg",
    solara: "/maps/solara.jpg",
  };

  /* PRICE BLOCK */
  const PriceBlock = ({
    original,
    price,
  }: {
    original?: number;
    price: number;
  }) => {
    const hasDiscount = original && original > price;
    const discountPercent =
      hasDiscount && original
        ? Math.round(((original - price) / original) * 100)
        : 0;

    return (
      <div>
        {hasDiscount && (
          <p className="text-xs text-orange-400 mb-1">
            First Time Launch Offer 🎉
          </p>
        )}

        {hasDiscount && (
          <span className="inline-block mb-2 text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        )}

        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{original}
            </span>
          )}
          <span className="text-purple-400 font-semibold text-lg">
            ₹{price}
          </span>
        </div>
      </div>
    );
  };

  /* RESOURCE CARD */
  const ResourceCard = ({ item }: any) => (
    <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden transform hover:scale-105 transition duration-300 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]">
      {item.thumbnail_url && (
        <img
          src={item.thumbnail_url}
          className="h-48 w-full object-cover"
          alt={item.title}
        />
      )}

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium pr-2 line-clamp-2">{item.title}</h3>

          {item.featured && (
            <span className="text-xs bg-gradient-to-r from-yellow-400 to-blue-500 text-black px-2 py-1 rounded font-semibold shadow whitespace-nowrap">
              BEST SELLER 🔥
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-1">{item.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <PriceBlock original={item.original_price} price={item.price} />

          <a
            href={item.cosmofeed_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );

  /* SORT DROPDOWN */
  const SortBar = () => (
    <div className="max-w-6xl mx-auto mb-6 flex justify-end">
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="bg-black border border-white/10 px-3 py-2 rounded text-sm"
      >
        <option value="newest">Newest</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
        <option value="az">Name: A → Z</option>
      </select>
    </div>
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      {/* HERO */}
      <section className="pt-28 px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Premium Resources
        </h1>

        <p className="mt-3 text-gray-400">
          Professional esports resources to elevate your gameplay
        </p>

        <div className="mt-8">
          <CategoryTabs active={activeTab} onChange={setActiveTab} />
        </div>
      </section>

      {/* ROTATION PATHS */}
      {activeTab === "maps" && (
        <section className="mt-12 px-4 sm:px-6">
          {!selectedMap ? (
            <>
              <h2 className="text-center text-2xl font-semibold mb-8">
                Rotation Paths - Maps
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {mapNames.map((map) => (
                  <div
                    key={map}
                    onClick={() => setSelectedMap(map)}
                    className="cursor-pointer bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:scale-105 transition hover:border-purple-500/40"
                  >
                    <img
                      src={mapImages[map.toLowerCase()]}
                      alt={map}
                      className="h-40 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{map}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {placesByMap[map].length} places available
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="max-w-6xl mx-auto mb-6">
                <button
                  onClick={() => setSelectedMap(null)}
                  className="text-sm text-white-400 mt-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                >
                  ← Back to maps
                </button>
              </div>

              <h2 className="text-center text-2xl font-semibold mb-8">
                {selectedMap} Rotation Path - Places
              </h2>

              <SearchBar value={mapSearch} onChange={setMapSearch} />

              <SortBar />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sortResources(
                  filterBySearch(placesByMap[selectedMap], mapSearch),
                ).map((item: any) => (
                  <ResourceCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* PDFS */}
      {activeTab === "pdfs" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold mb-8">
            PDFs / Guides
          </h2>

          <SearchBar value={pdfSearch} onChange={setPdfSearch} />

          <SortBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortResources(filterBySearch(pdfs, pdfSearch)).map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* SHEETS */}
      {activeTab === "sheets" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold mb-8">
            Team Resources
          </h2>

          <SearchBar value={sheetSearch} onChange={setSheetSearch} />

          <SortBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortResources(filterBySearch(sheets, sheetSearch)).map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* INFO MAPS */}
      {activeTab === "info-maps" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold mb-8">Info Maps</h2>

          <SortBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortResources(infoMaps).map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* HQ MAPS */}
      {activeTab === "hq-maps" && (
        <section className="mt-12 px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold mb-8">HQ Maps</h2>

          <SortBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sortResources(hqMaps).map((item) => (
              <ResourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default Products;
