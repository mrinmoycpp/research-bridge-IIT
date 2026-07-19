import { Link } from "react-router-dom";
import type { Professor } from "../../types";
import { SaveButton } from "../shared/SaveButton";
import { AvailabilityDot } from "../shared/AvailabilityDot";
import { formatNumber } from "../../lib/utils";
import { useSaved } from "../../hooks/useSaved";

export function ProfessorGridCard({ professor }: { professor: Professor }) {
  const { isProfessorSaved, toggleProfessor } = useSaved();
  return (
    <Link
      to={`/professors/${professor.slug}`}
      className="group card block p-5"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-ink group-hover:text-neon">
            {professor.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-stone">
            {professor.department}
          </p>
          <p className="font-mono text-[11px] text-stone-light">
            {professor.iitId.replace("iit-", "IIT ").replace(/^./, (c) => c.toUpperCase())}
          </p>
        </div>
        <SaveButton
          saved={isProfessorSaved(professor.id)}
          onClick={() => toggleProfessor(professor.id)}
        />
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-stone">
        {professor.bio}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <div className="flex items-center gap-3 font-mono text-xs text-stone">
          <span>{formatNumber(professor.publicationCount)} pubs</span>
          <span>{formatNumber(professor.citationCount)} cite</span>
          <AvailabilityDot status={professor.availability} showLabel={false} />
        </div>
        <span className="font-mono text-xs text-stone-light transition-colors group-hover:text-neon">
          →
        </span>
      </div>
    </Link>
  );
}
