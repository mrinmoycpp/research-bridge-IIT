import type { TimelineEvent } from "../../types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => a.year - b.year);
  return (
    <ol className="relative border-l border-hairline-strong pl-8">
      {sorted.map((event) => (
        <li key={event.id} className="relative pb-10 last:pb-0">
          <span className="absolute -left-[38px] top-1 flex h-4 w-4 items-center justify-center border border-navy bg-paper">
            <span className="h-1.5 w-1.5 bg-navy" />
          </span>
          <span className="font-mono text-xs text-brass">{event.year}</span>
          <h4 className="mt-1 font-display text-lg text-ink">{event.title}</h4>
          {event.description && (
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-stone">
              {event.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
