import { useEffect, useState } from "react";
import type { ResearchArea } from "../types";
import { fetchResearchAreas } from "../services/api";
import { ResearchAreaCard } from "../components/ResearchAreaCard";
import { LoadingGrid } from "../components/shared/States";

export function ResearchAreas() {
  const [areas, setAreas] = useState<ResearchArea[] | null>(null);

  useEffect(() => {
    fetchResearchAreas().then(setAreas);
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="border-b border-hairline pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          A Knowledge Universe
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          Research Areas
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          Ten domains define the frontier of research across the IITs. Each
          one is a living map of professors, laboratories, and trending
          questions.
        </p>
      </div>

      <div className="py-10">
        {!areas ? (
          <LoadingGrid count={9} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <ResearchAreaCard key={a.id} area={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
