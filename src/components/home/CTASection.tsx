const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-purple-400/10 border border-purple-500/30 text-center p-12">
        <h2 className="text-3xl font-bold text-purple-400">
          Ready to Dominate?
        </h2>
        <p className="text-gray-300 mt-4">
          Join hundreds of players and teams who’ve elevated their game with
          Coach Selzer’s proven strategies.
        </p>

        <button className="mt-8 px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition">
          Get Started Now →
        </button>
      </div>
    </section>
  );
};

export default CTASection;
