import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ManageResources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const [search, setSearch] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState(0);
  const [editCosmoUrl, setEditCosmoUrl] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);

  const fetchResources = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("resources")
      .select("*, purchases(count)")
      .order("created_at", { ascending: false });

    setResources(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const deleteResource = async (res: any) => {
    const isPurchased = res.purchases?.[0]?.count > 0;

    if (isPurchased) {
      alert("This resource has been purchased and cannot be deleted.");
      return;
    }

    const ok = window.confirm("Delete this resource?");
    if (!ok) return;

    if (res.thumbnail_url) {
      const path = res.thumbnail_url.split("/").pop();
      if (path) {
        await supabase.storage.from("thumbnails").remove([path]);
      }
    }

    await supabase.from("resources").delete().eq("id", res.id);
    fetchResources();
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  /* ================= SEARCH FILTER ================= */

  const filteredResources = resources.filter((r) => {
    const text = search.toLowerCase();

    return (
      r.title?.toLowerCase().includes(text) ||
      r.type?.toLowerCase().includes(text) ||
      r.map_name?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Resources</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by title, map, or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm"
      />

      {filteredResources.length === 0 ? (
        <p className="text-gray-500">No resources found.</p>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((res) => {
            const isPurchased = res.purchases?.[0]?.count > 0;

            return (
              <div
                key={res.id}
                className="flex justify-between items-center bg-black/60 border border-white/10 rounded-lg p-4"
              >
                <div>
<p className="font-medium flex items-center gap-2">
  {res.title}

  {res.featured && (
    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
      BEST SELLER
    </span>
  )}
</p>
                  <p className="text-xs text-gray-400">
                    {res.type}
                    {res.map_name && ` • ${res.map_name}`} •{" "}
                    {res.original_price > res.price ? (
                      <>
                        <span className="line-through mr-1">
                          ₹{res.original_price}
                        </span>
                        <span className="text-purple-400">
                          ₹{res.price}
                        </span>
                      </>
                    ) : (
                      <>₹{res.price}</>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={isPurchased}
                    onClick={() => {
                      setEditing(res);
                      setEditTitle(res.title);
                      setEditDescription(res.description);
                      setEditPrice(res.price);
                      setEditOriginalPrice(
                        res.original_price || res.price
                      );
                      setEditCosmoUrl(res.cosmofeed_url || "");
                      setEditFeatured(res.featured || false);
                      setNewThumbnail(null);
                    }}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      isPurchased
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {isPurchased ? "Locked" : "Edit"}
                  </button>

                  <button
                    disabled={isPurchased}
                    onClick={() => deleteResource(res)}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      isPurchased
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isPurchased ? "Purchased" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit Resource
            </h3>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-3 bg-black/60 border border-white/10 rounded px-3 py-2"
              placeholder="Title"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full mb-3 bg-black/60 border border-white/10 rounded px-3 py-2 h-20"
              placeholder="Description"
            />

            <input
              value={editCosmoUrl}
              onChange={(e) => setEditCosmoUrl(e.target.value)}
              className="w-full mb-3 bg-black/60 border border-white/10 rounded px-3 py-2"
              placeholder="CosmoFeed Product Link"
            />

            <div className="flex items-center gap-3 mt-2">
  <input
    type="checkbox"
    checked={editFeatured}
    onChange={(e) => setEditFeatured(e.target.checked)}
    className="w-4 h-4"
  />

  <label className="text-sm text-gray-300">
    Mark as Best Seller
  </label>
</div>

            <input
              type="number"
              value={editOriginalPrice}
              onChange={(e) =>
                setEditOriginalPrice(Number(e.target.value))
              }
              className="w-full mb-3 bg-black/60 border border-white/10 rounded px-3 py-2"
              placeholder="Original Price"
            />

            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              className="w-full mb-4 bg-black/60 border border-white/10 rounded px-3 py-2"
              placeholder="Selling Price"
            />

            <input
              type="file"
              onChange={(e) =>
                setNewThumbnail(e.target.files?.[0] || null)
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  let thumbnailUrl = editing.thumbnail_url;

                  if (newThumbnail) {
                    const path = `${Date.now()}-${newThumbnail.name}`;

                    const { error } = await supabase.storage
                      .from("thumbnails")
                      .upload(path, newThumbnail);

                    if (!error) {
                      const { data } = supabase.storage
                        .from("thumbnails")
                        .getPublicUrl(path);

                      thumbnailUrl = data.publicUrl;
                    }
                  }

                  await supabase
  .from("resources")
  .update({
    title: editTitle,
    description: editDescription,
    price: editPrice,
    original_price: editOriginalPrice,
    cosmofeed_url: editCosmoUrl,
    thumbnail_url: thumbnailUrl,
    featured: editFeatured,
  })
  .eq("id", editing.id);

                  setEditing(null);
                  fetchResources();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageResources;