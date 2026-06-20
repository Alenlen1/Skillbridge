"use client";

import { useState, useEffect } from "react";
import { IconFileText } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import ResumeDownloadButton from "@/components/resume/ResumeDownloadButton";
import type { ResumeData } from "@/components/resume/ResumeDocument";

interface PortfolioResponse {
  about: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  skills: ResumeData["skills"];
  education: ResumeData["education"];
  experience: ResumeData["experience"];
  projects: ResumeData["projects"];
}

export default function ResumePage() {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setPortfolio(data.data);
    } catch {
      setError("Failed to load your portfolio data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  if (error || !portfolio || !user) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error || "Something went wrong loading your data"}
      </div>
    );
  }

  const resumeData: ResumeData = {
    name: user.name || user.username,
    username: user.username,
    email: user.email,
    headline: portfolio.headline,
    about: portfolio.about,
    location: portfolio.location,
    website: portfolio.website,
    skills: portfolio.skills,
    education: portfolio.education,
    experience: portfolio.experience,
    projects: portfolio.projects,
  };

  const isEmpty =
    !portfolio.about &&
    portfolio.skills.length === 0 &&
    portfolio.education.length === 0 &&
    portfolio.experience.length === 0 &&
    portfolio.projects.length === 0;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Resume</h1>
          <p className="mt-1 text-sm text-slate-400">
            Generated automatically from your portfolio data
          </p>
        </div>

        {!isEmpty && (
          <ResumeDownloadButton
            data={resumeData}
            fileName={`${user.username}-resume.pdf`}
          />
        )}
      </div>

      {isEmpty ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10">
          <IconFileText size={32} stroke={1} className="mb-3 text-slate-700" />
          <p className="text-sm text-slate-600">
            Your portfolio is empty — add skills, projects, or experience first
          </p>
          <a
            href="/portfolio"
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Go to Portfolio →
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white p-8 text-black shadow-2xl">
            <h2 className="text-2xl font-bold">{resumeData.name}</h2>
            {resumeData.headline && (
              <p className="mt-1 text-sm text-gray-600">
                {resumeData.headline}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-500">
              <span>{resumeData.email}</span>
              {resumeData.location && <span>{resumeData.location}</span>}
              <span>skillbridge.app/{resumeData.username}</span>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              {resumeData.about && (
                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    About
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {resumeData.about}
                  </p>
                </div>
              )}

              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-semibold">{exp.role}</p>
                          <p className="text-xs text-gray-500">
                            {exp.current ? "Present" : ""}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Projects
                  </h3>
                  <div className="space-y-3">
                    {resumeData.projects.map((p) => (
                      <div key={p.id}>
                        <p className="text-sm font-semibold">{p.title}</p>
                        {p.description && (
                          <p className="text-xs text-gray-600">
                            {p.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Education
                  </h3>
                  <div className="space-y-2">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id}>
                        <p className="text-sm font-semibold">{edu.school}</p>
                        {edu.degree && (
                          <p className="text-xs text-gray-600">
                            {edu.degree} {edu.field && `· ${edu.field}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Skills
                  </h3>
                  <p className="text-sm text-gray-700">
                    {resumeData.skills.map((s) => s.name).join("  ·  ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-600">
            This is a simplified preview — the downloaded PDF will be fully
            formatted
          </p>
        </div>
      )}
    </div>
  );
}
