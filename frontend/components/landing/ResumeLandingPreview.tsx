"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaFilePdf,
  FaLaptopCode,
  FaUserGraduate,
} from "react-icons/fa";

import ATSPreview from "@/components/resume/previews/ATSPreview";
import StudentPreview from "@/components/resume/previews/StudentPreview";
import DeveloperPreview from "@/components/resume/previews/DeveloperPreview";
import type { ResumeData } from "@/components/resume/ResumeTypes";

type Template = "ats" | "student" | "developer";

const TEMPLATES = [
  {
    id: "ats" as Template,
    name: "ATS",
    icon: <FaFilePdf />,
  },
  {
    id: "student" as Template,
    name: "Student",
    icon: <FaUserGraduate />,
  },
  {
    id: "developer" as Template,
    name: "Developer",
    icon: <FaLaptopCode />,
  },
];

const demoResume: ResumeData = {
  name: "Jordan Reyes",
  username: "jordandemo",
  email: "jordan.reyesdemo@email.com",

  headline: "Sophomore IT Student · Full-Stack Developer",

  about:
    "IT student focused on full-stack development, passionate about building modern web applications and learning new technologies through hands-on projects.",

  location: "Manila, Philippines",

  website: "https://jordandev.dev",

  phone: "+63 912 345 6789",

  skills: [
    {
      id: "1",
      name: "React",
      category: "Frontend",
      level: "Advanced",
    },
    {
      id: "2",
      name: "TypeScript",
      category: "Frontend",
      level: "Intermediate",
    },
    {
      id: "3",
      name: "Node.js",
      category: "Backend",
      level: "Intermediate",
    },
    {
      id: "4",
      name: "PostgreSQL",
      category: "Database",
      level: "Beginner",
    },
  ],

  education: [
    {
      id: "1",
      school: "State University",
      degree: "Bachelor of Science",
      field: "Information Technology",
      startYear: 2023,
      endYear: null,
      current: true,
    },
  ],

  experience: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      role: "Frontend Intern",
      startDate: "2025-06-01",
      endDate: null,
      current: true,
      description:
        "Built reusable React components and collaborated with UI designers.",
    },
  ],

  projects: [
    {
      id: "1",
      title: "Portfolio Tracker",
      description: "Track job applications and monitor portfolio analytics.",
      techStack: ["React", "TypeScript", "Node.js"],
      liveUrl: "https://portfolio.demo",
      githubUrl: "https://github.com/jordan/portfolio",
      featured: true,
    },
    {
      id: "2",
      title: "RecipeShare",
      description:
        "Community recipe-sharing application with AI recommendations.",
      techStack: ["React", "PostgreSQL"],
      liveUrl: null,
      githubUrl: "https://github.com/jordan/recipeshare",
      featured: false,
    },
  ],

  certificates: [
    {
      id: "1",
      title: "Meta Front-End Developer",
      issuer: "Meta",
      category: "Frontend",
    },
  ],

  socialLinks: [
    {
      id: "1",
      platform: "GitHub",
      url: "https://github.com/jordan",
    },
    {
      id: "2",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/jordan",
    },
  ],
};

export default function ResumeLandingPreview() {
  const [template, setTemplate] = useState<Template>("ats");

  useEffect(() => {
    const interval = setInterval(() => {
      setTemplate((current) => {
        if (current === "ats") return "student";
        if (current === "student") return "developer";
        return "ats";
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Resume Builder</h3>

          <p className="text-xs text-slate-500">
            Build professional resumes instantly
          </p>
        </div>

        <button className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-400">
          Download PDF
        </button>
      </div>

      <div className="rounded-2xl bg-[#09090f] p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={template}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35 }}
            className="
              mx-auto
              max-w-[720px]
              overflow-hidden
              rounded-xl
              bg-white
              shadow-2xl
            "
          >
            {template === "ats" && <ATSPreview data={demoResume} />}

            {template === "student" && <StudentPreview data={demoResume} />}

            {template === "developer" && <DeveloperPreview data={demoResume} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex justify-center gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                template === t.id
                  ? "bg-indigo-500 text-white"
                  : "border border-white/10 text-slate-400 hover:border-indigo-500/30"
              }`}
            >
              {t.icon}

              {t.name}

              {template === t.id && <FaCheckCircle size={10} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
