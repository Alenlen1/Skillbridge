"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconBriefcase,
  IconChartBar,
  IconEye,
  IconTrendingUp,
} from "@tabler/icons-react";
export default function AnalyticsLandingPreview() {
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
