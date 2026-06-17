import { notFound } from "next/navigation";

interface Portfolio {
  about: string | null;
  location: string | null;
  website: string | null;
  accentColor: string;
  skills: { id: string; name: string; category: string | null }[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    techStack: string[];
    liveUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
  }[];
  education: {
    id: string;
    school: string;
    degree: string | null;
    field: string | null;
    startYear: number | null;
    endYear: number | null;
    current: boolean;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string | null;
    endDate: string | null;
    current: boolean;
    description: string | null;
  }[];
}

interface User {
  name: string | null;
  username: string;
  avatar: string | null;
  bio: string | null;
  portfolio: Portfolio | null;
}

async function getUser(username: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/portfolio/${username}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user || !user.portfolio) notFound();

  const { portfolio } = user;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-semibold text-indigo-400">
            {user.name?.charAt(0) || user.username.charAt(0)}
          </div>
          <h1 className="text-3xl font-semibold text-white">
            {user.name || user.username}
          </h1>
          <p className="mt-1 text-slate-400">@{user.username}</p>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
            {portfolio.location && <span>{portfolio.location}</span>}
            {portfolio.website && (
              <a
                href={portfolio.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                {portfolio.website.replace("https://", "")}
              </a>
            )}
          </div>

          {portfolio.about && (
            <p className="mt-4 leading-relaxed text-slate-300">
              {portfolio.about}
            </p>
          )}
        </div>

        {portfolio.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-slate-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {portfolio.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Projects</h2>
            <div className="space-y-4">
              {portfolio.projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="font-medium text-white">{project.title}</h3>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 transition hover:text-white"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 transition hover:text-indigo-300"
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mb-3 text-sm text-slate-400">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.education.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Education</h2>
            <div className="space-y-4">
              {portfolio.education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <h3 className="font-medium text-white">{edu.school}</h3>
                  {edu.degree && (
                    <p className="mt-1 text-sm text-slate-400">
                      {edu.degree} {edu.field && `· ${edu.field}`}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-600">
                    {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Experience
            </h2>
            <div className="space-y-4">
              {portfolio.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <h3 className="font-medium text-white">{exp.role}</h3>
                  <p className="mt-1 text-sm text-slate-400">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-slate-500">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs text-slate-600">
            Built with{" "}
            <a href="/" className="text-indigo-400 hover:text-indigo-300">
              SkillBridge
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
