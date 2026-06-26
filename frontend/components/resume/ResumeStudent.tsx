import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";

const INDIGO = "#6366f1";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
  },
  header: {
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    marginBottom: 2,
  },
  headline: {
    fontSize: 12,
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 9,
    color: "#555555",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: INDIGO,
    marginTop: 10,
    marginBottom: 12,
  },
  thinDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#dddddd",
    marginBottom: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  entryDate: {
    fontSize: 9,
    color: "#777777",
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: "#444444",
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 9,
    color: "#444444",
    lineHeight: 1.5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 3,
  },
  tag: {
    fontSize: 8,
    color: INDIGO,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  certTag: {
    fontSize: 8,
    color: "#444444",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  skillTag: {
    fontSize: 8.5,
    color: "#333333",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 3,
  },
});

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ResumeStudent({ data }: { data: ResumeData }) {
  const linkedin = data.socialLinks.find((l) => l.platform === "LinkedIn");
  const github = data.socialLinks.find((l) => l.platform === "GitHub");

  const contactItems = [
    data.email,
    data.phone,
    data.location,
    data.website?.replace(/^https?:\/\//, ""),
    linkedin ? linkedin.url.replace(/^https?:\/\/(www\.)?/, "") : null,
    github ? github.url.replace(/^https?:\/\/(www\.)?/, "") : null,
    `skillbridge.app/${data.username}`,
  ].filter(Boolean) as string[];

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
            {contactItems.map((item, i) => (
              <Text key={i}>{item}</Text>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        {data.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.thinDivider} />
            <Text style={styles.entryDescription}>{data.about}</Text>
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.thinDivider} />
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
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.thinDivider} />
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

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.thinDivider} />
            <View style={styles.tagRow}>
              {data.certificates.map((cert) => (
                <Text key={cert.id} style={styles.certTag}>
                  {cert.title} – {cert.issuer}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.thinDivider} />
            <View style={styles.skillRow}>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillTag}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.thinDivider} />
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
                  <Text style={styles.entryDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
