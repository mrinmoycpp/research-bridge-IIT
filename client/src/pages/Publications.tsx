import { useEffect, useState } from "react";
import type { Publication } from "../types";
import { fetchAllPublications } from "../services/api";
import { PublicationItem } from "../components/professor/PublicationItem";
import { LoadingRows } from "../components/shared/States";
import { researchAreas } from "../data/researchAreas";

export function Publications() {
  const [pubs, setPubs] = useState<Publication[] | null>(null);
  const [area, setArea] = useState<string | undefined>();

  useEffect(() => {
    fetchAllPublications().then((all) =>
      setPubs([...all].sort((a, b) => b.year - a.year || b.citationCount - a.citationCount))
    );
  }, []);

  const filtered = pubs?.filter((p) => !area || p.areaId === area);

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12 lg:px-10">
      <div className="border-b border-hairline pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          The Full Record
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Publications</h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          A running index of research output across the IIT system, ordered
          by recency.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setArea(undefined)}
            className={`border px-3 py-1.5 text-xs ${
              !area ? "border-navy bg-navy text-paper" : "border-hairline-strong text-ink-soft"
            }`}
          >
            All areas
          </button>
          {researchAreas.map((a) => (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              className={`border px-3 py-1.5 text-xs ${
                area === a.id
                  ? "border-navy bg-navy text-paper"
                  : "border-hairline-strong text-ink-soft"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="py-10">
        {!filtered ? (
          <LoadingRows count={6} />
        ) : (
          <div>
            {filtered.slice(0, 40).map((p) => (
              <PublicationItem key={p.id} publication={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
