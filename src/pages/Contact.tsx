import Header from "../components/Header";
import Footer from "../components/Footer";
import { Send, MessageCircle, Instagram, Mail } from "lucide-react";

const Contact = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400">
          Ready to elevate your game? Let’s discuss how I can help you or your
          team reach the next level
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* SEND MESSAGE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                placeholder="Your name"
                className="mt-1 w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                placeholder="your@email.com"
                className="mt-1 w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Message</label>
              <textarea
                placeholder="Tell me about your coaching needs..."
                className="mt-1 w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 h-28 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition py-3 rounded-lg flex items-center justify-center gap-2">
              <Send size={16} />
              Send Message
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* DIRECT CONTACT */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Direct Contact</h2>

            <div className="space-y-3">
              <ContactItem
                icon={<MessageCircle className="text-green-500" />}
                title="WhatsApp"
                value="+91 98765 43210"
              />
              <ContactItem
                icon={<Instagram className="text-pink-500" />}
                title="Instagram"
                value="@coachselzer"
              />
              <ContactItem
                icon={<Mail className="text-blue-500" />}
                title="Email"
                value="coach@selzer.com"
              />
            </div>
          </div>

          {/* RESPONSE TIME */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Response Time</h2>

            <p className="text-sm text-gray-400 mb-4">
              I typically respond within 24 hours. For urgent coaching
              inquiries, WhatsApp is the fastest way to reach me.
            </p>

            <div className="space-y-2 text-sm">
              <ResponseRow label="WhatsApp" value="Fastest" highlight />
              <ResponseRow label="Email" value="24–48 hours" />
              <ResponseRow label="Instagram DM" value="24–48 hours" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;

/* ---------- Small Components ---------- */

const ContactItem = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-lg p-4">
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-400">{value}</p>
    </div>
  </div>
);

const ResponseRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-400">{label}</span>
    <span
      className={highlight ? "text-purple-400 font-medium" : "text-gray-300"}
    >
      {value}
    </span>
  </div>
);
