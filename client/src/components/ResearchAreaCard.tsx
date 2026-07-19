import { Link } from "react-router-dom";
import type { ResearchArea } from "../types";
import { formatNumber } from "../lib/utils";

export function ResearchAreaCard({ area }: { area: ResearchArea }) {
  return (
    <Link
      to={`/research-areas/${area.slug}`}
      className="group card block p-5"
    >
      <h3 className="text-lg font-bold tracking-tight text-ink group-hover:text-neon">
        {area.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone line-clamp-2">
        {area.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {area.trendingTopics.slice(0, 3).map((t) => (
          <span key={t} className="tag px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
        <div className="flex gap-4 font-mono text-xs text-stone">
          <span>{formatNumber(area.professorCount)} res</span>
          <span>{formatNumber(area.publicationCount)} pubs</span>
        </div>
        <span className="font-mono text-xs text-stone-light transition-colors group-hover:text-neon">
          →
        </span>
      </div>
    </Link>
  );
}
