import { Link } from "react-router-dom";
import { getAreaById } from "../../data/researchAreas";

/**
 * A small constellation of the professor's research areas and their
 * trending sub-topics — the "index card" signature visual, standing in
 * for a flat tag list.
 */
export function ResearchFocusMap({ areaIds }: { areaIds: string[] }) {
  const areas = areaIds.map(getAreaById).filter(Boolean);
  if (areas.length === 0) return null;

  return (
    <div className="border border-hairline bg-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div key={area!.id} className="relative">
            <Link
              to={`/research-areas/${area!.slug}`}
              className="font-display text-xl text-ink hover:text-navy"
            >
              {area!.name}
            </Link>
            {area!.description && (
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {area!.description}
              </p>
            )}
            {area!.trendingTopics.length > 0 && (
              <div className="mt-5">
                <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  AREAS OF INTEREST
                </p>
                <div className="relative mt-3 pl-4">
                  <span className="absolute left-0 top-0 h-full w-px bg-hairline-strong" />
                  <ul className="space-y-3">
                    {area!.trendingTopics.slice(0, 4).map((topic, i) => (
                      <li key={topic} className="relative flex items-center gap-2.5 pl-2">
                        <span
                          className="absolute -left-[17px] h-px bg-hairline-strong"
                          style={{ width: 12 }}
                        />
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass"
                          style={{ opacity: 1 - i * 0.16 }}
                        />
                        <span className="text-sm text-ink-soft">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {area!.relatedAreas && area!.relatedAreas.length > 0 && (
              <div className="mt-5">
                <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  RELATED
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {area!.relatedAreas.map((relId) => {
                    const rel = getAreaById(relId);
                    if (!rel) return null;
                    return (
                      <Link
                        key={relId}
                        to={`/research-areas/${rel.slug}`}
                        className="border border-hairline-strong px-2 py-0.5 font-mono text-[10px] text-stone hover:border-navy hover:text-navy"
                      >
                        {rel.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
