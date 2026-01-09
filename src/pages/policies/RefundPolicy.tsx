import Header from "../../components/Header";
import Footer from "../../components/Footer";

const RefundPolicy = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">
          Refund & Cancellation Policy
        </h1>

        <div className="mt-6 space-y-4 text-sm text-gray-300">
          <p>
            All products sold on Coach Selzer are digital esports resources
            (PDFs, sheets, maps, and coaching materials).
          </p>

          <p>
            Once a purchase is completed and access is granted, the product
            cannot be returned or refunded.
          </p>

          <p>
            Refunds will only be considered in cases of duplicate payment or
            technical issues where access was not provided.
          </p>

          <p>
            For refund-related queries, please contact us at
            <strong> support@coachselzer.com</strong> within 48 hours.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RefundPolicy;
