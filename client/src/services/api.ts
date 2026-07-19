/**
 * Service layer — real HTTP calls to the Express backend
 * ---------------------------------------------------------------
 * Every function returns a Promise matching the same shapes
 * the components/pages expect. The Vite dev server proxies
 * /api requests to http://localhost:5000.
 * ---------------------------------------------------------------
 */
import type {
  Professor,
  IIT,
  ResearchArea,
  Publication,
  Opportunity,
  DiscoverFilters,
  SortOption,
  SearchSuggestion,
} from "../types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ---------------------------- Professors ---------------------------- */

export async function fetchProfessors(
  filters: DiscoverFilters = {},
  sort: SortOption = "relevance"
): Promise<Professor[]> {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.iit) params.set("iit", filters.iit);
  if (filters.department) params.set("department", filters.department);
  if (filters.researchArea) params.set("researchArea", filters.researchArea);
  if (filters.location) params.set("location", filters.location);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.position) params.set("position", filters.position);
  params.set("sort", sort);

  const qs = params.toString();
  return get<Professor[]>(`/professors${qs ? `?${qs}` : ""}`);
}

export async function fetchProfessorBySlug(
  slug: string
): Promise<Professor | undefined> {
  try {
    return await get<Professor>(`/professors/${encodeURIComponent(slug)}`);
  } catch {
    return undefined;
  }
}

export async function fetchRelatedProfessors(
  professor: Professor,
  limit = 4
): Promise<Professor[]> {
  return get<Professor[]>(
    `/professors/related/${encodeURIComponent(professor.slug)}?limit=${limit}`
  );
}

/* --------------------------------- IITs -------------------------------- */

export async function fetchIITs(): Promise<IIT[]> {
  return get<IIT[]>("/iits");
}

export async function fetchIITById(id: string): Promise<IIT | undefined> {
  try {
    return await get<IIT>(`/iits/${encodeURIComponent(id)}`);
  } catch {
    return undefined;
  }
}

/* ---------------------------- Research Areas ---------------------------- */

export async function fetchResearchAreas(): Promise<ResearchArea[]> {
  return get<ResearchArea[]>("/research-areas");
}

export async function fetchResearchAreaBySlug(
  slug: string
): Promise<ResearchArea | undefined> {
  try {
    return await get<ResearchArea>(
      `/research-areas/${encodeURIComponent(slug)}`
    );
  } catch {
    return undefined;
  }
}

/* ------------------------------ Publications ----------------------------- */

export async function fetchPublicationsByProfessor(
  professorId: string
): Promise<Publication[]> {
  return get<Publication[]>(
    `/publications/professor/${encodeURIComponent(professorId)}`
  );
}

export async function fetchAllPublications(): Promise<Publication[]> {
  return get<Publication[]>("/publications");
}

/* ------------------------------ Opportunities ---------------------------- */

export async function fetchOpportunitiesByProfessor(
  professorId: string
): Promise<Opportunity[]> {
  return get<Opportunity[]>(
    `/opportunities/professor/${encodeURIComponent(professorId)}`
  );
}

export async function fetchAllOpportunities(): Promise<Opportunity[]> {
  return get<Opportunity[]>("/opportunities");
}

/* --------------------------------- Search -------------------------------- */

export async function fetchSearchSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  if (!query.trim()) return [];
  return get<SearchSuggestion[]>(
    `/search/suggestions?q=${encodeURIComponent(query)}`
  );
}

export const popularSearches = [
  "Artificial Intelligence",
  "IIT Madras",
  "Quantum Computing",
  "PhD positions in Robotics",
  "Computer Vision faculty",
];

/* ------------------------------- Platform stats -------------------------- */

export async function fetchPlatformStats() {
  return get<{ iits: number; professors: number; departments: number; researchAreas: number }>(
    "/stats"
  );
}

/* ------------------------------- Applications -------------------------- */

import type { SavedApplication, ApplicationStatus } from "../types";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchApplications(token: string): Promise<SavedApplication[]> {
  const res = await fetch(`${BASE}/applications`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function addApplication(
  token: string,
  professorId: string,
  status?: ApplicationStatus,
  notes?: string
) {
  const res = await fetch(`${BASE}/applications`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ professorId, status, notes }),
  });
  if (!res.ok) throw new Error("Failed to add application");
  return res.json();
}

export async function updateApplication(
  token: string,
  appId: number,
  status?: ApplicationStatus,
  notes?: string
) {
  const res = await fetch(`${BASE}/applications/${appId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}

export async function removeApplication(token: string, professorId: string) {
  const res = await fetch(`${BASE}/applications/${professorId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove application");
  return res.json();
}
