"use client";

import { motion } from "framer-motion";
import { IconShieldCheck } from "@tabler/icons-react";
export default function CertificatesPreview() {
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
