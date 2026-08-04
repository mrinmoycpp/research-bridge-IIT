import { Link } from "react-router-dom";
import type { Professor } from "../../types";
import { AreaTag } from "../shared/AreaTag";
import { SaveButton } from "../shared/SaveButton";
import { formatNumber, catalogNumber } from "../../lib/utils";
import { useSaved } from "../../hooks/useSaved";

export function ProfessorRow({
  professor,
  index,
}: {
  professor: Professor;
  index: number;
}) {
  const { isProfessorSaved, toggleProfessor } = useSaved();

  return (
    <Link
      to={`/professors/${professor.slug}`}
      className="group flex items-start gap-5 border-b border-hairline py-6 transition-colors hover:bg-card-hover sm:gap-6 sm:px-4"
    >
      <span className="hidden self-center linenum sm:block">
        {catalogNumber(index, "PRF")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="text-xl font-bold tracking-tight text-ink group-hover:text-neon sm:text-2xl">
            {professor.name}
          </h3>
          <span className="badge bg-neon-dim text-neon">
            {professor.position}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-stone">
          {professor.department} · {professor.iitId.replace("iit-", "IIT ").replace(/^./, (c) => c.toUpperCase())}
        </p>
        <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-stone sm:line-clamp-2 sm:block">
          {professor.bio}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {professor.researchAreas.slice(0, 3).map((a) => (
            <AreaTag key={a} areaId={a} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-stone">
          <span>{formatNumber(professor.publicationCount)} pubs</span>
          <span>{formatNumber(professor.citationCount)} cite</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SaveButton
          saved={isProfessorSaved(professor.id)}
          onClick={() => toggleProfessor(professor.id)}
        />
        <span className="font-mono text-xs text-stone-light transition-colors group-hover:text-neon">
          →
        </span>
      </div>
    </Link>
  );
}
