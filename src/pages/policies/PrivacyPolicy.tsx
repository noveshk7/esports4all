import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PrivacyPolicy = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <section className="pt-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <p className="mt-4 text-gray-400 text-sm">
          Coach Selzer respects your privacy and is committed to protecting your
          personal information.
        </p>

        <div className="mt-6 space-y-4 text-sm text-gray-300">
          <p>
            We collect personal details such as email address and payment
            information only for providing access to our digital esports
            resources.
          </p>

          <p>
            Payments are securely processed via Razorpay. We do not store your
            card or banking details.
          </p>

          <p>
            Your data will never be sold or shared with third parties, except
            when required by law.
          </p>

          <p>
            By using our website, you consent to this privacy policy.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
