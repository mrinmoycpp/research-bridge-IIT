import type { IIT } from "../types";

export const iits: IIT[] = [
  {
    id: "iit-bombay",
    code: "IIT Bombay",
    name: "Indian Institute of Technology Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    established: 1958,
    description:
      "IIT Bombay is one of India's foremost centres for engineering research, known for computer science, aerospace, and interdisciplinary systems research.",
    departments: 21,
    professorCount: 680,
    popularAreas: ["ai-ml", "computer-vision", "aerospace"],
    ranking: "NIRF #3 Engineering",
  },
  {
    id: "iit-delhi",
    code: "IIT Delhi",
    name: "Indian Institute of Technology Delhi",
    city: "New Delhi",
    state: "Delhi",
    established: 1961,
    description:
      "IIT Delhi pairs strong core engineering with growing programmes in biotechnology, public health, and computational social science.",
    departments: 19,
    professorCount: 612,
    popularAreas: ["ai-ml", "biotechnology", "cybersecurity"],
    ranking: "NIRF #2 Engineering",
  },
  {
    id: "iit-madras",
    code: "IIT Madras",
    name: "Indian Institute of Technology Madras",
    city: "Chennai",
    state: "Tamil Nadu",
    established: 1959,
    description:
      "Ranked India's top research institution, IIT Madras leads in robotics, data science, and ocean and coastal engineering.",
    departments: 20,
    professorCount: 645,
    popularAreas: ["robotics", "ai-ml", "materials-science"],
    ranking: "NIRF #1 Overall",
  },
  {
    id: "iit-kanpur",
    code: "IIT Kanpur",
    name: "Indian Institute of Technology Kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    established: 1959,
    description:
      "Long regarded as India's aerospace and core-sciences powerhouse, IIT Kanpur maintains one of the country's most active satellite and quantum research programmes.",
    departments: 18,
    professorCount: 520,
    popularAreas: ["aerospace", "quantum-computing", "materials-science"],
    ranking: "NIRF #4 Engineering",
  },
  {
    id: "iit-kharagpur",
    code: "IIT Kharagpur",
    name: "Indian Institute of Technology Kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    established: 1951,
    description:
      "The first and largest of the IITs, with deep strength in materials, mining, and agricultural and food engineering research.",
    departments: 22,
    professorCount: 700,
    popularAreas: ["materials-science", "biotechnology", "climate-science"],
    ranking: "NIRF #5 Engineering",
  },
  {
    id: "iit-roorkee",
    code: "IIT Roorkee",
    name: "Indian Institute of Technology Roorkee",
    city: "Roorkee",
    state: "Uttarakhand",
    established: 1847,
    description:
      "Asia's oldest technical institution, bringing a century of civil and earth-sciences expertise to modern climate risk and disaster-resilience research.",
    departments: 17,
    professorCount: 440,
    popularAreas: ["climate-science", "materials-science", "cybersecurity"],
    ranking: "NIRF #6 Engineering",
  },
  {
    id: "iit-guwahati",
    code: "IIT Guwahati",
    name: "Indian Institute of Technology Guwahati",
    city: "Guwahati",
    state: "Assam",
    established: 1994,
    description:
      "Nestled by the Brahmaputra, IIT Guwahati has built a distinct research identity around biosciences, computational neuroscience, and northeast biodiversity.",
    departments: 15,
    professorCount: 360,
    popularAreas: ["computational-neuroscience", "biotechnology", "robotics"],
    ranking: "NIRF #7 Engineering",
  },
];

export const getIITById = (id: string) => iits.find((i) => i.id === id);
