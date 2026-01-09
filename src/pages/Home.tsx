import Header from "../components/Header";
import HeroSection from "../components/home/HeroSection";
import OfferSection from "../components/home/OfferSection";
import FeaturedResources from "../components/home/FeaturedResources";
import CTASection from "../components/home/CTASection";
import Footer from "../components/Footer";


const Home = () => {
  return (
    <main className="bg-black text-white">
      <Header />
      <HeroSection />
      <OfferSection />
      <FeaturedResources />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Home;
