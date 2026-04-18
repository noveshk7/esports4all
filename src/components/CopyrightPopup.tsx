import { useEffect, useState } from "react";

const CopyrightPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("visited_before");
    const sessionShown = sessionStorage.getItem("popup_shown");

    // ❌ If already shown in this session → don't show again (refresh case)
    if (sessionShown) return;

    // ✅ FIRST VISIT → instant popup
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem("visited_before", "true");
      sessionStorage.setItem("popup_shown", "true");
    } 
    // 🔁 RETURN VISIT → delayed popup
    else {
      setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("popup_shown", "true");
      }, 2000); // ⏱ 2 sec delay
    }
  }, []);

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

        <button
          onClick={() => setOpen(false)}
          className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default CopyrightPopup;