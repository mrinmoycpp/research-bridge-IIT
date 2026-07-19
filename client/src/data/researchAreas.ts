import type { ResearchArea } from "../types";

export const researchAreas: ResearchArea[] = [
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    slug: "artificial-intelligence-machine-learning",
    description:
      "Learning systems, representation, and reasoning — from foundational theory to deployed models across vision, language, and decision-making.",
    trendingTopics: [
      "Large Language Models",
      "Reinforcement Learning",
      "Explainable AI",
      "Federated Learning",
      "Multimodal Reasoning",
    ],
    professorCount: 41,
    publicationCount: 1284,
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    slug: "computer-vision",
    description:
      "Machines that see — image understanding, 3D reconstruction, and visual perception for autonomous systems and medical imaging.",
    trendingTopics: [
      "Neural Rendering",
      "Medical Image Analysis",
      "3D Scene Understanding",
      "Video Understanding",
    ],
    professorCount: 22,
    publicationCount: 617,
  },
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    slug: "quantum-computing",
    description:
      "Quantum algorithms, error correction, and hardware — building the computational substrate beyond classical limits.",
    trendingTopics: [
      "Quantum Error Correction",
      "Topological Qubits",
      "Quantum Cryptography",
      "NISQ Algorithms",
    ],
    professorCount: 14,
    publicationCount: 298,
  },
  {
    id: "biotechnology",
    name: "Biotechnology",
    slug: "biotechnology",
    description:
      "Molecular and cellular engineering — genomics, synthetic biology, and biomanufacturing at the interface of life and machine.",
    trendingTopics: [
      "Synthetic Biology",
      "CRISPR Gene Editing",
      "Computational Genomics",
      "Bioprocess Engineering",
    ],
    professorCount: 19,
    publicationCount: 432,
  },
  {
    id: "robotics",
    name: "Robotics & Autonomous Systems",
    slug: "robotics-autonomous-systems",
    description:
      "Embodied intelligence — manipulation, legged locomotion, and multi-agent coordination in unstructured environments.",
    trendingTopics: [
      "Legged Locomotion",
      "Swarm Robotics",
      "Human-Robot Interaction",
      "Soft Robotics",
    ],
    professorCount: 17,
    publicationCount: 389,
  },
  {
    id: "climate-science",
    name: "Climate Science",
    slug: "climate-science",
    description:
      "Earth systems, atmospheric modelling, and climate risk — quantifying and mitigating a changing planet.",
    trendingTopics: [
      "Climate Modelling",
      "Extreme Weather Prediction",
      "Carbon Capture",
      "Urban Heat Islands",
    ],
    professorCount: 12,
    publicationCount: 276,
  },
  {
    id: "materials-science",
    name: "Materials Science",
    slug: "materials-science",
    description:
      "Designing matter — nanomaterials, energy storage, and structural materials for the next generation of engineering.",
    trendingTopics: [
      "2D Materials",
      "Solid-State Batteries",
      "Metamaterials",
      "Nanofabrication",
    ],
    professorCount: 24,
    publicationCount: 541,
  },
  {
    id: "aerospace",
    name: "Aerospace Engineering",
    slug: "aerospace-engineering",
    description:
      "Flight, propulsion, and orbital systems — from hypersonics to small-satellite constellations.",
    trendingTopics: [
      "Hypersonic Vehicles",
      "Satellite Constellations",
      "Propulsion Systems",
      "Space Debris Tracking",
    ],
    professorCount: 15,
    publicationCount: 312,
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Systems security, cryptography, and privacy — defending infrastructure at internet scale.",
    trendingTopics: [
      "Applied Cryptography",
      "Hardware Security",
      "Adversarial ML",
      "Privacy-Preserving Systems",
    ],
    professorCount: 16,
    publicationCount: 344,
  },
  {
    id: "computational-neuroscience",
    name: "Computational Neuroscience",
    slug: "computational-neuroscience",
    description:
      "Modelling the brain — neural computation, cognition, and brain-machine interfaces.",
    trendingTopics: [
      "Brain-Machine Interfaces",
      "Neural Coding",
      "Cognitive Modelling",
      "Neuromorphic Computing",
    ],
    professorCount: 9,
    publicationCount: 187,
  },
];

export const getAreaById = (id: string) =>
  researchAreas.find((a) => a.id === id);
