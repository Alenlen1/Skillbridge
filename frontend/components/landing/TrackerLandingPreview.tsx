"use client";

import { motion } from "framer-motion";
import { IconShieldCheck } from "@tabler/icons-react";
export default function TrackerLandingPreview() {
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
