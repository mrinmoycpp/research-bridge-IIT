import { Link } from "react-router-dom";
import type { IIT } from "../types";
import { formatNumber } from "../lib/utils";

export function IITCard({ iit, index }: { iit: IIT; index: number }) {
  return (
    <Link
      to={`/iits/${iit.id}`}
      className="group card block p-5"
    >
      <div className="flex items-start justify-between">
        <span className="linenum">{String(index + 1).padStart(2, "0")}</span>

      </div>

      <h3 className="mt-3 text-lg font-bold tracking-tight text-ink group-hover:text-neon">
        {iit.code}
      </h3>
      <p className="mt-1 font-mono text-xs text-stone">
        {iit.city}, {iit.state} · Est. {iit.established}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-stone line-clamp-2">
        {iit.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <div className="flex gap-4 font-mono text-xs text-stone">
          <span>{iit.departments} depts</span>
          <span>{formatNumber(iit.professorCount)} fac</span>
        </div>
        <span className="font-mono text-xs text-stone-light transition-colors group-hover:text-neon">
          →
        </span>
      </div>
    </Link>
  );
}
