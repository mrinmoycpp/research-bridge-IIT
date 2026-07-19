import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, Rows3, SlidersHorizontal, Search, X } from "lucide-react";
import type { DiscoverFilters, Professor, SortOption } from "../types";
import { fetchProfessors } from "../services/api";
import { FilterPanel } from "../components/FilterPanel";
import { ProfessorRow } from "../components/professor/ProfessorRow";
import { ProfessorGridCard } from "../components/professor/ProfessorGridCard";
import { LoadingRows } from "../components/shared/States";
import { EmptyState } from "../components/shared/States";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Most relevant" },
  { value: "citations", label: "Citations" },
  { value: "publications", label: "Publications" },
  { value: "recent", label: "Recently joined" },
  { value: "name-asc", label: "Name (A–Z)" },
];

export function Discover() {
  const [params, setParams] = useSearchParams();
  const [results, setResults] = useState<Professor[] | null>(null);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [view, setView] = useState<"list" | "grid">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: DiscoverFilters = useMemo(
    () => ({
      query: params.get("q") ?? undefined,
      iit: params.get("iit") ?? undefined,
      department: params.get("department") ?? undefined,
      researchArea: params.get("area") ?? undefined,
      availability: (params.get("availability") as DiscoverFilters["availability"]) ?? undefined,
      position: (params.get("position") as DiscoverFilters["position"]) ?? undefined,
    }),
    [params]
  );

  useEffect(() => {
    setResults(null);
    fetchProfessors(filters, sort).then(setResults);
  }, [filters, sort]);

  function updateFilters(next: DiscoverFilters) {
    const p = new URLSearchParams();
    if (next.query) p.set("q", next.query);
    if (next.iit) p.set("iit", next.iit);
    if (next.department) p.set("department", next.department);
    if (next.researchArea) p.set("area", next.researchArea);
    if (next.availability) p.set("availability", next.availability);
    if (next.position) p.set("position", next.position);
    setParams(p);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="border-b border-hairline pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          The Full Index
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Discover Researchers</h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          Browse the complete archive of professors and researchers across
          every IIT — filter by institute, department, research area, or
          availability.
        </p>

        <div className="mt-6 flex items-center gap-3 border border-hairline-strong bg-card px-4 py-3">
          <Search size={16} className="shrink-0 text-stone" />
          <input
            value={filters.query ?? ""}
            onChange={(e) => updateFilters({ ...filters, query: e.target.value || undefined })}
            placeholder="Search professors, research areas, departments, publications..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-stone-light focus:outline-none"
          />
          {filters.query && (
            <button onClick={() => updateFilters({ ...filters, query: undefined })}>
              <X size={15} className="text-stone hover:text-ink" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[260px_1fr]">
        <aside className={`lg:block ${filtersOpen ? "block" : "hidden"}`}>
          <FilterPanel filters={filters} onChange={updateFilters} />
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-2 border border-hairline-strong px-3 py-2 text-xs text-ink-soft lg:hidden"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
            <p className="font-mono text-xs text-stone">
              {results ? `${results.length} researchers indexed` : "Searching the index…"}
            </p>
            <div className="flex items-center gap-4">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="border border-hairline-strong bg-card px-3 py-1.5 text-xs text-ink-soft focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
              <div className="flex border border-hairline-strong">
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`p-2 ${view === "list" ? "bg-ink text-paper" : "text-stone"}`}
                >
                  <Rows3 size={14} />
                </button>
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`p-2 ${view === "grid" ? "bg-ink text-paper" : "text-stone"}`}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>

          {!results ? (
            <LoadingRows count={6} />
          ) : results.length === 0 ? (
            <EmptyState
              title="No researchers match these filters"
              description="Try widening your search — remove a filter or search a broader research area."
              action={
                <button
                  onClick={() => updateFilters({})}
                  className="border border-ink px-4 py-2 text-xs text-ink hover:bg-ink hover:text-paper"
                >
                  Clear filters
                </button>
              }
            />
          ) : view === "list" ? (
            <div>
              {results.map((p, i) => (
                <ProfessorRow key={p.id} professor={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <ProfessorGridCard key={p.id} professor={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
