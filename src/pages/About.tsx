import Header from "../components/Header";
import Footer from "../components/Footer";
import coachImg from "../assets/e4a.jpeg";
import { MessageCircle } from "lucide-react";

const About = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          About Esports4All
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base">
          A professional Free Fire esports platform built to help players and
          teams perform smarter, faster, and more consistently.
        </p>
      </section>

      {/* ================= ESPORTS4ALL JOURNEY ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="flex justify-center">
          <img
            src={coachImg}
            alt="Esports4All"
            className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-2xl border border-white/10 shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            The Esports4All Journey
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Esports4All was created to bridge the gap between casual gameplay and
            competitive Free Fire esports. The platform focuses on providing
            structured, practical knowledge that players and teams can apply
            directly in real matches.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            What started with competitive scrims and in-game analysis evolved
            into deep research on rotations, zone behavior, and team decision-making.
            These insights were transformed into clear, easy-to-use esports
            resources.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Today, Esports4All delivers rotation maps, strategy PDFs, and team
            planning tools designed to improve consistency, adaptability, and
            long-term competitive growth.
          </p>
        </div>
      </section>

      {/* ================= DISCORD COMMUNITY ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-24">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-8 text-center">
          <MessageCircle className="mx-auto mb-4 text-purple-400" size={36} />
          <h2 className="text-2xl font-semibold mb-2">
            Join the Esports4All Discord
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Be part of the Esports4All community. Get strategy discussions,
            updates, announcements, and interact with competitive players and
            teams.
          </p>

          <a
            href="https://discord.gg/yourserver"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-lg font-medium"
          >
            Join Discord Server
          </a>
        </div>
      </section>

      {/* ================= COACH SELZER HERO ================= */}
      <section className="pt-32 pb-24 text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          About Coach Selzer
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base">
          Founder of Esports4All and a professional Free Fire esports coach
          specializing in team strategy and competitive excellence.
        </p>
      </section>

      {/* ================= COACH JOURNEY ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="flex justify-center">
          <img
            src={coachImg}
            alt="Coach Selzer"
            className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-2xl border border-white/10 shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Coaching Philosophy
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            With over 3 years of competitive Free Fire experience, Coach Selzer
            focuses on decision-making, rotations, and structured team play rather
            than mechanical skill alone.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The coaching approach emphasizes clarity, discipline, and adaptability,
            helping teams understand why decisions matter — not just what to do.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            This philosophy has helped multiple teams improve consistency, perform
            better in tournaments, and develop long-term competitive confidence.
          </p>
        </div>
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-28">
        <h2 className="text-center text-2xl font-semibold mb-10">
          Achievements
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "3+ Years Coaching Experience",
            "100+ Players & Teams Trained",
            "Specialist in Rotations & Strategy",
            "Multiple Competitive Success Stories",
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

      {/* ================= COACHING SERVICES ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-28">
        <h2 className="text-center text-2xl font-semibold mb-2">
          Coaching Services
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          Personalized coaching designed around competitive goals
        </p>

        <div className="space-y-4">
          <Service
            title="1-on-1 Player Coaching"
            desc="Personalized sessions focused on individual improvement"
            price="₹499 / hr"
          />
          <Service
            title="Team Coaching Package"
            desc="Complete team strategy, rotations, and coordination"
            price="₹1,999 / 3 sessions"
          />
          <Service
            title="Strategy Review"
            desc="In-depth gameplay review with actionable feedback"
            price="₹299 / review"
          />
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-lg">
            Get in Touch
          </button>
        </div>
      </section>

      {/* ================= SPECIALIZATION ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-28 mb-32">
        <h2 className="text-center text-2xl font-semibold mb-10">
          Specialization
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <SpecCard
            title="Rotations"
            desc="Optimized paths, timing, and zone control"
          />
          <SpecCard
            title="Team Coordination"
            desc="Communication, roles, and synergy"
          />
          <SpecCard
            title="Strategy"
            desc="Tournament-ready planning and execution"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;

/* ---------- SMALL COMPONENTS ---------- */

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

const SpecCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
    <p className="font-medium mb-2">{title}</p>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);
