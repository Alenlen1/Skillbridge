import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { ResumeData } from "./ResumeTypes";

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
    textAlign: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headline: {
    fontSize: 10,
    color: "#444444",
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 9,
    color: "#555555",
    gap: 8,
  },
  contactSep: {
    color: "#aaaaaa",
    marginHorizontal: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
    marginTop: 10,
    marginBottom: 10,
  },
  thinDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    marginTop: 6,
    marginBottom: 8,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  entry: {
    marginBottom: 7,
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
    color: "#555555",
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: "#333333",
    marginBottom: 2,
  },
  entryDescription: {
    fontSize: 9,
    color: "#444444",
    lineHeight: 1.5,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  skillLabel: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    width: 70,
    color: "#111111",
  },
  skillValue: {
    fontSize: 9.5,
    color: "#333333",
    flex: 1,
  },
  certItem: {
    fontSize: 9.5,
    color: "#333333",
    marginBottom: 2,
  },
});

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ResumeATS({ data }: { data: ResumeData }) {
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
              <View key={i} style={{ flexDirection: "row" }}>
                {i > 0 && <Text style={styles.contactSep}>|</Text>}
                <Text>{item}</Text>
              </View>
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

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.thinDivider} />
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.role} — {exp.company}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </Text>
                </View>
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
            <View style={styles.thinDivider} />
            {data.projects.map((p) => (
              <View key={p.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{p.title}</Text>
                {p.description && (
                  <Text style={styles.entryDescription}>{p.description}</Text>
                )}
                {p.techStack.length > 0 && (
                  <Text style={[styles.entryDescription, { color: "#555555" }]}>
                    Tech: {p.techStack.join(", ")}
                  </Text>
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

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.thinDivider} />
            {Object.entries(skillsByCategory).map(([cat, skills]) => (
              <View key={cat} style={styles.skillRow}>
                <Text style={styles.skillLabel}>{cat}:</Text>
                <Text style={styles.skillValue}>{skills.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.thinDivider} />
            {data.certificates.map((cert) => (
              <Text key={cert.id} style={styles.certItem}>
                • {cert.title} — {cert.issuer}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
