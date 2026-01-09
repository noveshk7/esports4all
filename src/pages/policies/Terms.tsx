import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Terms = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>

        <div className="mt-6 space-y-4 text-sm text-gray-300">
          <p>
            By accessing or purchasing from Coach Selzer, you agree to be bound
            by these terms and conditions.
          </p>

          <p>
            All resources provided are for personal use only and must not be
            shared, resold, or redistributed.
          </p>

          <p>
            Unauthorized distribution of our digital content may result in
            account termination without refund.
          </p>

          <p>
            We reserve the right to modify or discontinue any service without
            prior notice.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Terms;
