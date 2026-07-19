import type { AcademicPosition, AvailabilityStatus, DiscoverFilters } from "../types";
import { iits } from "../data/iits";
import { researchAreas } from "../data/researchAreas";
import { professors } from "../data/professors";
import { cn } from "../lib/utils";

const positions: AcademicPosition[] = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Institute Chair Professor",
  "Emeritus Professor",
];

const availabilities: AvailabilityStatus[] = ["open", "limited", "closed"];

const departments = Array.from(new Set(professors.map((p) => p.department))).sort();

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-hairline py-6 first:pt-0 last:border-none">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
        {title}
      </p>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 text-left text-xs transition-colors",
        active
          ? "border-navy bg-navy text-paper"
          : "border-hairline-strong text-ink-soft hover:border-navy hover:text-navy"
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: DiscoverFilters;
  onChange: (f: DiscoverFilters) => void;
}) {
  function set<K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  }

  return (
    <div className="lg:sticky lg:top-24">
      <Section title="Institute">
        <div className="flex flex-wrap gap-2">
          {iits.map((i) => (
            <Pill key={i.id} active={filters.iit === i.id} onClick={() => set("iit", i.id)}>
              {i.code}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Research Area">
        <div className="flex flex-wrap gap-2">
          {researchAreas.map((a) => (
            <Pill
              key={a.id}
              active={filters.researchArea === a.id}
              onClick={() => set("researchArea", a.id)}
            >
              {a.name}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Department">
        <div className="flex flex-wrap gap-2">
          {departments.map((d) => (
            <Pill
              key={d}
              active={filters.department === d}
              onClick={() => set("department", d)}
            >
              {d}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Academic Position">
        <div className="flex flex-wrap gap-2">
          {positions.map((p) => (
            <Pill key={p} active={filters.position === p} onClick={() => set("position", p)}>
              {p}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <div className="flex flex-wrap gap-2">
          {availabilities.map((a) => (
            <Pill
              key={a}
              active={filters.availability === a}
              onClick={() => set("availability", a)}
            >
              {a === "open" ? "Open for students" : a === "limited" ? "Limited capacity" : "Not taking students"}
            </Pill>
          ))}
        </div>
      </Section>

      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({})}
          className="mt-2 text-xs text-navy underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
