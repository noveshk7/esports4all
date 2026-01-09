import { Map, FileText, BarChart3 } from "lucide-react";

const offers = [
  {
    icon: <Map className="text-purple-400" />,
    title: "Rotation Paths",
    desc: "Strategic rotation guides for every major map. Learn optimal paths for competitive play.",
  },
  {
    icon: <FileText className="text-purple-400" />,
    title: "Strategy Guides",
    desc: "In-depth PDFs covering tactics, zone predictions, and pro-level strategies.",
  },
  {
    icon: <BarChart3 className="text-purple-400" />,
    title: "Team Trackers",
    desc: "Professional sheets to track performance, analyze results, and improve teamwork.",
  },
  {
    icon: <Map className="text-purple-400" />,
    title: "High Quality Maps",
    desc: "Get high quality freefire maps of different types like normal, coins and info maps.",
  }
];

const OfferSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
      <h2 className="text-center text-3xl font-bold text-purple-400">
        What We Offer
      </h2>
      <p className="text-center text-gray-400 mt-2">
        Professional resources designed to give your team the competitive edge
      </p>

      <div className="mt-14 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {offers.map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferSection;
