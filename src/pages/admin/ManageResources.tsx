import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ManageResources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [newFile, setNewFile] = useState<File | null>(null);
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

    if (res.file_url) {
      await supabase.storage.from("resources").remove([res.file_url]);
    }

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

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Resources</h2>

      {resources.length === 0 ? (
        <p className="text-gray-500">No resources found.</p>
      ) : (
        <div className="space-y-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex justify-between items-center bg-black/60 border border-white/10 rounded-lg p-4"
            >
              <div>
                <p className="font-medium">{res.title}</p>
                <p className="text-xs text-gray-400">
                  {res.type} • ₹{res.price} •{" "}
                  {new Date(res.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                {(() => {
                  const isPurchased = res.purchases?.[0]?.count > 0;

                  return (
                    <button
                      disabled={isPurchased}
                      onClick={() => {
                        setEditing(res);
                        setEditTitle(res.title);
                        setEditDescription(res.description);
                        setEditPrice(res.price);
                        setNewFile(null);
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
                  );
                })()}

                {(() => {
                  const isPurchased = res.purchases?.[0]?.count > 0;

                  return (
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
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Resource</h3>

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
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              className="w-full mb-4 bg-black/60 border border-white/10 rounded px-3 py-2"
              placeholder="Price"
            />

            {/* Replace File */}
            <div className="mb-3">
              <label className="text-sm text-gray-400">
                Replace Resource File (optional)
              </label>
              <input
                type="file"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="text-sm mt-1"
              />
            </div>

            {/* Replace Thumbnail */}
            <div className="mb-4">
              <label className="text-sm text-gray-400">
                Replace Thumbnail (optional)
              </label>
              <input
                type="file"
                onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
                className="text-sm mt-1"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  let updatedFileUrl = editing.file_url;
                  let updatedThumbnailUrl = editing.thumbnail_url;

                  // 1️⃣ Upload new file (if provided)
                  if (newFile) {
                    const filePath = `${editing.created_by}/${Date.now()}-${
                      newFile.name
                    }`;

                    const { error } = await supabase.storage
                      .from("resources")
                      .upload(filePath, newFile);

                    if (!error) {
                      // delete old file
                      if (editing.file_url) {
                        await supabase.storage
                          .from("resources")
                          .remove([editing.file_url]);
                      }

                      updatedFileUrl = filePath;
                    }
                  }

                  // 2️⃣ Upload new thumbnail (if provided)
                  if (newThumbnail) {
                    const thumbPath = `${Date.now()}-${newThumbnail.name}`;

                    const { error } = await supabase.storage
                      .from("thumbnails")
                      .upload(thumbPath, newThumbnail);

                    if (!error) {
                      if (editing.thumbnail_url) {
                        const oldPath = editing.thumbnail_url.split("/").pop();
                        if (oldPath) {
                          await supabase.storage
                            .from("thumbnails")
                            .remove([oldPath]);
                        }
                      }

                      const { data } = supabase.storage
                        .from("thumbnails")
                        .getPublicUrl(thumbPath);

                      updatedThumbnailUrl = data.publicUrl;
                    }
                  }

                  // 3️⃣ Update DB
                  await supabase
                    .from("resources")
                    .update({
                      title: editTitle,
                      description: editDescription,
                      price: editPrice,
                      file_url: updatedFileUrl,
                      thumbnail_url: updatedThumbnailUrl,
                    })
                    .eq("id", editing.id);

                  setEditing(null);
                  setNewFile(null);
                  setNewThumbnail(null);
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
