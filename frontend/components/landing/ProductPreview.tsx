"use client";

import {  useState } from "react";
import {
  IconBriefcase,
  IconCertificate,
  IconChartBar,
  IconFileText,
  IconFolder,
  IconRobot,
} from "@tabler/icons-react";

import BrowserMockup from "./BrowserMockup";
import PortfolioLandingPreview from "./PortfolioLandingPreview";
import ResumeLandingPreview from "./ResumeLandingPreview";
import CertificateLandingPreview from "./CertificateLandingPreview";
import TrackerLandingPreview from "./TrackerLandingPreview";
import AnalyticsLandingPreview from "./AnalyticsLandingPreview";
import AIAssistantLandingPreview from "./AiAssistantLandingPreview";

type TabId =
  | "portfolio"
  | "resume"
  | "certificates"
  | "tracker"
  | "analytics"
  | "ai";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  url: string;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    icon: <IconFolder size={16} stroke={1.75} />,
    url: "skillbridge.app/jordanreyesdemo",
    component: PortfolioLandingPreview,
  },
  {
    id: "resume",
    label: "Resume",
    icon: <IconFileText size={16} stroke={1.75} />,
    url: "skillbridge.app/jordan/resume",
    component: ResumeLandingPreview,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: <IconCertificate size={16} stroke={1.75} />,
    url: "skillbridge.app/jordan/certificates",
    component: CertificateLandingPreview,
  },
  {
    id: "tracker",
    label: "Career Tracker",
    icon: <IconBriefcase size={16} stroke={1.75} />,
    url: "skillbridge.app/jordan/tracker",
    component: TrackerLandingPreview,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <IconChartBar size={16} stroke={1.75} />,
    url: "skillbridge.app/jordan/analytics",
    component: AnalyticsLandingPreview,
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: <IconRobot size={16} stroke={1.75} />,
    url: "skillbridge.app/jordan/ai-assistant",
    component: AIAssistantLandingPreview,
  },
];

export default function ProductPreview() {
  const [active, setActive] = useState<TabId>("portfolio");

  const activeIndex = tabs.findIndex((tab) => tab.id === active);


  const currentTab = tabs[activeIndex];
  const ActivePanel = currentTab.component;

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(tabs.length - 1, index));
    setActive(tabs[clamped].id);
  
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (info.offset.x < -50) goTo(activeIndex + 1);
    else if (info.offset.x > 50) goTo(activeIndex - 1);
  };

  return (
    <div className="relative mt-20 w-full max-w-5xl">
      {/* Active tab label */}
      <div className="relative mb-4 flex justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="h-20 w-full max-w-md rounded-full bg-indigo-500/10 blur-[60px]" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0f0f1a]/80 px-4 py-2 backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-300">
            {currentTab.icon}
            {currentTab.label}
          </span>
          <span className="text-xs text-slate-600">
            {activeIndex + 1}/{tabs.length}
          </span>
        </div>
      </div>

      <BrowserMockup
        active={active}
        activeIndex={activeIndex}
        tabs={tabs}
        url={currentTab.url}
        ActivePanel={ActivePanel}
        goTo={goTo}
        handleDragEnd={handleDragEnd}
      />
    </div>
  );
}
