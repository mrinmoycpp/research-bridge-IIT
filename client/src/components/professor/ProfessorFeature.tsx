import { Link } from "react-router-dom";
import type { Professor } from "../../types";
import { getIITById } from "../../data/iits";
import { AreaTag } from "../shared/AreaTag";

export function ProfessorFeature({ professor }: { professor: Professor }) {
  const iit = getIITById(professor.iitId);
  return (
    <Link
      to={`/professors/${professor.slug}`}
      className="group block border border-hairline bg-card p-7 sm:p-10"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
        Featured Researcher
      </span>
      <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        {professor.name}
      </h3>
      <p className="mt-2 text-sm text-stone">
        {professor.position} &middot; {professor.department} &middot; {iit?.code}
      </p>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
        {professor.bio}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {professor.researchAreas.map((a) => (
          <AreaTag key={a} areaId={a} />
        ))}
      </div>
    </Link>
  );
}
