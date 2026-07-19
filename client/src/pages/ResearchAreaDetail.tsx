import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import type { ResearchArea, Professor, Publication, IIT } from "../types";
import {
  fetchResearchAreaBySlug,
  fetchProfessors,
  fetchPublicationsByProfessor,
  fetchIITs,
} from "../services/api";
import { ProfessorRow } from "../components/professor/ProfessorRow";
import { PublicationItem } from "../components/professor/PublicationItem";
import { LoadingRows } from "../components/shared/States";
import { formatNumber } from "../lib/utils";

export function ResearchAreaDetail() {
  const { slug } = useParams();
  const [area, setArea] = useState<ResearchArea | null | undefined>(undefined);
  const [profs, setProfs] = useState<Professor[]>([]);
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [iits, setIits] = useState<IIT[]>([]);

  useEffect(() => {
    fetchIITs().then(setIits);
  }, []);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    fetchResearchAreaBySlug(slug).then((a) => {
      if (!active) return;
      setArea(a ?? null);
      if (a) {
        fetchProfessors({ researchArea: a.id }).then((list) => {
          setProfs(list);
          Promise.all(list.slice(0, 6).map((p) => fetchPublicationsByProfessor(p.id))).then(
            (results) => setPubs(results.flat().sort((x, y) => y.year - x.year).slice(0, 6))
          );
        });
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (area === null) return <Navigate to="/research-areas" replace />;
  if (area === undefined) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <LoadingRows count={3} />
      </div>
    );
  }

  const relatedIITs = iits.filter((i) => i.popularAreas.includes(area.id));

  return (
    <div>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10 lg:py-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            {formatNumber(area.professorCount)} researchers &middot; {formatNumber(area.publicationCount)} publications
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-4xl text-ink sm:text-5xl">
            {area.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {area.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-display text-2xl text-ink">Researchers in this area</h2>
              </div>
              <div>
                {profs.slice(0, 8).map((p, i) => (
                  <ProfessorRow key={p.id} professor={p} index={i} />
                ))}
              </div>
            </section>

            {pubs.length > 0 && (
              <section>
                <h2 className="mb-6 font-display text-2xl text-ink">Recent Publications</h2>
                <div>
                  {pubs.map((p) => (
                    <PublicationItem key={p.id} publication={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-hairline bg-card p-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                Trending Topics
              </p>
              <ul className="space-y-2.5">
                {area.trendingTopics.map((t) => (
                  <li key={t} className="text-sm text-ink-soft">{t}</li>
                ))}
              </ul>
            </div>
            {relatedIITs.length > 0 && (
              <div className="border border-hairline bg-card p-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                  Leading Institutes
                </p>
                <ul className="space-y-2.5">
                  {relatedIITs.map((i) => (
                    <li key={i.id} className="text-sm text-ink-soft">{i.code} &middot; {i.city}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
