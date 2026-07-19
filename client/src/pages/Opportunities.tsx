import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Opportunity } from "../types";
import { fetchAllOpportunities } from "../services/api";
import { professors } from "../data/professors";
import { getIITById } from "../data/iits";
import { availabilityDot, cn } from "../lib/utils";
import { LoadingRows } from "../components/shared/States";

export function Opportunities() {
  const [list, setList] = useState<Opportunity[] | null>(null);

  useEffect(() => {
    fetchAllOpportunities().then(setList);
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
      <div className="border-b border-hairline pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          Open Positions
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          Research Opportunities
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          Internships, RA positions, PhD openings, and project slots currently
          offered across professor labs.
        </p>
      </div>

      <div className="divide-y divide-hairline py-10">
        {!list ? (
          <LoadingRows count={5} />
        ) : (
          list.map((o) => {
            const professor = professors.find((p) => p.id === o.professorId);
            const iit = professor ? getIITById(professor.iitId) : undefined;
            return (
              <Link
                key={o.id}
                to={professor ? `/professors/${professor.slug}` : "#"}
                className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center hover:bg-paper-dim/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", availabilityDot[o.status])} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                      {o.type}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl text-ink">{o.title}</h3>
                  <p className="mt-1 text-sm text-stone">
                    {professor?.name} &middot; {professor?.department} &middot; {iit?.code}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone">
                    {o.description}
                  </p>
                </div>
                <div className="font-mono text-xs text-stone-light sm:text-right">
                  {o.deadline}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
