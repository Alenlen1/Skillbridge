"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

interface Skill {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
}

interface Education {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startYear: number | null;
  endYear: number | null;
  current: boolean;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface ResumeData {
  name: string;
  username: string;
  email: string;
  headline: string | null;
  about: string | null;
  location: string | null;
  website: string | null;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 45,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    color: "#444444",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 9,
    color: "#555555",
  },
  contactItem: {
    marginRight: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    marginTop: 10,
    marginBottom: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#4338ca",
    marginBottom: 8,
  },
  about: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333333",
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: "#444444",
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 9,
    color: "#777777",
  },
  entryDescription: {
    fontSize: 9.5,
    color: "#444444",
    lineHeight: 1.4,
    marginTop: 2,
  },
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  techTag: {
    fontSize: 8,
    color: "#4338ca",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  skillsByCategory: {
    marginBottom: 6,
  },
  skillCategoryLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#555555",
    marginBottom: 3,
  },
  skillList: {
    fontSize: 9.5,
    color: "#333333",
    lineHeight: 1.4,
  },
  link: {
    color: "#4338ca",
    textDecoration: "none",
  },
  projectLinks: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
});

function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ResumeDocument({ data }: { data: ResumeData }) {
  const skillsByCategory = data.skills.reduce<Record<string, Skill[]>>(
    (acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {},
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          {data.headline && (
            <Text style={styles.headline}>{data.headline}</Text>
          )}
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{data.email}</Text>
            {data.location && (
              <Text style={styles.contactItem}>{data.location}</Text>
            )}
            {data.website && (
              <Link src={data.website} style={styles.link}>
                <Text style={styles.contactItem}>
                  {data.website.replace(/^https?:\/\//, "")}
                </Text>
              </Link>
            )}
            <Text style={styles.contactItem}>
              skillbridge.app/{data.username}
            </Text>
          </View>
          <View style={styles.divider} />
        </View>

        {/* About */}
        {data.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.about}>{data.about}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.role}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                {exp.description && (
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project) => (
              <View key={project.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{project.title}</Text>
                {project.description && (
                  <Text style={styles.entryDescription}>
                    {project.description}
                  </Text>
                )}
                {project.techStack.length > 0 && (
                  <View style={styles.techRow}>
                    {project.techStack.map((tech) => (
                      <Text key={tech} style={styles.techTag}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.projectLinks}>
                  {project.githubUrl && (
                    <Link src={project.githubUrl} style={styles.link}>
                      <Text style={{ fontSize: 8.5 }}>GitHub</Text>
                    </Link>
                  )}
                  {project.liveUrl && (
                    <Link src={project.liveUrl} style={styles.link}>
                      <Text style={{ fontSize: 8.5 }}>Live Demo</Text>
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.school}</Text>
                  <Text style={styles.entryDate}>
                    {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                  </Text>
                </View>
                {edu.degree && (
                  <Text style={styles.entrySubtitle}>
                    {edu.degree}
                    {edu.field && ` · ${edu.field}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <View key={category} style={styles.skillsByCategory}>
                <Text style={styles.skillCategoryLabel}>{category}</Text>
                <Text style={styles.skillList}>
                  {skills.map((s) => s.name).join("  ·  ")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
