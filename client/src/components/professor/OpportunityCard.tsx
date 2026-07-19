import type { Opportunity } from "../../types";
import { availabilityDot, cn } from "../../lib/utils";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="border border-hairline bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            {opportunity.type}
          </span>
          <h4 className="mt-1 font-display text-lg text-ink">{opportunity.title}</h4>
        </div>
        <span
          className={cn(
            "mt-1 h-2 w-2 shrink-0 rounded-full",
            availabilityDot[opportunity.status]
          )}
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone">{opportunity.description}</p>
      <p className="mt-3 font-mono text-xs text-stone-light">
        Deadline: {opportunity.deadline}
      </p>
    </div>
  );
}
