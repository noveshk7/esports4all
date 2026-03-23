import { useEffect, useState } from "react";
import { uploadResource } from "../../lib/uploadResource";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import ManageResources from "./ManageResources";
import { supabase } from "../../lib/supabase";

type Tab = "upload" | "manage" | "promos";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("upload");

  /* ================= RESOURCE STATES ================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(199);
  const [price, setPrice] = useState(99);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [cosmoUrl, setCosmoUrl] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [mapName, setMapName] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= PROMO STATES ================= */
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoExpiry, setPromoExpiry] = useState("");
  const [promos, setPromos] = useState<any[]>([]);
  const [promoMsg, setPromoMsg] = useState("");

  /* ================= CREATE RESOURCE ================= */
  const handleUpload = async () => {
    if (!user) {
      setMessage("Login required");
      return;
    }

    if (!cosmoUrl) {
      setMessage("CosmoFeed product link is required");
      return;
    }

    if (originalPrice < price) {
      setMessage("Original price must be greater than selling price");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await uploadResource({
        title,
        description,
        type: resourceType,
        price,
        originalPrice,
        thumbnail,
        cosmofeed_url: cosmoUrl,
        userId: user.id,
        mapName: resourceType === "rotation-place" ? mapName : null,
      });

      setMessage("✅ Product created successfully");

      setTitle("");
      setDescription("");
      setOriginalPrice(199);
      setPrice(99);
      setThumbnail(null);
      setCosmoUrl("");
      setMapName("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PROMO CRUD ================= */
  const fetchPromos = async () => {
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    setPromos(data || []);
  };

  const createPromo = async () => {
    if (!promoCode || !promoDiscount) {
      setPromoMsg("Fill all fields");
      return;
    }

    const { error } = await supabase.from("promo_codes").insert({
      code: promoCode.toUpperCase(),
      discount_percent: promoDiscount,
      max_uses: 100,
      max_uses_per_user: 1,
      expires_at: promoExpiry || null,
      active: true,
    });

    if (error) {
      setPromoMsg(error.message);
      return;
    }

    setPromoMsg("✅ Promo created");
    setPromoCode("");
    setPromoDiscount(10);
    setPromoExpiry("");
    fetchPromos();
  };

  const togglePromo = async (id: string, active: boolean) => {
    await supabase.from("promo_codes").update({ active: !active }).eq("id", id);
    fetchPromos();
  };

  useEffect(() => {
    if (activeTab === "promos") fetchPromos();
  }, [activeTab]);

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      <div className="pt-28 px-4 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">CosmoFeed powered products</p>

        {/* TABS */}
        <div className="mb-10 flex bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { key: "upload", label: "Create Product" },
            { key: "manage", label: "Manage Resources" },
            { key: "promos", label: "Promo Codes" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-6 py-2 rounded-lg ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CREATE PRODUCT */}
        {activeTab === "upload" && (
          <div className="w-full max-w-2xl bg-white/5 p-6 rounded-xl space-y-4">
            {message && <p className="text-purple-400 text-sm">{message}</p>}

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/60 px-4 py-3 rounded-lg"
            />

            <select
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value);
                setMapName("");
              }}
              className="w-full bg-black/60 px-4 py-3 rounded-lg"
            >
              <option value="">Select type</option>
              <option value="pdf">PDF</option>
              <option value="sheet">Sheet</option>
              <option value="info-map">Info Map</option>
              <option value="hq-map">HQ Map</option>
              <option value="rotation-place">Rotation Place</option>
            </select>

            {resourceType === "rotation-place" && (
              <select
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full bg-black/60 px-4 py-3 rounded-lg"
              >
                <option value="">Select Map</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Alpine">Alpine</option>
                <option value="NeXTerra">NeXTerra</option>
                <option value="Solara">Solara</option>
              </select>
            )}

            <input
              placeholder="CosmoFeed Product Link"
              value={cosmoUrl}
              onChange={(e) => setCosmoUrl(e.target.value)}
              className="w-full bg-black/60 px-4 py-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Original Price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full bg-black/60 px-4 py-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Selling Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-black/60 px-4 py-3 rounded-lg"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/60 px-4 py-3 rounded-lg h-28"
            />

            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-purple-600 py-3 rounded-lg"
            >
              {loading ? "Saving..." : "Create Product"}
            </button>
          </div>
        )}

        {activeTab === "manage" && <ManageResources />}

        {activeTab === "promos" && (
          <div className="w-full max-w-3xl bg-white/5 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Promo Codes</h2>

            {promoMsg && (
              <p className="text-sm text-purple-400 mb-3">{promoMsg}</p>
            )}

            <div className="grid gap-3">
              <input
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-black/60 px-4 py-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={promoDiscount}
                onChange={(e) => setPromoDiscount(Number(e.target.value))}
                className="bg-black/60 px-4 py-3 rounded-lg"
              />

              <input
                type="date"
                value={promoExpiry}
                onChange={(e) => setPromoExpiry(e.target.value)}
                className="bg-black/60 px-4 py-3 rounded-lg"
              />

              <button
                onClick={createPromo}
                className="bg-purple-600 py-2 rounded-lg"
              >
                Create Promo
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {promos.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-black/40 px-4 py-2 rounded-lg"
                >
                  <span>{p.code}</span>
                  <button
                    onClick={() => togglePromo(p.id, p.active)}
                    className={p.active ? "text-green-400" : "text-red-400"}
                  >
                    {p.active ? "Active" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
