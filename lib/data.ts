import { CaseStudyData } from "@/components/CaseStudyViewer";
import { SiFigma, SiCanva, SiNextdotjs, SiTailwindcss, SiReact } from "react-icons/si";
import { DiIllustrator } from "react-icons/di";

// --- INTERFACES ---
export interface Tool {
  name: string;
  icon: any;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialId: string;
  link: string;
}

// --- DATA: TOOLS & SOFTWARE ---
export const toolsData: Tool[] = [
  { name: "Figma", icon: SiFigma },
  { name: "Adobe Illustrator", icon: DiIllustrator },
  { name: "Canva", icon: SiCanva },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "React", icon: SiReact },
];

// --- DATA: TECHNICAL SKILLS ---
export const skillsData: Skill[] = [
  { name: "UI/UX Design", level: 95 },
  { name: "Figma", level: 95 },
  { name: "UX Research", level: 85 },
  { name: "Design Thinking", level: 85 },
  { name: "System Analysis", level: 80 },
  { name: "HTML & CSS", level: 85 },
  { name: "Adobe Illustrator", level: 85 },
  { name: "React / Next.js", level: 70 },
];

// --- DATA: CERTIFICATIONS ---
export const certificatesData: Certificate[] = [
  {
    id: 1,
    title: "PT Vinix Seven Aurum - Internship Program",
    issuer: "VINIX 7",
    date: "Dec 2025",
    image: "/images/Certi-MSIB.png",
    description: "MSIB Internship participant focusing on web interface development and user experience design within a professional tech environment.",
    credentialId: "G-123456789UX",
    link: "#",
  },
  {
    id: 2,
    title: "DSF 44 - UI UX Design Bootcamp",
    issuer: "Dibimbing.id",
    date: "Oct 2025",
    image: "/images/Certi-DSF.png",
    description: "An intensive UI/UX Design bootcamp covering end-to-end processes including user research, wireframing, prototyping, and usability testing.",
    credentialId: "DCD-987654321",
    link: "#",
  },
  {
    id: 3,
    title: "Creative LO Competition",
    issuer: "LO KREATIF",
    date: "Nov 2024",
    image: "/images/Certi-LOKREATIF.png",
    description: "Participant in the international LOKREATIF Poster Design Competition, demonstrating high visual creativity and effective visual communication.",
    credentialId: "CMP-456123789",
    link: "#",
  },
];

// --- DATA: CASE STUDIES (UI/UX FOCUSED) ---
export const caseStudiesDB: Record<string, CaseStudyData> = {
  finanku: {
    title: "FinanKu - Financial Management Web",
    role: "Junior Web Dev & UI/UX Designer",
    duration: "4 Weeks",
    problem: "College students felt overwhelmed by complex financial app interfaces and forced subscriptions, making them reluctant to track daily expenses.",
    outcome: "Simplified the main dashboard by integrating gamification elements and highly intuitive data visualizations to encourage daily usage.",

    prototypeLink:
      "https://www.figma.com/proto/bjJpeWJ63bffsm41XPIphA/Tugas-Modul-4---5---Vinix?node-id=121-92&p=f&t=AZNOyW1OQ0VT8ElD-1&scaling=scale-down&content-scaling=fixed&page-id=77%3A55&starting-point-node-id=121%3A92&show-proto-sidebar=1",

    images: [
      "/images/case-studies/finanku/1.png",
      "/images/case-studies/finanku/2.png",
      "/images/case-studies/finanku/3.png",
      "/images/case-studies/finanku/4.png",
      "/images/case-studies/finanku/5.png",
      "/images/case-studies/finanku/6.png",
      "/images/case-studies/finanku/7.png",
      "/images/case-studies/finanku/8.png",
      "/images/case-studies/finanku/9.png",
      "/images/case-studies/finanku/10.png",
      "/images/case-studies/finanku/11.png",
      "/images/case-studies/finanku/12.png",
      "/images/case-studies/finanku/13.png",
      "/images/case-studies/finanku/14.png",
      "/images/case-studies/finanku/15.png",
    ],
  },
  "leaf-in": {
    title: "Leaf-In A Mobile App",
    role: "Team Leader & UI/UX Designer",
    duration: "6 Weeks",
    problem: "Health-conscious individuals with busy lifestyles struggle to afford nutritious meals on mainstream delivery super-apps due to high platform markups and the overwhelming dominance of fast-food options.",
    outcome: "Designed a Direct-to-Consumer (D2C) mobile application for 'Leaf-In' (an affordable healthy food brand), bypassing third-party fees to offer budget-friendly meals with a streamlined, specialized ordering experience.",
    prototypeLink: "https://www.figma.com/proto/...",

    images: ["/images/case-studies/leaf-in/leaf-in-1.png"],
  },
  "dibimbing-bootcamp": {
    title: "E-Commerce Landing Page Redesign - Bootcamp Project",
    role: "UI/UX Designer",
    duration: "1 Week",
    problem: "Poor user flow and prototype due to several information inconsistencies, as well as a rigid user flow on the initial landing page.",
    outcome: " Produced a clear user flow by analyzing business processes, then creating wireframes and prototypes using the User-Centered Design method, resulting in a more intuitive interface and flow.",
    images: [
      "/images/case-studies/dibimbing/1.png",
      "/images/case-studies/dibimbing/2.png",
      "/images/case-studies/dibimbing/3.png",
      "/images/case-studies/dibimbing/4.png",
      "/images/case-studies/dibimbing/5.png",
      "/images/case-studies/dibimbing/6.png",
      "/images/case-studies/dibimbing/7.png",
      "/images/case-studies/dibimbing/8.png",
      "/images/case-studies/dibimbing/9.png",
      "/images/case-studies/dibimbing/10.png",
      "/images/case-studies/dibimbing/11.png",
    ],
    prototypeLink: "https://www.figma.com/design/zMifQg0FHiuCJH9d5aFY3n/Re-Design?node-id=0-1&t=71NwB7oXAG9qTuHC-1",
  },
};
