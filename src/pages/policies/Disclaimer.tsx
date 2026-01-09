import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Disclaimer = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Disclaimer</h1>

        <div className="mt-6 space-y-4 text-sm text-gray-300">
          <p>
            Coach Selzer provides esports coaching and digital resources for
            educational and informational purposes only.
          </p>

          <p>
            We do not guarantee competitive success, rankings, or earnings by
            using our resources.
          </p>

          <p>
            Results depend on individual effort, skill, and practice.
          </p>

          <p>
            By using this website, you agree that Coach Selzer is not liable for
            any direct or indirect losses.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Disclaimer;
