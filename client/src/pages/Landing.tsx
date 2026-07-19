import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ChevronRight } from "lucide-react";
import { fetchPlatformStats, fetchIITs } from "../services/api";
import { IITCard } from "../components/IITCard";

export function Landing() {
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<{
    iits: number;
    professors: number;
    departments: number;
    researchAreas: number;
  } | null>(null);
  const [iits, setIits] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlatformStats().then(setStats);
    fetchIITs().then(setIits);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(query.trim() ? `/discover?q=${encodeURIComponent(query.trim())}` : "/discover");
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="grid-bg-fade absolute inset-0 opacity-40" />
        <div className="scanline absolute inset-0" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="max-w-3xl">
            <div className="animate-in inline-flex items-center gap-2 border border-neon/30 bg-neon-dim px-3 py-1 font-mono text-xs font-medium text-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-neon pulse" />
              RESEARCHBRIDGE v1.0
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-ink">Find the people</span>
              <br />
              <span className="text-neon glow-neon">behind the research.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
              {stats?.professors?.toLocaleString() || "1,500+"} professors.{" "}
              {stats?.iits || 16} IITs.{" "}
              {stats?.researchAreas?.toLocaleString() || "3,500+"} research areas.
              <br />
              <span className="text-stone">Filter. Connect. Track applications.</span>
            </p>
          </div>

          {/* Search */}
          <form onSubmit={submitSearch} className="mt-10 max-w-xl animate-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 border border-hairline-strong bg-paper-dim px-4 py-3 transition-all focus-within:border-neon focus-within:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <Search size={16} className="shrink-0 text-stone" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="$ search professors, iits, areas..."
                className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-stone-light focus:outline-none"
              />
              <button
                type="submit"
                className="btn btn-neon hidden shrink-0 items-center gap-1.5 px-4 py-2 sm:flex"
              >
                EXEC <ArrowRight size={12} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-stone">
              <span className="text-stone-light">$</span>
              {["Machine Learning", "IIT Bombay", "Computer Vision", "Quantum Computing"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => navigate(`/discover?q=${encodeURIComponent(t)}`)}
                  className="text-neon/60 transition-colors hover:text-neon"
                >
                  {t}
                </button>
              ))}
            </div>
          </form>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4 stagger">
            {[
              { label: "PROFESSORS", value: stats?.professors, color: "text-neon" },
              { label: "RESEARCH_AREAS", value: stats?.researchAreas, color: "text-lime" },
              { label: "DEPARTMENTS", value: stats?.departments, color: "text-amber" },
              { label: "IITS", value: stats?.iits, color: "text-rose" },
            ].map(({ label, value, color }) => (
              <div key={label} className="animate-in bg-paper p-5">
                <span className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  {label}
                </span>
                <p className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
                  {value?.toLocaleString() ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IITs */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="section-label">// INSTITUTES</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                IITs in the Index
              </h2>
            </div>
            <Link
              to="/iits"
              className="group hidden items-center gap-1 font-mono text-xs text-neon sm:flex"
            >
              VIEW ALL
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
            {iits.map((iit, i) => (
              <div key={iit.id} className="animate-in">
                <IITCard iit={iit} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger">
          {[
            {
              to: "/discover",
              num: "01",
              title: "Discover Professors",
              desc: `Browse ${stats?.professors?.toLocaleString() || "1,500+"} faculty across all IITs.`,
              cta: "BROWSE →",
              color: "border-neon/30 hover:border-neon",
            },
            {
              to: "/research-areas",
              num: "02",
              title: "Research Areas",
              desc: `Explore ${stats?.researchAreas?.toLocaleString() || "3,500+"} domains.`,
              cta: "EXPLORE →",
              color: "border-lime/30 hover:border-lime",
            },
            {
              to: "/opportunities",
              num: "03",
              title: "Opportunities",
              desc: "PhD positions, assistantships, internships.",
              cta: "VIEW →",
              color: "border-amber/30 hover:border-amber",
            },
          ].map(({ to, num, title, desc, cta, color }) => (
            <Link
              key={to}
              to={to}
              className={`group card block p-6 ${color}`}
            >
              <span className="linenum">{num}</span>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm text-stone">{desc}</p>
              <span className="mt-4 inline-block font-mono text-xs font-medium text-neon transition-colors group-hover:glow-neon">
                {cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
          <div className="border border-hairline bg-paper-dim p-10 text-center sm:p-14">
            <span className="section-label">// GET STARTED</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Track your research applications.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-stone">
              Create an account. Save professors. Track your application status.
            </p>
            <Link
              to="/register"
              className="btn btn-neon mt-8 inline-flex items-center gap-2 px-8 py-3"
            >
              CREATE ACCOUNT →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
