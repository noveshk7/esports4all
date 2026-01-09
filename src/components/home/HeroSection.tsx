import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    
  return (
    
<section className="min-h-screen pt-24 flex items-center justify-center text-center px-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),transparent_60%)]" />

      <div className="relative z-10 max-w-4xl">
        <span className="inline-block mb-6 px-4 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          ✦ Professional Esports Coaching
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Master Free Fire Esports <br />
          <span className="text-purple-400">with Coach Selzer</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Rotation paths, strategies, and coaching built for champions.
          Elevate your game to professional level.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition flex items-center gap-2">
            Explore Products <ArrowRight size={18} />
          </button>

          <button className="px-6 py-3 rounded-lg border border-gray-700 hover:border-purple-500 transition">
            Hire Me for Coaching
          </button>
        </div>
      </div>
    </section>
    
  );
};

export default HeroSection;
