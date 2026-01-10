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

  /* ================= RESOURCE UPLOAD STATES ================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(99);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [mapName, setMapName] = useState("");

  /* ================= PROMO STATES ================= */
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoExpiry, setPromoExpiry] = useState("");
  const [promos, setPromos] = useState<any[]>([]);
  const [promoMsg, setPromoMsg] = useState("");

  /* ================= RESOURCE UPLOAD ================= */
  const handleUpload = async () => {
    if (!file || !user) {
      setMessage("File is required");
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
        file,
        thumbnail,
        userId: user.id,
        mapName: resourceType === "rotation-map" ? mapName : null,
      });

      setMessage("✅ Resource uploaded successfully");

      setTitle("");
      setDescription("");
      setPrice(99);
      setFile(null);
      setThumbnail(null);
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
  expires_at: promoExpiry || null,
  active: true, // ✅ FIXED
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
  await supabase
    .from("promo_codes")
    .update({ active: !active }) // ✅ FIXED
    .eq("id", id);

  fetchPromos();
};


  useEffect(() => {
    if (activeTab === "promos") {
      fetchPromos();
    }
  }, [activeTab]);

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      <div className="pt-28 px-4 sm:px-6 flex flex-col items-center">
        {/* TITLE */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage resources & promo codes
          </p>
        </div>

        {/* TABS */}
        <div className="mb-10 flex bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { key: "upload", label: "Upload Resource" },
            { key: "manage", label: "Manage Resources" },
            { key: "promos", label: "Promo Codes" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-6 py-2 text-sm rounded-lg transition ${
                activeTab === tab.key
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= UPLOAD ================= */}
        {activeTab === "upload" && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            {message && (
              <div className="mb-4 text-sm text-purple-400 text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              />

              <select
                value={resourceType}
                onChange={(e) => {
                  setResourceType(e.target.value);
                  setMapName("");
                }}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              >
                <option value="">Select type</option>
                <option value="rotation-map">Rotation Map</option>
                <option value="pdf">PDF</option>
                <option value="sheet">Sheet</option>
              </select>

              {resourceType === "rotation-map" && (
                <select
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
                >
                  <option value="">Select map</option>
                  <option>Bermuda</option>
                  <option>Purgatory</option>
                  <option>Kalahari</option>
                  <option>Alpine</option>
                  <option>NeXTerra</option>
                </select>
              )}

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 h-28"
              />

              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />

              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </div>
        )}

        {/* ================= MANAGE ================= */}
        {activeTab === "manage" && (
          <div className="w-full max-w-6xl">
            <ManageResources />
          </div>
        )}

        {/* ================= PROMOS ================= */}
        {activeTab === "promos" && (
          <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Create Promo Code</h2>

            {promoMsg && (
              <p className="text-sm text-purple-400 mb-3">{promoMsg}</p>
            )}

            <div className="grid gap-3">
              <input
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={promoDiscount}
                onChange={(e) => setPromoDiscount(Number(e.target.value))}
                className="bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              />

              <input
                type="date"
                value={promoExpiry}
                onChange={(e) => setPromoExpiry(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-4 py-3"
              />

              <button
                onClick={createPromo}
                className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
              >
                Create Promo
              </button>
            </div>

            <h3 className="mt-8 mb-3 font-medium">Existing Promos</h3>

            <div className="space-y-3">
              {promos.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-black/40 border border-white/10 rounded-lg px-4 py-2"
                >
                  <div>
                    <p className="font-medium">{p.code}</p>
                    <p className="text-xs text-gray-400">
                      {p.discount_percent}% off
                    </p>
                  </div>

                  <button
                    onClick={() => togglePromo(p.id, p.is_active)}
                    className={`text-sm ${
                      p.active ? "text-green-400" : "text-red-400"
                    }`}
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
