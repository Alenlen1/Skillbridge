"use client";

import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import type { ResumeData } from "./ResumeDocument";

export default function ResumeDownloadButton({
  data,
  fileName,
}: {
  data: ResumeData;
  fileName: string;
}) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setGenerating(true);

      // Dynamic imports keep react-pdf out of the server bundle entirely
      const { pdf } = await import("@react-pdf/renderer");
      const { default: ResumeDocument } = await import("./ResumeDocument");

      const blob = await pdf(<ResumeDocument data={data} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <IconDownload size={15} stroke={2} />
      {generating ? "Generating..." : "Download PDF"}
    </button>
  );
}
