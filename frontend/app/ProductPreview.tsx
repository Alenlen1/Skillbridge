"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconBrandGithub,
  IconBriefcase,
  IconCertificate,
  IconChartBar,
  IconDownload,
  IconEye,
  IconFileText,
  IconFolder,
  IconShieldCheck,
  IconTrendingUp,
} from "@tabler/icons-react";

type TabId = "portfolio" | "resume" | "certificates" | "tracker" | "analytics";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    icon: <IconFolder size={16} stroke={1.75} />,
  },
  {
    id: "resume",
    label: "Resume",
    icon: <IconFileText size={16} stroke={1.75} />,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: <IconCertificate size={16} stroke={1.75} />,
  },
  {
    id: "tracker",
    label: "Career Tracker",
    icon: <IconBriefcase size={16} stroke={1.75} />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <IconChartBar size={16} stroke={1.75} />,
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

function PortfolioPreview() {
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

function ResumePreview() {
  return (
    <motion.div {...fade} className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Resume</h3>
          <p className="text-xs text-slate-500">
            Generated automatically from your portfolio data
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
          <IconDownload size={13} stroke={2} />
          Download PDF
        </button>
      </div>

      {/* Document card */}
      <div className="rounded-xl bg-white p-5 text-[#1a1a1a] shadow-xl">
        <h4 className="text-lg font-bold leading-tight">Jordan Reyes</h4>
        <p className="mt-0.5 text-xs text-slate-600">
          Sophomore IT Student · Full-Stack Developer
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          jordan.reyesdemo@email.com · Manila, Philippines · skillbridge.app/jordandemo
        </p>

        <div className="my-3 h-px bg-slate-200" />

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
          About
        </p>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-700">
          IT student focused on full-stack development, passionate about
          building modern web applications and learning new technologies through
          hands-on projects.
        </p>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
          Projects
        </p>
        <div className="mb-3 space-y-1.5">
          <p className="text-xs font-semibold">Portfolio Tracker</p>
          <p className="text-xs font-semibold">RecipeShare</p>
          <p className="text-[11px] text-slate-600">
            A community recipe-sharing web app with authentication, a PostgreSQL
            database, and AI-assisted recommendations.
          </p>
        </div>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
          Education
        </p>
        <p className="mb-3 text-xs font-semibold">
          State University
          <span className="block text-[11px] font-normal text-slate-600">
            Bachelor of Science · Information Technology
          </span>
        </p>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
          Skills
        </p>
        <p className="text-[11px] text-slate-600">
          React · HTML · TypeScript · Node.js · SQL
        </p>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-600">
        This is a simplified preview — the downloaded PDF will be fully
        formatted
      </p>
    </motion.div>
  );
}

function CertificatesPreview() {
  const certs = [
    {
      name: "Full-Stack Web Development",
      issuer: "Meta",
      category: "Technical",
      verified: true,
    },
    {
      name: "Database Design Fundamentals",
      issuer: "IBM",
      category: "Technical",
      verified: true,
    },
    {
      name: "UI/UX Design Principles",
      issuer: "Google",
      category: "Design",
      verified: false,
    },
  ];
  return (
    <motion.div {...fade} className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Certificates</h3>
          <p className="text-xs text-slate-500">
            Upload and showcase your certifications
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
          <span className="text-sm leading-none">+</span>
          Upload certificate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {certs.map((cert) => (
          <div
            key={cert.name}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-indigo-500/20 hover:bg-white/[0.04]"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-500">
                {cert.category}
              </span>
              {cert.verified && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <IconShieldCheck size={13} stroke={1.75} />
                  <span className="text-[10px] font-medium">Verified</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-white">{cert.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{cert.issuer}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CareerTrackerPreview() {
  const statuses: {
    label: string;
    count: number;
    text: string;
    border: string;
    bg: string;
  }[] = [
    {
      label: "Applied",
      count: 6,
      text: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
    },
    {
      label: "Screening",
      count: 3,
      text: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
    {
      label: "Interview",
      count: 2,
      text: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
    },
    {
      label: "Offer",
      count: 1,
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rejected",
      count: 4,
      text: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
    },
  ];

  const applications = [
    { company: "Acme Corp", role: "Frontend Intern", status: "Applied" },
    { company: "Stackline", role: "Full-Stack Developer", status: "Interview" },
    { company: "Northbridge", role: "Software Engineer", status: "Offer" },
  ];

  const statusStyle: Record<
    string,
    { text: string; border: string; bg: string }
  > = {
    Applied: {
      text: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
    },
    Screening: {
      text: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    },
    Interview: {
      text: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
    },
    Offer: {
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
    },
    Rejected: {
      text: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
    },
  };

  return (
    <motion.div {...fade} className="p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Career tracker</h3>

      {/* Status pills row */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        {statuses.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${s.border} ${s.bg} ${s.text}`}
            >
              {s.label}
            </span>
            <span className="text-sm text-slate-600">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Recent applications list */}
      <div className="space-y-2">
        {applications.map((app) => {
          const style = statusStyle[app.status];
          return (
            <div
              key={app.company}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-indigo-500/20 hover:bg-white/[0.04]"
            >
              <div>
                <p className="text-sm font-medium text-white">{app.company}</p>
                <p className="text-xs text-slate-500">{app.role}</p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${style.border} ${style.bg} ${style.text}`}
              >
                {app.status}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AnalyticsPreview() {
  const stats = [
    {
      icon: <IconEye size={18} stroke={1.75} />,
      value: "9",
      label: "Portfolio views",
    },
    {
      icon: <IconBriefcase size={18} stroke={1.75} />,
      value: "6",
      label: "Total applications",
    },
    {
      icon: <IconChartBar size={18} stroke={1.75} />,
      value: "2",
      label: "Interviews",
    },
    {
      icon: <IconTrendingUp size={18} stroke={1.75} />,
      value: "1",
      label: "Offers received",
    },
  ];

  return (
    <motion.div {...fade} className="p-6">
      <h3 className="mb-1 text-base font-bold text-white">Analytics</h3>
      <p className="mb-5 text-xs text-slate-500">
        Track your portfolio performance and application progress
      </p>

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-indigo-500/20 hover:bg-white/[0.04]"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-sm font-semibold text-white">
            Application breakdown
          </p>
          <p className="text-xs text-slate-600">No applications yet</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-sm font-semibold text-white">
            Recent activity
          </p>
          <p className="text-xs text-slate-600">No activity yet</p>
        </div>
      </div>
    </motion.div>
  );
}

const previewMap: Record<TabId, React.ComponentType> = {
  portfolio: PortfolioPreview,
  resume: ResumePreview,
  certificates: CertificatesPreview,
  tracker: CareerTrackerPreview,
  analytics: AnalyticsPreview,
};

const urlMap: Record<TabId, string> = {
  portfolio: "skillbridge.app/jordanreyesdemo",
  resume: "skillbridge.app/jordan/resume",
  certificates: "skillbridge.app/jordan/certificates",
  tracker: "skillbridge.app/jordan/tracker",
  analytics: "skillbridge.app/jordan/analytics",
};

export default function ProductPreview() {
  const [active, setActive] = useState<TabId>("portfolio");
  const activeIndex = tabs.findIndex((t) => t.id === active);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === current);

        const nextIndex =
          currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;

        return tabs[nextIndex].id;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const ActivePanel = previewMap[active];

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(tabs.length - 1, index));
    setActive(tabs[clamped].id);
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goTo(activeIndex + 1);
    } else if (info.offset.x > swipeThreshold) {
      goTo(activeIndex - 1);
    }
  };

  return (
    <div className="relative mt-20 w-full max-w-4xl">
      {/* Active section label */}
      <div className="relative mb-4 flex justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="h-20 w-full max-w-md rounded-full bg-indigo-500/[0.08] blur-[60px]" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0f0f1a]/80 px-4 py-2 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-300"
            >
              {tabs[activeIndex].icon}
              {tabs[activeIndex].label}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-slate-600">
            {activeIndex + 1}/{tabs.length}
          </span>
        </div>
      </div>

      {/* Mock browser */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-indigo-500/[0.06] blur-[80px]"
        />
        <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f1a] p-1 shadow-2xl shadow-black/40">
          <div className="mb-3 flex items-center gap-2 px-3 pt-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <div className="ml-3 flex-1 rounded-md bg-white/[0.05] py-1 px-3">
              <span className="text-xs text-slate-600">{urlMap[active]}</span>
            </div>
          </div>
          <motion.div
            className="touch-pan-y cursor-grab overflow-hidden rounded-xl bg-[#0d0d18] active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            <div className="h-[420px] overflow-y-auto sm:h-[440px]">
              <AnimatePresence mode="wait">
                <ActivePanel key={active} />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        {/* Swipe dot indicators */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${tab.label}`}
              className={`h-1.5 rounded-full transition-all ${
                tab.id === active
                  ? "w-5 bg-indigo-400"
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f]" />
    </div>
  );
}
