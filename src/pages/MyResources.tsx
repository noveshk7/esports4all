import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyResources = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user) {
    navigate("/auth", { replace: true });
    return;
  }

  const fetchMyResources = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("purchases")
      .select(`
        id,
        resource:resources (
          id,
          title,
          price,
          type,
          thumbnail_url,
          file_url,
          map_name
        )
      `)
      .eq("user_id", user.id);

    if (!error && data) {
      const mapped = data
        .filter((p: any) => p.resource)
        .map((p: any) => ({
          ...p.resource,
          purchased: true,
        }));

      setResources(mapped);
    }

    setLoading(false);
  };

  fetchMyResources();
}, [user, navigate]);


 const getFileExtension = (path: string) => {
  const cleanPath = path.split("?")[0];
  return cleanPath.substring(cleanPath.lastIndexOf(".") + 1);
};

const downloadResource = async (filePath: string, title: string) => {
  const ext = getFileExtension(filePath);

  const { data, error } = await supabase.storage
    .from("resources")
    .createSignedUrl(filePath, 300, {
      download: `${title}.${ext}`, // ✅ title is USED here
    });

  if (error || !data?.signedUrl) {
    alert("Download failed");
    return;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
};


  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      <section className="pt-28 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400">My Resources</h1>
        <p className="text-gray-400 mt-2">
          Access all your purchased resources
        </p>
      </section>

      <section className="mt-10 px-6 max-w-7xl mx-auto">
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
                <div className="h-44 bg-black/40 flex items-center justify-center">
                  {res.thumbnail_url ? (
                    <img
                      src={res.thumbnail_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/40 text-xl">📘</span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium">{res.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Paid ₹{res.price}
                  </p>

                  <button
                    onClick={() =>
                      downloadResource(res.file_url, res.title)
                    }
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm"
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
