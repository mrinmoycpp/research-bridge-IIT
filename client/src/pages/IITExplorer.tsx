import { useEffect, useState } from "react";
import type { IIT } from "../types";
import { fetchIITs } from "../services/api";
import { IITCard } from "../components/IITCard";
import { LoadingGrid } from "../components/shared/States";

export function IITExplorer() {
  const [list, setList] = useState<IIT[] | null>(null);

  useEffect(() => {
    fetchIITs().then(setList);
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      <div className="border-b border-hairline pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          Seven Institutes
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          The IIT System
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          Each institute carries its own research identity, shaped by
          geography, history, and decades of specialisation. Explore campuses,
          departments, and the researchers who define them.
        </p>
      </div>

      <div className="py-10">
        {!list ? (
          <LoadingGrid count={7} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((iit, i) => (
              <IITCard key={iit.id} iit={iit} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
