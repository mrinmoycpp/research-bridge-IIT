import { useState } from "react";
import { X, AlertTriangle, ExternalLink } from "lucide-react";

const DISCLAIMER_KEY = "researchbridge:disclaimer-seen";

const AVAILABLE_IITS = [
  "IIT Bhilai", "IIT BHU", "IIT Bombay", "IIT Bhubaneswar", "IIT Delhi",
  "IIT Dharwad", "IIT Gandhinagar", "IIT Goa", "IIT Guwahati", "IIT Indore",
  "IIT Jammu", "IIT Jodhpur", "IIT Kharagpur", "IIT Palakkad", "IIT ROPAR",
  "IIT Tirupati",
];

const COMING_SOON = ["IIT Madras", "IIT Kanpur", "IIT Roorkee"];

export function DisclaimerPopup() {
  const [open, setOpen] = useState(() => {
    try {
      return !localStorage.getItem(DISCLAIMER_KEY);
    } catch {
      return true;
    }
  });

  if (!open) return null;

  function accept() {
    try {
      localStorage.setItem(DISCLAIMER_KEY, "1");
    } catch {}
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) accept(); }}
    >
      <div className="relative w-full max-w-lg border border-neon/30 bg-card p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
        <button
          onClick={accept}
          className="absolute right-3 top-3 text-stone hover:text-neon"
        >
          <X size={16} />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-neon" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neon">
            Disclaimer &amp; Terms
          </span>
        </div>

        <h2 className="font-display text-xl text-ink">
          ResearchBridge — IIT Professor Database
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
          <section>
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-stone">
              // Data Source
            </h3>
            <p>
              Faculty data is publicly scraped from official IIT department websites
              and research group pages. Information may be outdated or incomplete.
              Always verify with the institute directly.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-stone">
              // Available IITs (16)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_IITS.map((iit) => (
                <span
                  key={iit}
                  className="border border-neon/20 px-2 py-0.5 font-mono text-[10px] text-neon/80"
                >
                  {iit}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-stone">
              // Coming Soon
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {COMING_SOON.map((iit) => (
                <span
                  key={iit}
                  className="border border-amber/30 px-2 py-0.5 font-mono text-[10px] text-amber/80"
                >
                  {iit}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-stone">
              // Terms of Use
            </h3>
            <p>
              This tool is for academic and research purposes only. Do not use the
              listed contact information for unsolicited outreach. By proceeding,
              you agree to use this data responsibly.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-wide text-stone">
              // Built By
            </h3>
            <p className="flex items-center gap-2">
              <span className="text-neon">mrinmoycpp</span>
              <a
                href="https://github.com/mrinmoycpp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-neon"
              >
                GitHub <ExternalLink size={12} className="inline" />
              </a>
              <a
                href="https://www.linkedin.com/in/mrinmoy-d-4ab091379/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-neon"
              >
                LinkedIn <ExternalLink size={12} className="inline" />
              </a>
            </p>
          </section>
        </div>

        <button
          onClick={accept}
          className="btn-neon mt-6 w-full py-2.5 text-center text-sm"
        >
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}
