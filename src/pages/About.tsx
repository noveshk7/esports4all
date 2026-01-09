import Header from "../components/Header";
import Footer from "../components/Footer";
import coachImg from "../assets/e4a.jpeg"; // replace with your image

const About = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-24 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          About Coach Selzer
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400">
          Professional Free Fire esports coach specializing in team strategy and competitive excellence
        </p>
      </section>

      {/* JOURNEY */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="flex justify-center">
          <img
            src={coachImg}
            alt="Coach Selzer"
            className="w-80 h-80 object-cover rounded-2xl border border-white/10 shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">The Journey</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            With over 5 years of competitive Free Fire experience, I’ve dedicated my career
            to understanding the intricate strategies that separate good teams from great ones.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            My journey began as a competitive player, but I quickly realized my true passion
            lay in analyzing gameplay, developing strategies, and helping others reach their
            full potential.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Today, I specialize in rotation strategies, team coordination, and competitive analysis.
            My training methods have helped numerous teams achieve tournament success and
            individual players elevate their game to professional levels.
          </p>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="max-w-5xl mx-auto px-6 mt-28">
        <h2 className="text-center text-2xl font-semibold mb-10">Achievements</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "5+ Years Coaching Experience",
            "100+ Players Trained",
            "Specialized in Rotations & Strategy",
            "Multiple Team Championships",
          ].map((item) => (
            <div
              key={item}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
            >
              <p className="text-sm text-gray-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COACHING SERVICES */}
      <section className="max-w-4xl mx-auto px-6 mt-28">
        <h2 className="text-center text-2xl font-semibold mb-2">
          Coaching Services
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          Personalized coaching tailored to your goals
        </p>

        <div className="space-y-4">
          <Service
            title="1-on-1 Player Coaching"
            desc="Personalized sessions focused on your gameplay"
            price="₹499 / hr"
          />
          <Service
            title="Team Coaching Package"
            desc="Complete team strategy and coordination training"
            price="₹1,999 / 3 sessions"
          />
          <Service
            title="Strategy Review"
            desc="Analyze gameplay recordings and provide feedback"
            price="₹299 / review"
          />
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-lg">
            Get in Touch
          </button>
        </div>
      </section>

      {/* SPECIALIZATION */}
      <section className="max-w-5xl mx-auto px-6 mt-28 mb-32">
        <h2 className="text-center text-2xl font-semibold mb-10">
          Specialization
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <SpecCard
            title="Rotations"
            desc="Master optimal rotation paths and timing"
          />
          <SpecCard
            title="Team Coordination"
            desc="Build synergy and communication for team execution"
          />
          <SpecCard
            title="Strategy"
            desc="Develop winning strategies for scrims and tournaments"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;

/* ---------- Small Components ---------- */

const Service = ({
  title,
  desc,
  price,
}: {
  title: string;
  desc: string;
  price: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex justify-between items-center">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
    <p className="text-purple-400 font-semibold">{price}</p>
  </div>
);

const SpecCard = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
    <p className="font-medium mb-2">{title}</p>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);
