import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-paper-dim">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-mono text-lg font-bold tracking-tight text-ink">
              RB<span className="text-neon">_</span>
            </span>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-stone">
              Discover researchers, connect with professors, and collaborate
              across India's IITs.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              EXPLORE
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link to="/discover" className="transition-colors hover:text-neon">Discover</Link></li>
              <li><Link to="/iits" className="transition-colors hover:text-neon">IITs</Link></li>
              <li><Link to="/research-areas" className="transition-colors hover:text-neon">Research Areas</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              PLATFORM
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link to="/saved" className="transition-colors hover:text-neon">Workspace</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
              LEGAL
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><span className="cursor-default">Disclaimer</span></li>
              <li><span className="cursor-default">Data Sources</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border border-hairline bg-paper p-5">
          <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
            DISCLAIMER
          </p>
          <p className="mt-2 text-xs leading-relaxed text-stone">
            This is a student project built for educational and informational purposes only.
            The data presented here is compiled from publicly available sources including
            institute websites, Google Scholar, and NIRF rankings. This project is not
            affiliated with, endorsed by, or connected to any Indian Institute of Technology
            (IIT) or the Government of India. Professor information may not be fully accurate
            or up-to-date. For official information, please visit the respective institute's
            website. Contact details listed are sourced from publicly available faculty pages
            and may change. This platform does not collect, store, or share any personal data
            beyond what users voluntarily provide during registration.
          </p>
        </div>

        {/* Data Sources */}
        <div className="mt-4 border border-hairline bg-paper p-5">
          <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
            DATA SOURCES
          </p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-stone">
            <li>• Institute websites and official faculty pages</li>
            <li>• Google Scholar profiles and citation data</li>
            <li>• NIRF (National Institutional Ranking Framework) rankings</li>
            <li>• Publicly available research publication databases</li>
            <li>• Official IIT department pages and brochures</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">
            © {new Date().getFullYear()} ResearchBridge
          </span>
          <span className="font-mono text-[10px] text-stone-light">
            built by{" "}
            <a href="https://github.com/mrinmoycpp" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">mrinmoycpp</a>
            {" · "}
            <a href="https://www.linkedin.com/in/mrinmoy-d-4ab091379/" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">LinkedIn</a>
          </span>
          <span className="font-mono text-[10px] text-stone-light">
            React · Express · Prisma · Neon · Tailwind
          </span>
        </div>
      </div>
    </footer>
  );
}
