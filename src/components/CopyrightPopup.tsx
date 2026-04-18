import { useEffect, useState } from "react";

const CopyrightPopup = () => {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("visited_before");
    const sessionShown = sessionStorage.getItem("popup_shown");
    const disabled = localStorage.getItem("popup_disabled");

    // ❌ User chose "Don't show again"
    if (disabled === "true") return;

    // ❌ Already shown in this session (refresh case)
    if (sessionShown) return;

    // ✅ First visit → instant
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem("visited_before", "true");
      sessionStorage.setItem("popup_shown", "true");
    } 
    // 🔁 Returning visit → delayed
    else {
      setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("popup_shown", "true");
      }, 2000);
    }
  }, []);

  const handleClose = () => {
    // ✅ Save preference if checked
    if (dontShow) {
      localStorage.setItem("popup_disabled", "true");
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 w-[90%] max-w-md text-center shadow-xl">

        <h2 className="text-xl font-semibold text-purple-400 mb-3">
          ⚠️ Copyright Notice
        </h2>

        <p className="text-sm text-gray-300 leading-relaxed">
          All content on this website including rotation paths, strategies,
          PDFs, and maps are the intellectual property of{" "}
          <span className="text-white font-medium">Esports4All</span>.
          <br /><br />
          Unauthorized sharing, reselling, or distribution is strictly prohibited.
        </p>

        {/* ✅ Checkbox */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="accent-purple-500"
          />
          <label>Don't show again</label>
        </div>

        <button
          onClick={handleClose}
          className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default CopyrightPopup;