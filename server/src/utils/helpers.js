const IIT_META = {
  "IIT BOMBAY": {
    id: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    established: 1958,
    description:
      "IIT Bombay is one of India's foremost centres for engineering research, known for computer science, aerospace, and interdisciplinary systems research.",
    ranking: "NIRF #3 Engineering",
  },
  "IIT Delhi": {
    id: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    established: 1961,
    description:
      "IIT Delhi pairs strong core engineering with growing programmes in biotechnology, public health, and computational social science.",
    ranking: "NIRF #2 Engineering",
  },
  "IIT MADRAS": {
    id: "iit-madras",
    city: "Chennai",
    state: "Tamil Nadu",
    established: 1959,
    description:
      "Ranked India's top research institution, IIT Madras leads in robotics, data science, and ocean and coastal engineering.",
    ranking: "NIRF #1 Overall",
  },
  "IIT Kharagpur": {
    id: "iit-kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    established: 1951,
    description:
      "The first IIT to be established, known for its sprawling campus and pioneering contributions to engineering education.",
    ranking: "NIRF #5 Engineering",
  },
  "IIT Kanpur": {
    id: "iit-kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    established: 1959,
    description:
      "Renowned for its academic independence and strong computer science programme with a legacy of fundamental research.",
    ranking: "NIRF #4 Engineering",
  },
  "IIT Guwahati": {
    id: "iit-guwahati",
    city: "Guwahati",
    state: "Assam",
    established: 1994,
    description:
      "Excels in biotechnology, climate science, and sustainable energy research with a growing interdisciplinary focus.",
    ranking: "NIRF #7 Engineering",
  },
  "IIT Roorkee": {
    id: "iit-roorkee",
    city: "Roorkee",
    state: "Uttarakhand",
    established: 1847,
    description:
      "One of the oldest technical institutions in Asia, with deep roots in civil and structural engineering.",
    ranking: "NIRF #6 Engineering",
  },
};

const LOCATIONS = {
  "IIT BOMBAY": "Mumbai, Maharashtra",
  "IIT Delhi": "New Delhi",
  "IIT MADRAS": "Chennai, Tamil Nadu",
  "IIT Kharagpur": "Kharagpur, West Bengal",
  "IIT Kanpur": "Kanpur, Uttar Pradesh",
  "IIT Guwahati": "Guwahati, Assam",
  "IIT Roorkee": "Roorkee, Uttarakhand",
  "IIT Indore": "Indore, Madhya Pradesh",
  "IIT BHU": "Varanasi, Uttar Pradesh",
  "IIT ROPAR": "Rupnagar, Punjab",
  "IIT JODHPUR": "Jodhpur, Rajasthan",
  "IIT GANDHINAGAR": "Gandhinagar, Gujarat",
  "IIT BHILAI": "Raipur, Chhattisgarh",
  "IIT Tirupati": "Tirupati, Andhra Pradesh",
  "IIT Bhubaneswar": "Bhubaneswar, Odisha",
  "IIT Dharwad": "Dharwad, Karnataka",
  "IIT GOA": "Goa",
  "IIT Palakkad": "Palakkad, Kerala",
  "IIT JAMMU": "Jammu, Jammu & Kashmir",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function professorSlug(name) {
  return slugify(name);
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function inferPosition(name) {
  const lower = name.toLowerCase();
  if (lower.startsWith("prof.") || lower.startsWith("professor"))
    return "Professor";
  if (lower.startsWith("dr.") || lower.startsWith("dr "))
    return "Assistant Professor";
  return "Associate Professor";
}

function inferAvailability(seed) {
  const r = seed % 10;
  if (r < 5) return "open";
  if (r < 8) return "limited";
  return "closed";
}

function generateBio(name, deptName, areas) {
  const areaStr = areas.length > 0 ? areas.slice(0, 3).join(", ") : "engineering";
  return `${name} is a faculty member in the ${deptName} department, with research interests spanning ${areaStr}.`;
}

const OPPORTUNITY_TEMPLATES = [
  {
    type: "PhD Position",
    title: "Doctoral Researcher",
    description:
      "Full-time PhD position with institute fellowship, focused on open problems in the lab's core research direction.",
  },
  {
    type: "RA Position",
    title: "Research Assistant",
    description:
      "Funded RA position for graduates to support ongoing sponsored projects.",
  },
  {
    type: "Internship",
    title: "Summer Research Internship",
    description:
      "8-10 week hands-on research internship for undergraduates.",
  },
  {
    type: "Project",
    title: "B.Tech Project Collaboration",
    description:
      "Semester-long project slot for final-year undergraduates.",
  },
];

const TRENDING_TOPICS = [
  "Large Language Models",
  "Reinforcement Learning",
  "Explainable AI",
  "Federated Learning",
  "Multimodal Reasoning",
  "Neural Rendering",
  "Medical Image Analysis",
  "Quantum Error Correction",
  "Sustainable Energy",
  "Robotics",
  "Computational Biology",
  "Cybersecurity",
  "Edge Computing",
];

function getIITMeta(instituteName) {
  const key = instituteName.toUpperCase();
  return (
    IIT_META[key] || {
      id: slugify(instituteName),
      city: (LOCATIONS[key] || "India").split(",")[0].trim(),
      state: (LOCATIONS[key] || "India").split(",")[1]?.trim() || "India",
      established: 1960 + (hashString(key) % 50),
      description: `${instituteName} is one of India's premier Institutes of Technology.`,
      ranking: `NIRF #${10 + (hashString(key) % 30)} Engineering`,
    }
  );
}

function getLocation(instituteName) {
  return LOCATIONS[instituteName] || "India";
}

module.exports = {
  slugify,
  professorSlug,
  hashString,
  seededRandom,
  inferPosition,
  inferAvailability,
  generateBio,
  OPPORTUNITY_TEMPLATES,
  TRENDING_TOPICS,
  getIITMeta,
  getLocation,
};
