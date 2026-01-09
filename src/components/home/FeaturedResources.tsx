import ProductCard from "../home/ProductCard";

const FeaturedResources = () => {
  return (
    <section className="py-24 px-6">
      <h2 className="text-center text-3xl font-bold text-purple-400">
        Featured Resources
      </h2>

      <div className="mt-14 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ProductCard
          title="Rotation Path Bundle"
          price={599}
          image="/images/rotation-cover.jpg"
        />
        <ProductCard
          title="Rotation Path Bundle"
          price={599}
          image="/images/rotation-cover.jpg"
        />
        <ProductCard
          title="Rotation Path Bundle"
          price={599}
          image="/images/rotation-cover.jpg"
        />
      </div>
    </section>
  );
};

export default FeaturedResources;
