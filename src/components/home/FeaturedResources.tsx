import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ProductCard from "../home/ProductCard";

const FeaturedResources = () => {
  const [featuredResources, setFeaturedResources] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("featured", true)
        .order("featured_order", { ascending: true }) // 🔥 MAIN CHANGE
        .limit(6);

      setFeaturedResources(data || []);
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 px-6">
      <h2 className="text-center text-3xl font-bold text-purple-400">
        Featured Resources
      </h2>

      <div className="mt-14 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuredResources.map((item) => (
          <ProductCard
            key={item.id}
            title={item.title}
            image={item.thumbnail_url}
            type={item.type}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedResources;