export interface IIT {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  description: string;
  departments: number;
  professorCount: number;
  popularAreas: string[];
}

export interface Publication {
  id: string;
  title: string;
  year: number;
  venue: string;
  authors: string[];
  citationCount: number;
  doi?: string;
  areaId: string;
}

export type AvailabilityStatus = "open" | "limited" | "closed";

export interface Opportunity {
  id: string;
  title: string;
  type: "Internship" | "PhD Position" | "RA Position" | "Project";
  professorId: string;
  status: AvailabilityStatus;
  deadline?: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
}

export type AcademicPosition =
  | "Assistant Professor"
  | "Associate Professor"
  | "Professor"
  | "Institute Chair Professor"
  | "Emeritus Professor";

export interface Professor {
  id: string;
  name: string;
  slug: string;
  position: AcademicPosition;
  iitId: string;
  department: string;
  researchAreas: string[];
  bio: string;
  email: string;
  website?: string;
  googleScholar?: string;
  orcid?: string;
  publicationCount: number;
  citationCount: number;
  hIndex: number;
  availability: AvailabilityStatus;
  location: string;
  joinedYear: number;
  timeline: TimelineEvent[];
}

export interface ResearchArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  trendingTopics: string[];
  professorCount: number;
  publicationCount: number;
  relatedAreas?: string[];
}

export interface SearchSuggestion {
  id: string;
  type: "professor" | "iit" | "department" | "area" | "publication";
  label: string;
  sublabel?: string;
}

export interface DiscoverFilters {
  iit?: string;
  department?: string;
  researchArea?: string;
  location?: string;
  availability?: AvailabilityStatus;
  position?: AcademicPosition;
  query?: string;
}

export type SortOption =
  | "relevance"
  | "citations"
  | "publications"
  | "name-asc"
  | "recent";

export type ApplicationStatus =
  | "interested"
  | "applied"
  | "interview"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface SavedApplication {
  id: number;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  professor: {
    id: string;
    name: string;
    slug: string;
    department: string;
    institute: string;
    iitId: string;
    email: string;
    researchAreas: string[];
    publicationCount: number;
  };
}
