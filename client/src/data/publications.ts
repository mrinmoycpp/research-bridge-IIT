import type { Publication } from "../types";
import { professors } from "./professors";

const venues = [
  "NeurIPS", "CVPR", "Nature Communications", "IEEE Transactions on Robotics",
  "ACM CCS", "Physical Review Letters", "Cell Reports", "ICRA",
  "Journal of Climate", "Advanced Materials", "ICML", "AAAI",
];

const titleFragmentsByArea: Record<string, string[]> = {
  "ai-ml": [
    "Sample-Efficient Reinforcement Learning under Distribution Shift",
    "Interpretable Attention for Multimodal Reasoning",
    "Federated Fine-Tuning of Foundation Models on Edge Devices",
    "Benchmarking Low-Resource Language Understanding",
  ],
  "computer-vision": [
    "Neural Radiance Fields for Cluttered Indoor Scenes",
    "Self-Supervised Representations for Diagnostic Imaging",
    "Temporal Consistency in Video Segmentation",
  ],
  "quantum-computing": [
    "Extended Coherence in Topological Qubit Arrays",
    "Error Mitigation Strategies for NISQ-Era Circuits",
    "Scalable Quantum Key Distribution over Fibre Networks",
  ],
  biotechnology: [
    "Synthetic Gene Circuits for Neuronal Signalling Control",
    "Computational Genomics of Floodplain Microbial Communities",
    "CRISPR-Based Screening of Neurodegeneration Pathways",
  ],
  robotics: [
    "Legged Locomotion over Unstructured Disaster Terrain",
    "Tactile Feedback for Cluttered-Environment Manipulation",
    "Swarm Coordination for Agricultural Drone Fleets",
  ],
  "climate-science": [
    "Urban Heat Island Modelling Across Indian Megacities",
    "Cyclone Intensification Trends in the Bay of Bengal",
    "Himalayan Glacial Retreat and Landslide Risk",
  ],
  "materials-science": [
    "Solid Electrolyte Interfaces for Next-Generation Batteries",
    "Biodegradable Polymer Composites for Packaging",
    "Topological Phases in Twisted 2D Heterostructures",
  ],
  aerospace: [
    "Thermal Protection Systems for Hypersonic Re-Entry",
    "Student-Built CubeSat Constellation Design",
    "Low-Cost Attitude Control for Small Satellites",
  ],
  cybersecurity: [
    "Post-Quantum Cryptographic Protocols for Critical Infrastructure",
    "Hardware Trojan Detection in Edge AI Accelerators",
    "Privacy-Preserving Federated Learning for Public Health Data",
  ],
  "computational-neuroscience": [
    "Cortical Computation Models for Sample-Efficient Learning",
    "Signal Decoding for Brain-Machine Interfaces",
    "Zebrafish Models of Neural Decline",
  ],
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const publications: Publication[] = professors.flatMap((prof) => {
  const pubs: Publication[] = [];
  const areas = prof.researchAreas;
  let counter = 0;
  areas.forEach((areaId) => {
    const fragments = titleFragmentsByArea[areaId] || [];
    fragments.forEach((title) => {
      counter += 1;
      const seed = hashString(prof.id + title);
      pubs.push({
        id: `${prof.id}-pub${counter}`,
        title,
        year: 2018 + (seed % 8),
        venue: venues[seed % venues.length],
        authors: [prof.name, "et al."],
        citationCount: 20 + (seed % 480),
        doi: `10.1000/${prof.id}.${1000 + seed % 9000}`,
        areaId,
      });
    });
  });
  return pubs.sort((a, b) => b.year - a.year);
});

export const getPublicationsByProfessor = (professorId: string) =>
  publications.filter((p) => p.id.startsWith(professorId + "-"));

export const getPublicationsByArea = (areaId: string) =>
  publications.filter((p) => p.areaId === areaId);
