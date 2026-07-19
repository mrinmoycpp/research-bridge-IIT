import { ExternalLink } from "lucide-react";
import type { Publication } from "../../types";
import { formatNumber } from "../../lib/utils";

export function PublicationItem({ publication }: { publication: Publication }) {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-4 border-b border-hairline py-6 sm:grid-cols-[80px_1fr_auto]">
      <span className="font-mono text-sm text-stone-light">{publication.year}</span>
      <div className="min-w-0">
        <h4 className="font-display text-lg leading-snug text-ink">{publication.title}</h4>
        <p className="mt-1.5 text-sm text-stone">
          {publication.authors.join(", ")} &middot; <em className="not-italic text-ink-soft">{publication.venue}</em>
        </p>
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            onClick={(e) => e.preventDefault()}
            className="mt-2 inline-flex items-center gap-1 text-xs text-navy hover:underline"
          >
            {publication.doi} <ExternalLink size={11} />
          </a>
        )}
      </div>
      <div className="col-span-2 font-mono text-xs text-stone sm:col-span-1 sm:text-right">
        {formatNumber(publication.citationCount)} citations
      </div>
    </div>
  );
}
