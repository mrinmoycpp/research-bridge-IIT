import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap, Building2, FlaskConical, FileText, Clock, TrendingUp } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { fetchSearchSuggestions, popularSearches } from "../../services/api";
import type { SearchSuggestion } from "../../types";
import { professors } from "../../data/professors";
import { researchAreas } from "../../data/researchAreas";

const RECENT_KEY = "research-platform:recent-searches";

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}
function pushRecent(term: string) {
  const current = readRecent().filter((t) => t !== term);
  const next = [term, ...current].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

const iconFor: Record<SearchSuggestion["type"], typeof GraduationCap> = {
  professor: GraduationCap,
  iit: Building2,
  department: Building2,
  area: FlaskConical,
  publication: FileText,
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const debounced = useDebounce(query, 180);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSuggestions([]);
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!debounced.trim()) {
      setSuggestions([]);
      return;
    }
    let active = true;
    fetchSearchSuggestions(debounced).then((res) => {
      if (active) setSuggestions(res);
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  if (!open) return null;

  function go(suggestion: SearchSuggestion) {
    pushRecent(suggestion.label);
    if (suggestion.type === "professor") {
      const p = professors.find((p) => p.id === suggestion.id);
      if (p) navigate(`/professors/${p.slug}`);
    } else if (suggestion.type === "iit") {
      navigate(`/iits/${suggestion.id}`);
    } else if (suggestion.type === "area") {
      const a = researchAreas.find((a) => a.id === suggestion.id);
      if (a) navigate(`/research-areas/${a.slug}`);
    } else if (suggestion.type === "publication") {
      navigate(`/publications`);
    }
    onClose();
  }

  function goTerm(term: string) {
    pushRecent(term);
    navigate(`/discover?q=${encodeURIComponent(term)}`);
    onClose();
  }

  const recent = readRecent();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="reveal w-full max-w-xl border border-hairline-strong bg-card shadow-[0_20px_60px_-15px_rgba(26,24,21,0.35)]">
        <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
          <Search size={18} className="text-stone" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) goTerm(query.trim());
            }}
            placeholder="Search professors, research areas, departments, publications..."
            className="w-full bg-transparent font-display text-lg text-ink placeholder:text-stone-light focus:outline-none"
          />
          <kbd className="hidden font-mono text-[10px] text-stone-light sm:block">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          {query.trim() === "" ? (
            <div className="space-y-5 px-3 py-3">
              {recent.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                    <Clock size={11} /> Recent
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((term) => (
                      <button
                        key={term}
                        onClick={() => goTerm(term)}
                        className="border border-hairline px-3 py-1.5 text-xs text-ink-soft hover:border-navy hover:text-navy"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                  <TrendingUp size={11} /> Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => goTerm(term)}
                      className="border border-hairline px-3 py-1.5 text-xs text-ink-soft hover:border-navy hover:text-navy"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-stone">
              No matches yet — press Enter to search the full index for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {suggestions.map((s) => {
                const Icon = iconFor[s.type];
                return (
                  <li key={`${s.type}-${s.id}`}>
                    <button
                      onClick={() => go(s)}
                      className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-paper-dim"
                    >
                      <Icon size={16} className="shrink-0 text-stone" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{s.label}</span>
                        {s.sublabel && (
                          <span className="block truncate text-xs text-stone">{s.sublabel}</span>
                        )}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wide text-stone-light">
                        {s.type}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
