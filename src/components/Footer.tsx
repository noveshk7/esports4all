import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-32 border-t border-white/10 bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm text-gray-400">

        {/* BRAND */}
        <div>
          <h3 className="font-semibold text-white text-lg">
            ESPORTS4ALL
          </h3>
          <p className="mt-3">
            Master Free Fire esports with professional coaching, strategies,
            and competitive resources.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/my-resources" className="hover:text-white">My Resources</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h4 className="text-white mb-3">Policies</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/refund-policy" className="hover:text-white">
                Refund & Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT + SOCIAL */}
        <div>
          <h4 className="text-white mb-3">Connect</h4>

          <p className="text-sm mb-3">
            📧 support@coachselzer.com
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-white/5 hover:bg-white/10 transition"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-white/5 hover:bg-white/10 transition"
            >
              <Youtube size={18} />
            </a>

            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-white/5 hover:bg-white/10 transition"
            >
              <Twitter size={18} />
            </a>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Payments secured by Razorpay
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-xs text-gray-500 pb-6">
        © 2026 ESPORTS4ALL. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
