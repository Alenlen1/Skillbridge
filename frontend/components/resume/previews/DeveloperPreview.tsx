import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaCertificate,
} from "react-icons/fa";
import { ResumeData } from "../ResumeTypes";

interface Props {
  data: ResumeData;
}

export default function DeveloperPreview({ data }: Props) {
  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");

  const groupedSkills = data.skills.reduce<Record<string, typeof data.skills>>(
    (acc, skill) => {
      const category = skill.category || "Other";

      if (!acc[category]) acc[category] = [];

      acc[category].push(skill);

      return acc;
    },
    {},
  );

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="grid grid-cols-12">
        {/* Sidebar */}

        <aside className="col-span-4 bg-[#111827] p-8 text-white">
          <h1 className="text-3xl font-bold">{data.name}</h1>

          {data.headline && (
            <p className="mt-2 text-indigo-400 font-medium">{data.headline}</p>
          )}

          {data.about && (
            <p className="mt-6 text-sm leading-7 text-slate-300">
              {data.about}
            </p>
          )}

          {/* Contact */}

          <div className="mt-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-400">
              Contact
            </h2>

            <div className="space-y-3 text-sm">
              {!data.email.includes("@github.skillbridge.placeholder") &&
                data.email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-indigo-400" />
                    <span>{data.email}</span>
                  </div>
                )}

              {data.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="text-indigo-400" />
                  <span>{data.phone}</span>
                </div>
              )}

              {data.location && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-indigo-400" />
                  <span>{data.location}</span>
                </div>
              )}

              {data.website && (
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-indigo-400" />
                  <span>{data.website.replace(/^https?:\/\//, "")}</span>
                </div>
              )}

              {github && (
                <div className="flex items-center gap-3">
                  <FaGithub className="text-indigo-400" />
                  <span>{github.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </div>
              )}

              {linkedin && (
                <div className="flex items-center gap-3">
                  <FaLinkedin className="text-indigo-400" />
                  <span>
                    {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack */}

          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-400">
              <FaCode />
              Tech Stack
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Certificates */}

          {data.certificates.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-400">
                <FaCertificate />
                Certifications
              </h2>

              <div className="space-y-4">
                {data.certificates.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-sm font-medium">{cert.title}</p>

                    <p className="text-xs text-slate-400">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}

        <main className="col-span-8 space-y-10 p-10">
          {/* Experience — developers lead with this */}

          {data.experience.length > 0 && (
            <section>
              <h2 className="mb-5 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
                Experience
              </h2>

              <div className="space-y-8">
                {data.experience.map((exp) => {
                  const meta = [exp.employmentType, exp.location]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div
                      key={exp.id}
                      className="relative border-l-2 border-indigo-300 pl-6"
                    >
                      <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-indigo-500"></div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{exp.role}</h3>

                        <span className="text-sm text-slate-500">
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )
                            : ""}
                          {" – "}
                          {exp.current
                            ? "Present"
                            : exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )
                              : ""}
                        </span>
                      </div>

                      <p className="font-medium text-indigo-600">
                        {exp.company}
                      </p>

                      {meta && <p className="text-sm text-slate-500">{meta}</p>}

                      {exp.description && (
                        <p className="mt-3 leading-7 text-slate-600">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Featured Projects */}

          {data.projects.length > 0 && (
            <section>
              <h2 className="mb-5 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
                Featured Projects
              </h2>

              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-400 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold">{project.title}</h3>

                    {project.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {project.description}
                      </p>
                    )}

                    {project.techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <FaGithub />
                        View Repository
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}

          {data.education.length > 0 && (
            <section>
              <h2 className="mb-5 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
                Education
              </h2>

              <div className="space-y-8">
                {data.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="relative border-l-2 border-indigo-300 pl-6"
                  >
                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-indigo-500" />

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{edu.school}</h3>

                      <span className="text-sm text-slate-500">
                        {edu.startYear}

                        {" - "}

                        {edu.current ? "Present" : edu.endYear}
                      </span>
                    </div>

                    {edu.degree && (
                      <p className="text-indigo-600">
                        {edu.degree}
                        {edu.field && ` • ${edu.field}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Skills */}

          {Object.keys(groupedSkills).length > 0 && (
            <section>
              <h2 className="mb-5 border-b pb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
                Skills
              </h2>

              <div className="space-y-6">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="mb-3 font-semibold text-slate-700">
                      {category}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
