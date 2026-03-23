import { ArrowRight, ShoppingBag, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="min-h-screen pt-24 flex items-center justify-center text-center px-6 relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]" />

        <div className="relative z-10 max-w-4xl">
          <span className="inline-block mb-6 px-4 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            ✦ Professional Esports Coaching
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Master Free Fire Esports <br />
            <span className="text-purple-400">with ESPORTS4ALL</span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Rotation paths, strategies, and coaching built for champions.
            Elevate your game to professional level.
          </p>
        </div>
      </section>

      {/* 🔥 FEATURE CARDS SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
          
          {/* EXPLORE PRODUCTS */}
          <div
            onClick={() => {
          window.scrollTo(0, 0);
          navigate("/products");
        }}
            className="glow-border cursor-pointer group bg-white/5 rounded-2xl p-6 transform hover:scale-105 transition hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <div className="flex items-center justify-between">
              <ShoppingBag className="text-purple-400" size={28} />
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </div>

            <h3 className="text-xl font-semibold mt-6">
              Explore Products
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Rotation paths, PDFs, Maps and Pro-level resources.
            </p>
          </div>

          {/* HIRE COACH */}
          <div
          onClick={() => {
          window.scrollTo(0, 0);
          navigate("/about#discord");
        }}
            className="cursor-pointer group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition transform hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
          >
            <div className="flex items-center justify-between">
              <Users className="text-purple-400" size={28} />
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </div>

            <h3 className="text-xl font-semibold mt-6">
              Hire a Coach
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Train with professionals and improve your team performance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;