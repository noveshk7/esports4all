import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Download } from "lucide-react";

const MyResources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyResources = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("purchases")
        .select(
          `
          id,
          resources (
            id,
            title,
            price,
            type,
            thumbnail_url,
            file_url,
            map_name
          )
        `
        )
        .eq("user_id", user.id);

      if (!error && data) {
        const mapped = data.map((p: any) => ({
          ...p.resources,
          purchased: true,
        }));
        setResources(mapped);
      }

      setLoading(false);
    };

    fetchMyResources();
  }, [user]);

  const downloadResource = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("resources")
      .createSignedUrl(filePath, 60);

    if (error) {
      alert("Download failed");
      return;
    }

    window.open(data.signedUrl, "_blank");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      {/* HERO */}
      <section className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          My Resources
        </h1>
        <p className="mt-3 text-gray-400">
          Access all your purchased coaching materials and resources
        </p>
      </section>

      {/* CONTENT */}
      <section className="mt-12 px-6 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : resources.length === 0 ? (
          <p className="text-gray-500">No resources purchased yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
                  {res.thumbnail_url ? (
                    <img
                      src={res.thumbnail_url}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/40 text-xl">📘</span>
                  )}

                  <span className="absolute top-3 right-3 bg-green-600 text-xs px-3 py-1 rounded-full">
                    Purchased
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="text-xs text-gray-400 uppercase">
                    {res.type === "rotation-map" ? "Map" : res.type}
                  </span>

                  <h3 className="mt-1 font-medium text-sm">
                    {res.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Paid: ₹{res.price}
                  </p>

                  <button
                    onClick={() => downloadResource(res.file_url)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default MyResources;
