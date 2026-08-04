import { Link } from "react-router-dom";
import { useState } from "react";
import { X, ChevronDown, Mail, ExternalLink, Search } from "lucide-react";
import { useSaved } from "../hooks/useSaved";
import { useAuth } from "../hooks/useAuth";
import { useApplications } from "../hooks/useApplications";
import { formatNumber } from "../lib/utils";
import type { ApplicationStatus } from "../types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { value: "interested", label: "Interested", color: "text-stone", bg: "bg-stone/10" },
  { value: "applied", label: "Applied", color: "text-neon", bg: "bg-neon-dim" },
  { value: "interview", label: "Interview", color: "text-amber", bg: "bg-amber-dim" },
  { value: "accepted", label: "Accepted", color: "text-lime", bg: "bg-lime-dim" },
  { value: "rejected", label: "Rejected", color: "text-rose", bg: "bg-rose-dim" },
  { value: "withdrawn", label: "Withdrawn", color: "text-stone-light", bg: "bg-hairline" },
];

export function Saved() {
  const { user } = useAuth();
  const { saved } = useSaved();
  const { applications, loading: appsLoading, update, remove } = useApplications();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-md text-center">
          <span className="section-label">// AUTH REQUIRED</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Sign in to track applications
          </h1>
          <p className="mt-4 text-sm text-stone">
            Create an account to save professors, track your application status,
            and keep notes across sessions.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login" className="btn btn-neon px-6 py-2.5">
              SIGN IN →
            </Link>
            <Link to="/register" className="btn btn-ghost px-6 py-2.5">
              CREATE ACCOUNT
            </Link>
          </div>
        </div>

        {saved.professors.length > 0 && (
          <section className="mt-16 border-t border-hairline pt-12">
            <span className="section-label">// LOCAL DATA</span>
            <h2 className="mt-2 text-2xl font-bold">
              Local shortlist ({saved.professors.length})
            </h2>
            <p className="mt-2 text-sm text-stone">
              Saved on this device. Sign in to sync across sessions.
            </p>
            <Link
              to="/discover"
              className="btn btn-ghost mt-6 inline-flex items-center gap-2 px-4 py-2"
            >
              BROWSE MORE →
            </Link>
          </section>
        )}
      </div>
    );
  }

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch = searchQuery === "" ||
      app.professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.professor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.professor.institute.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = STATUS_OPTIONS.map((s) => ({
    ...s,
    count: applications.filter((a) => a.status === s.value).length,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
      {/* Header */}
      <div className="border-b border-hairline pb-8">
        <span className="section-label">// APPLICATION TRACKER</span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          My Applications
        </h1>
        <p className="mt-3 max-w-xl text-sm text-stone">
          Track your research applications across IITs. Update status, add notes,
          and manage your pipeline.
        </p>
      </div>

      {/* Status Summary Bar */}
      <section className="border-b border-hairline py-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-all ${
              filterStatus === "all"
                ? "border-neon bg-neon-dim text-neon"
                : "border-hairline text-stone hover:border-neon hover:text-neon"
            }`}
          >
            ALL
            <span className="text-[10px] text-stone-light">{applications.length}</span>
          </button>
          {statusCounts.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-all ${
                filterStatus === s.value
                  ? `border-current ${s.color} ${s.bg}`
                  : "border-hairline text-stone hover:border-current hover:" + s.color
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.color.replace("text-", "bg-")}`} />
              {s.label.toUpperCase()}
              <span className="text-[10px] text-stone-light">{s.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-hairline py-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 border border-hairline bg-paper-dim px-3 py-2 transition-all focus-within:border-neon">
            <Search size={14} className="shrink-0 text-stone" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="$ search applications..."
              className="w-full bg-transparent font-mono text-xs text-ink placeholder:text-stone-light focus:outline-none"
            />
          </div>
          <span className="font-mono text-xs text-stone">
            {filteredApps.length} of {applications.length}
          </span>
        </div>
      </section>

      {/* Applications List */}
      <section className="py-8">
        {appsLoading ? (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-stone pulse">LOADING...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="border border-dashed border-hairline py-20 text-center">
            <span className="section-label">// EMPTY</span>
            <h2 className="mt-4 text-2xl font-bold">No applications tracked yet</h2>
            <p className="mt-3 max-w-sm mx-auto text-sm text-stone">
              Find a professor you're interested in and click "Track Application" on their profile.
            </p>
            <Link
              to="/discover"
              className="btn btn-neon mt-8 inline-flex items-center gap-2 px-6 py-2.5"
            >
              DISCOVER PROFESSORS →
            </Link>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="border border-dashed border-hairline py-20 text-center">
            <span className="section-label">// NO MATCHES</span>
            <p className="mt-4 text-sm text-stone">
              No applications match your current filters.
            </p>
            <button
              onClick={() => { setFilterStatus("all"); setSearchQuery(""); }}
              className="btn btn-ghost mt-4 px-4 py-2"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => {
              const currentStatus = STATUS_OPTIONS.find((s) => s.value === app.status) || STATUS_OPTIONS[0];
              return (
                <div
                  key={app.id}
                  className="group border border-hairline bg-card p-5 transition-all hover:border-neon/30"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left: Professor Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <span className={`badge ${currentStatus.bg} ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                        <div>
                          <Link
                            to={`/professors/${app.professor.slug}`}
                            className="text-lg font-bold tracking-tight text-ink hover:text-neon"
                          >
                            {app.professor.name}
                          </Link>
                          <p className="mt-0.5 font-mono text-xs text-stone">
                            {app.professor.department}
                          </p>
                          <p className="font-mono text-[11px] text-stone-light">
                            {app.professor.institute}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5 ml-9">
                        {app.professor.researchAreas.slice(0, 3).map((a) => (
                          <span key={a} className="tag px-2 py-0.5">
                            {a.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="mt-3 flex items-center gap-4 font-mono text-xs text-stone ml-9">
                        <span>{formatNumber(app.professor.publicationCount)} pubs</span>
                        {app.professor.email && (
                          <a
                            href={`mailto:${app.professor.email}`}
                            className="flex items-center gap-1 text-neon hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={11} /> EMAIL
                          </a>
                        )}
                        <Link
                          to={`/professors/${app.professor.slug}`}
                          className="flex items-center gap-1 text-stone-light hover:text-neon"
                        >
                          <ExternalLink size={11} /> VIEW
                        </Link>
                      </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex flex-col gap-3 lg:min-w-[220px]">
                      {/* Status Selector */}
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => update(app.id, e.target.value as ApplicationStatus)}
                          className="input w-full appearance-none px-3 py-2 pr-8 text-xs"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone"
                        />
                      </div>

                      {/* Notes */}
                      {editingId === app.id ? (
                        <div className="w-full">
                          <textarea
                            autoFocus
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="$ add note..."
                            className="input w-full p-3 text-xs"
                            rows={3}
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                update(app.id, undefined, editNotes);
                                setEditingId(null);
                              }}
                              className="btn btn-neon px-3 py-1 text-[10px]"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn btn-ghost px-3 py-1 text-[10px]"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(app.id);
                            setEditNotes(app.notes || "");
                          }}
                          className="w-full border border-hairline bg-paper-dim px-3 py-2 text-left text-xs text-stone transition-all hover:border-neon hover:text-neon"
                        >
                          {app.notes ? (
                            <span className="line-clamp-1">"{app.notes}"</span>
                          ) : (
                            <span>+ ADD NOTE</span>
                          )}
                        </button>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => remove(app.professor.id)}
                        className="flex items-center justify-center gap-1 border border-hairline px-3 py-1.5 text-[10px] font-medium text-stone transition-all hover:border-rose hover:text-rose"
                      >
                        <X size={11} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Local Saved */}
      {saved.professors.length > 0 && (
        <section className="border-t border-hairline py-12">
          <span className="section-label">// LOCAL SHORTLIST</span>
          <h2 className="mt-2 text-2xl font-bold">
            Bookmarked ({saved.professors.length})
          </h2>
          <p className="mt-2 text-sm text-stone">
            Saved on this device via bookmarks.
          </p>
          <Link
            to="/discover"
            className="btn btn-ghost mt-4 inline-flex items-center gap-2 px-4 py-2"
          >
            BROWSE MORE →
          </Link>
        </section>
      )}
    </div>
  );
}
