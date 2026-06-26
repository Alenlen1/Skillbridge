import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";

const INDIGO = "#6366f1";
const SIDEBAR_BG = "#0f0f1a";
const SIDEBAR_WIDTH = 180;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
  },
  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
    padding: 20,
    minHeight: "100%",
  },
  sidebarName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  sidebarHeadline: {
    fontSize: 8.5,
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  sidebarAbout: {
    fontSize: 8,
    color: "#aaaaaa",
    lineHeight: 1.5,
    marginBottom: 14,
  },
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarSectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sidebarContactItem: {
    fontSize: 7.5,
    color: "#cccccc",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  sidebarTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  sidebarTag: {
    fontSize: 7.5,
    color: "#cccccc",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 3,
  },
  sidebarCertItem: {
    fontSize: 7.5,
    color: "#cccccc",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  // Main content
  main: {
    flex: 1,
    padding: 24,
    paddingLeft: 20,
  },
  mainSection: {
    marginBottom: 14,
  },
  mainSectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  mainDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 8,
  },
  entry: {
    marginBottom: 9,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
  },
  entryDate: {
    fontSize: 8.5,
    color: "#777777",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 8.5,
    color: "#444444",
    lineHeight: 1.5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 3,
  },
  tag: {
    fontSize: 7.5,
    color: INDIGO,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
  },
  projectLink: {
    fontSize: 8,
    color: INDIGO,
    marginTop: 2,
  },
});

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ResumeDeveloper({ data }: { data: ResumeData }) {
  const skillsByCategory = data.skills.reduce<Record<string, string[]>>(
    (acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill.name);
      return acc;
    },
    {},
  );

  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");
  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.name}</Text>
          {data.headline && (
            <Text style={styles.sidebarHeadline}>{data.headline}</Text>
          )}
          {data.about && <Text style={styles.sidebarAbout}>{data.about}</Text>}

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            {data.email && (
              <Text style={styles.sidebarContactItem}>{data.email}</Text>
            )}
            {data.phone && (
              <Text style={styles.sidebarContactItem}>{data.phone}</Text>
            )}
            {data.location && (
              <Text style={styles.sidebarContactItem}>{data.location}</Text>
            )}
            {data.website && (
              <Text style={styles.sidebarContactItem}>
                {data.website.replace(/^https?:\/\//, "")}
              </Text>
            )}
            {linkedin && (
              <Text style={styles.sidebarContactItem}>
                {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
              </Text>
            )}
            {github && (
              <Text style={styles.sidebarContactItem}>
                {github.url.replace(/^https?:\/\/(www\.)?/, "")}
              </Text>
            )}
            <Text style={styles.sidebarContactItem}>
              skillbridge.app/{data.username}
            </Text>
          </View>

          {/* Tech stack */}
          {data.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Tech Stack</Text>
              <View style={styles.sidebarTagRow}>
                {data.skills.map((skill) => (
                  <Text key={skill.id} style={styles.sidebarTag}>
                    {skill.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {data.certificates.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Certifications</Text>
              {data.certificates.map((cert) => (
                <Text key={cert.id} style={styles.sidebarCertItem}>
                  {cert.title}
                  {"\n"}
                  <Text style={{ color: "#888888" }}>{cert.issuer}</Text>
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={styles.main}>
          {/* Featured Projects */}
          {data.projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Featured Projects</Text>
              <View style={styles.mainDivider} />
              {data.projects.map((p) => (
                <View key={p.id} style={styles.entry}>
                  <Text style={styles.entryTitle}>{p.title}</Text>
                  {p.description && (
                    <Text style={styles.entryDescription}>{p.description}</Text>
                  )}
                  {p.techStack.length > 0 && (
                    <View style={styles.tagRow}>
                      {p.techStack.map((tech) => (
                        <Text key={tech} style={styles.tag}>
                          {tech}
                        </Text>
                      ))}
                    </View>
                  )}
                  {p.githubUrl && (
                    <Text style={styles.projectLink}>{p.githubUrl}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              <View style={styles.mainDivider} />
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{exp.role}</Text>
                    <Text style={styles.entryDate}>
                      {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{exp.company}</Text>
                  {exp.description && (
                    <Text style={styles.entryDescription}>
                      {exp.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Education</Text>
              <View style={styles.mainDivider} />
              {data.education.map((edu) => (
                <View key={edu.id} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{edu.school}</Text>
                    <Text style={styles.entryDate}>
                      {edu.startYear} – {edu.current ? "Present" : edu.endYear}
                    </Text>
                  </View>
                  {edu.degree && (
                    <Text style={styles.entrySubtitle}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Skills by category */}
          {Object.keys(skillsByCategory).length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Skills</Text>
              <View style={styles.mainDivider} />
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <View key={cat} style={{ marginBottom: 5 }}>
                  <Text
                    style={[
                      styles.entrySubtitle,
                      { fontFamily: "Helvetica-Bold" },
                    ]}
                  >
                    {cat}
                  </Text>
                  <View style={styles.tagRow}>
                    {skills.map((s) => (
                      <Text key={s} style={styles.tag}>
                        {s}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
