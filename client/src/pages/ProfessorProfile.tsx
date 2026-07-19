import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Mail,
  Globe,
  GraduationCap,
  BadgeCheck,
  MapPin,
  BookmarkPlus,
  Target,
} from "lucide-react";
import type { Professor, Publication, Opportunity } from "../types";
import {
  fetchProfessorBySlug,
  fetchPublicationsByProfessor,
  fetchOpportunitiesByProfessor,
  fetchRelatedProfessors,
} from "../services/api";
import { getIITById } from "../data/iits";
import { AreaTag } from "../components/shared/AreaTag";
import { SaveButton } from "../components/shared/SaveButton";
import { AvailabilityDot } from "../components/shared/AvailabilityDot";
import { ResearchFocusMap } from "../components/professor/ResearchFocusMap";
import { PublicationItem } from "../components/professor/PublicationItem";
import { Timeline } from "../components/professor/Timeline";
import { OpportunityCard } from "../components/professor/OpportunityCard";
import { ProfessorRow } from "../components/professor/ProfessorRow";
import { LoadingRows } from "../components/shared/States";
import { formatNumber } from "../lib/utils";
import { useSaved } from "../hooks/useSaved";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";

export function ProfessorProfile() {
  const { slug } = useParams();
  const [professor, setProfessor] = useState<Professor | null | undefined>(undefined);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [related, setRelated] = useState<Professor[]>([]);
  const { isProfessorSaved, toggleProfessor, getNote, setNote } = useSaved();
  const { user } = useAuth();
  const { add, remove, isTracked } = useApplications();

  useEffect(() => {
    if (!slug) return;
    let active = true;
    fetchProfessorBySlug(slug).then((p) => {
      if (!active) return;
      setProfessor(p ?? null);
      if (p) {
        fetchPublicationsByProfessor(p.id).then(setPublications);
        fetchOpportunitiesByProfessor(p.id).then(setOpportunities);
        fetchRelatedProfessors(p).then(setRelated);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (professor === null) return <Navigate to="/discover" replace />;

  if (professor === undefined) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <LoadingRows count={3} />
      </div>
    );
  }

  const iit = getIITById(professor.iitId);

  return (
    <div>
      {/* -------- Hero -------- */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="grid-bg-fade absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="animate-in">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge bg-neon-dim text-neon">
                {iit?.code}
              </span>
              <AvailabilityDot status={professor.availability} />
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {professor.name}
            </h1>
            <p className="mt-2 font-mono text-sm text-ink-soft">
              {professor.position} · {professor.department}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-stone">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {professor.location}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={14} /> Joined {professor.joinedYear}
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              {professor.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {professor.researchAreas.map((a) => (
                <AreaTag key={a} areaId={a} size="md" />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${professor.email}`}
                className="flex items-center gap-2 border border-hairline-strong px-3.5 py-2 text-xs text-ink-soft hover:border-navy hover:text-navy"
              >
                <Mail size={13} /> {professor.email}
              </a>
              {professor.website && (
                <a
                  href={professor.website}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 border border-hairline-strong px-3.5 py-2 text-xs text-ink-soft hover:border-navy hover:text-navy"
                >
                  <Globe size={13} /> Website
                </a>
              )}
              {professor.googleScholar && (
                <a
                  href={professor.googleScholar}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 border border-hairline-strong px-3.5 py-2 text-xs text-ink-soft hover:border-navy hover:text-navy"
                >
                  <BadgeCheck size={13} /> Google Scholar
                </a>
              )}
              {professor.orcid && (
                <a
                  href={`https://orcid.org/${professor.orcid}`}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 border border-hairline-strong px-3.5 py-2 text-xs text-ink-soft hover:border-navy hover:text-navy"
                >
                  ORCID {professor.orcid}
                </a>
              )}
              <SaveButton
                saved={isProfessorSaved(professor.id)}
                onClick={() => toggleProfessor(professor.id)}
                label="Save profile"
              />
              {user && (
                isTracked(professor.id) ? (
                  <button
                    onClick={() => remove(professor.id)}
                    className="flex items-center gap-2 border border-neon bg-neon-dim px-4 py-2 font-mono text-xs font-medium text-neon transition-all hover:bg-neon hover:text-paper"
                  >
                    <Target size={13} /> TRACKING
                  </button>
                ) : (
                  <button
                    onClick={() => add(professor.id, "interested")}
                    className="btn btn-ghost flex items-center gap-2 px-4 py-2"
                  >
                    <BookmarkPlus size={13} /> TRACK APPLICATION
                  </button>
                )
              )}
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px bg-hairline">
              <div className="bg-paper p-4">
                <dt className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  PUBS
                </dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-neon">
                  {formatNumber(professor.publicationCount)}
                </dd>
              </div>
              <div className="bg-paper p-4">
                <dt className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  CITE
                </dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-lime">
                  {formatNumber(professor.citationCount)}
                </dd>
              </div>
              <div className="bg-paper p-4">
                <dt className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                  H-INDEX
                </dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-amber">
                  {professor.hIndex}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
          <div className="space-y-16">
            {/* Research Focus */}
            <section>
              <SectionTitle eyebrow="Areas of Work" title="Research Focus" />
              <ResearchFocusMap areaIds={professor.researchAreas} />
            </section>

            {/* Publications */}
            <section>
              <SectionTitle
                eyebrow={`${publications.length} Papers`}
                title="Selected Publications"
              />
              <div>
                {publications.slice(0, 8).map((pub) => (
                  <PublicationItem key={pub.id} publication={pub} />
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <SectionTitle eyebrow="Career" title="Research Timeline" />
              <Timeline events={professor.timeline} />
            </section>

            {/* Opportunities */}
            {opportunities.length > 0 && (
              <section>
                <SectionTitle eyebrow="Open Now" title="Research Opportunities" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {opportunities.map((o) => (
                    <OpportunityCard key={o.id} opportunity={o} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Personal note (workspace) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-hairline bg-card p-5">
              <p className="font-mono text-[10px] font-semibold tracking-widest text-stone-light">
                NOTES
              </p>
              <textarea
                defaultValue={getNote(professor.id)}
                onBlur={(e) => setNote(professor.id, e.target.value)}
                placeholder="$ add note..."
                rows={5}
                className="input mt-3 w-full resize-none p-3"
              />
              <p className="mt-2 font-mono text-[10px] text-stone-light">
                saved locally on this device
              </p>
            </div>
          </aside>
        </div>

        {/* Related professors */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-hairline pt-14">
            <SectionTitle eyebrow="Similar Work" title="Related Professors" />
            <div>
              {related.map((p, i) => (
                <ProfessorRow key={p.id} professor={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="section-label">// {eyebrow}</span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}
