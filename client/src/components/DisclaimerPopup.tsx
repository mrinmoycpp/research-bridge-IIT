import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "researchbridge:disclaimer-seen";

export function DisclaimerPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg border border-hairline bg-card p-6 sm:p-8">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 text-stone-light hover:text-ink"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber" />
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">
              Terms &amp; Conditions
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-stone-light">
              Please read before using this platform
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              DATA SOURCE
            </p>
            <p className="mt-1">
              Professor data is scraped from publicly available IIT faculty pages
              and Google Scholar profiles. Information may not be fully accurate
              or up-to-date.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              AVAILABLE IITs
            </p>
            <p className="mt-1">
              Currently listing <span className="text-neon font-medium">16 IITs</span>:
              Bhilai, BHU, Bhubaneswar, Bombay, Delhi, Dharwad, Gandhinagar,
              Goa, Guwahati, Indore, Jammu, Jodhpur, Kharagpur, Palakkad,
              ROPAR, Tirupati.
            </p>
            <p className="mt-1">
              <span className="text-amber font-medium">Coming Soon:</span>{" "}
              IIT Madras, IIT Kanpur, IIT Roorkee.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              DISCLAIMER
            </p>
            <p className="mt-1">
              This is a student project built for educational and informational
              purposes only. It is not affiliated with, endorsed by, or connected
              to any Indian Institute of Technology (IIT) or the Government of
              India. Contact details are sourced from publicly available faculty
              pages and may change.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              CREDITS
            </p>
            <p className="mt-1">
              Built by <span className="text-neon font-medium">mrinmoycpp</span>.
              Data collected from publicly available sources. For official
              information, please visit the respective institute's website.
            </p>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="mt-6 w-full border border-neon bg-neon-dim py-2.5 font-mono text-xs font-medium text-neon transition-all hover:bg-neon hover:text-paper"
        >
          I understand, continue
        </button>
      </div>
    </div>
  );
}
