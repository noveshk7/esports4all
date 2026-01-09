const Footer = () => {
  return (
    <footer className="mt-32 border-t border-white/10 bg-black/80">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10 text-sm text-gray-400">
        
        <div>
          <h3 className="font-semibold text-white">COACH SELZER</h3>
          <p className="mt-3">
            Master Free Fire esports with professional coaching and strategies.
          </p>
        </div>

        <div>
          <h4 className="text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>Products</li>
            <li>My Resources</li>
            <li>About Coach</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">Resources</h4>
          <ul className="space-y-2">
            <li>Rotation Paths</li>
            <li>Strategy Guides</li>
            <li>Team Trackers</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">Connect</h4>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-white/5" />
            <div className="w-8 h-8 rounded bg-white/5" />
            <div className="w-8 h-8 rounded bg-white/5" />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-6">
        © 2026 Coach Selzer Esports. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
