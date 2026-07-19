import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { MapPin, Building2, Users, FlaskConical } from "lucide-react";
import type { IIT, Professor } from "../types";
import { fetchIITById, fetchProfessors } from "../services/api";
import { ProfessorRow } from "../components/professor/ProfessorRow";
import { AreaTag } from "../components/shared/AreaTag";
import { LoadingRows } from "../components/shared/States";

export function IITDetail() {
  const { id } = useParams();
  const [iit, setIit] = useState<IIT | null | undefined>(undefined);
  const [faculty, setFaculty] = useState<Professor[]>([]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchIITById(id).then((i) => {
      if (!active) return;
      setIit(i ?? null);
      if (i) fetchProfessors({ iit: i.id }).then(setFaculty);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (iit === null) return <Navigate to="/iits" replace />;
  if (iit === undefined) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <LoadingRows count={3} />
      </div>
    );
  }

  const departmentList = Array.from(
    new Set(faculty.map((p) => p.department))
  );

  return (
    <div>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10 lg:py-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            Est. {iit.established} &middot; {iit.ranking}
          </span>
          <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{iit.code}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-stone">
            <MapPin size={14} /> {iit.city}, {iit.state}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            <section>
              <h2 className="font-display text-2xl text-ink">Overview</h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                {iit.description}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">Popular Research Areas</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {iit.popularAreas.map((a) => (
                  <AreaTag key={a} areaId={a} size="md" />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">Departments</h2>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {departmentList.map((d) => (
                  <li
                    key={d}
                    className="border-b border-hairline py-2 text-sm text-ink-soft"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-2xl text-ink">Faculty at {iit.code}</h2>
                <Link
                  to={`/discover?iit=${iit.id}`}
                  className="text-sm text-navy hover:underline"
                >
                  View all
                </Link>
              </div>
              <div>
                {faculty.slice(0, 6).map((p, i) => (
                  <ProfessorRow key={p.id} professor={p} index={i} />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6 border border-hairline bg-card p-6">
              <Stat icon={Building2} label="Departments" value={iit.departments} />
              <Stat icon={Users} label="Faculty" value={iit.professorCount} />
              <Stat
                icon={FlaskConical}
                label="Research areas"
                value={iit.popularAreas.length}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline pb-6 last:border-none last:pb-0">
      <Icon size={18} className="text-brass" />
      <div>
        <p className="text-xs text-stone">{label}</p>
        <p className="font-display text-xl text-ink">{value}</p>
      </div>
    </div>
  );
}
