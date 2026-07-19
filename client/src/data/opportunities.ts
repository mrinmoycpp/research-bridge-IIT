import type { Opportunity } from "../types";
import { professors } from "./professors";

const templates: { type: Opportunity["type"]; title: string; description: string }[] = [
  {
    type: "PhD Position",
    title: "Doctoral Researcher",
    description:
      "Full-time PhD position with institute fellowship, focused on open problems in the lab's core research direction. Prior publication record preferred but not required.",
  },
  {
    type: "RA Position",
    title: "Research Assistant",
    description:
      "Funded RA position for graduates to support ongoing sponsored projects, with potential pathway into the PhD programme.",
  },
  {
    type: "Internship",
    title: "Summer Research Internship",
    description:
      "8–10 week hands-on research internship for undergraduates, culminating in a co-authored technical report.",
  },
  {
    type: "Project",
    title: "B.Tech Project Collaboration",
    description:
      "Semester-long project slot for final-year undergraduates to contribute to an active sponsored research project.",
  },
];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const opportunities: Opportunity[] = professors.flatMap((prof) => {
  const seed = hashString(prof.id);
  const count = prof.availability === "closed" ? 0 : 1 + (seed % 2);
  return Array.from({ length: count }).map((_, i) => {
    const template = templates[(seed + i) % templates.length];
    return {
      id: `${prof.id}-opp${i + 1}`,
      title: template.title,
      type: template.type,
      professorId: prof.id,
      status: prof.availability,
      deadline: prof.availability === "open" ? "Rolling" : "31 Oct 2026",
      description: template.description,
    };
  });
});

export const getOpportunitiesByProfessor = (professorId: string) =>
  opportunities.filter((o) => o.professorId === professorId);
