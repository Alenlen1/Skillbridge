"use client";

import { motion } from "framer-motion";
import { IconBrandGithub } from "@tabler/icons-react";
export default function PortfolioLandingPreview() {
  const skillGroups = [
    {
      category: "Frontend",
      skills: [
        { name: "React", level: "Intermediate" },
        { name: "HTML", level: "Advanced" },
      ],
    },
    {
      category: "Backend",
      skills: [{ name: "Node.js", level: "Intermediate" }],
    },
    {
      category: "Database",
      skills: [{ name: "PostgreSQL", level: "Beginner" }],
    },
  ];

  const projects = [
    {
      name: "Portfolio Tracker",
      tag: "TypeScript",
      desc: "Track applications and portfolio analytics in one place.",
    },
    {
      name: "RecipeShare",
      tag: "CSS",
      desc: "Community recipe-sharing app with auth and AI recommendations.",
    },
  ];
  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };

  return (
    <motion.div {...fade} className="p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
          JR
        </div>
        <div>
          <h3 className="font-semibold text-white">Jordan Reyes</h3>
          <p className="text-sm text-slate-400">
            Sophomore IT Student · Full-Stack Developer
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>@jordanreyesdemo</span>
            <span className="flex items-center gap-1 text-indigo-400">
              <IconBrandGithub size={12} stroke={1.75} />
              github.com/jordanreyesdemo
            </span>
          </div>
          <p className="mt-3 max-w-lg text-xs leading-relaxed text-slate-500">
            IT student focused on full-stack development, passionate about
            building modern web applications and learning new technologies
            through hands-on projects.
          </p>
        </div>
      </div>

      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-400">
        Skills
      </p>
      <div className="mb-6 space-y-3">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-600">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300"
                >
                  {skill.name}
                  <span className="text-[10px] text-indigo-400/60">
                    {skill.level}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-indigo-400">
        Projects
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-indigo-500/20 hover:bg-white/[0.04]"
          >
            <p className="text-sm font-medium text-white">{project.name}</p>
            <span className="mt-1.5 inline-block rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-400">
              {project.tag}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {project.desc}
            </p>
            <div className="mt-3 flex items-center gap-1 text-slate-600">
              <IconBrandGithub size={12} stroke={1.5} />
              <span className="text-[11px]">GitHub</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
