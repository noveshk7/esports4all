import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
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
        .from("user_resources")
        .select(`
          resource:resources (
            id,
            title,
            description,
            price,
            original_price,
            type,
            thumbnail_url,
            cosmofeed_url,
            map_name
          )
        `)
        .eq("user_id", user.id);

      if (!error && data) {
        const mapped = data
          .filter((r: any) => r.resource)
          .map((r: any) => r.resource);

        setResources(mapped);
      }

      setLoading(false);
    };

    fetchMyResources();
  }, [user, navigate]);

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      <section className="pt-28 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400">My Resources</h1>
        <p className="text-gray-400 mt-2">
          Access your purchased resources
        </p>
      </section>

      <section className="mt-10 px-6 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : resources.length === 0 ? (
          <p className="text-gray-500">
            You haven’t purchased any resources yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="h-44 bg-black/40">
                  {res.thumbnail_url ? (
                    <img
                      src={res.thumbnail_url}
                      alt={res.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Preview
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium">{res.title}</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Purchased
                  </p>

                  <a
                    href={res.cosmofeed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm"
                  >
                    Access Resource
                  </a>
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
