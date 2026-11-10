export type ProjectLink = { label: string; href: string };
export type Project = {
  number: string;
  title: string[];
  slug: string;
  category: string;
  description: string;
  tags: string[];
  role: string;
  tools: string[];
  coverImage?: string;
  problem?: string;
  approach?: string;
  result?: string;
  links?: ProjectLink[];
};

// Example projects only. Replace titles, descriptions and tags; then add photos
// under src/media/projects/<slug>/ (photos are intentionally not included).
export const projects: Project[] = [
  {
    number: "001", title: ["PROJECT", "ALPHA"], slug: "project-alpha",
    category: "CREATIVE DEVELOPMENT",
    description: "An example project demonstrating the case study layout.",
    tags: ["DESIGN", "CODE", "PHOTOGRAPHY"],
    role: "DESIGN / DEVELOPMENT", tools: ["REACT", "TYPESCRIPT", "GSAP"],
    problem: "Describe the design challenge or brief here.",
    approach: "Explain the process and the choices behind it.",
    result: "Share the result and what you learned.",
  },
  {
    number: "002", title: ["STUDIO", "CONCEPT"], slug: "studio-concept",
    category: "VISUAL DESIGN",
    description: "An example visual design project with room for many images.",
    tags: ["GRAPHIC DESIGN", "ART", "CREATIVE"],
    role: "VISUAL DESIGN", tools: ["DESIGN", "ILLUSTRATION"],
    problem: "Describe the visual brief.", approach: "Explain the process.",
    result: "Summarize the outcomes.",
  },
  {
    number: "003", title: ["FIELD", "NOTES"], slug: "field-notes",
    category: "PHOTO SERIES",
    description: "An example photo collection with an interactive gallery.",
    tags: ["PHOTOGRAPHY", "ART"],
    role: "PHOTOGRAPHY", tools: ["CAMERA", "EDITING"],
    problem: "Explain the theme of the photo series.",
    approach: "Describe how the images were captured.",
    result: "Describe the final selection.",
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);
