import { useState } from "react";
import { uploadResource } from "../../lib/uploadResource";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import ManageResources from "./ManageResources";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(99);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [mapName, setMapName] = useState("");

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

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      <div className="pt-28 px-4 sm:px-6 flex flex-col items-center">
        {/* PAGE TITLE */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage and publish esports resources
          </p>
        </div>

        {/* TABS */}
        <div className="mb-10 flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-2 text-sm rounded-lg transition ${
              activeTab === "upload"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upload Resource
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`px-6 py-2 text-sm rounded-lg transition ${
              activeTab === "manage"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Manage Resources
          </button>
        </div>

        {/* UPLOAD SECTION */}
        {activeTab === "upload" && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            {message && (
              <div className="mb-6 text-sm text-purple-400 text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm mb-1">Resource Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="block text-sm mb-1">Resource Type</label>
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
              </div>

              {/* MAP */}
              {resourceType === "rotation-map" && (
                <div>
                  <label className="block text-sm mb-1">Map Name</label>
                  <select
                    value={mapName}
                    onChange={(e) => setMapName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
                  >
                    <option value="">Select map</option>
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="NeXTerra">NeXTerra</option>
                  </select>
                </div>
              )}

              {/* PRICE */}
              <div>
                <label className="block text-sm mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 h-28"
                />
              </div>

              {/* FILES */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Resource File</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Thumbnail (optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setThumbnail(e.target.files?.[0] || null)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </div>
        )}

        {/* MANAGE SECTION */}
        {activeTab === "manage" && (
          <div className="w-full max-w-5xl">
            <ManageResources />
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
