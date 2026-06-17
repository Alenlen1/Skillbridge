"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import {
  IconFolder,
  IconFileText,
  IconCertificate,
  IconBriefcase,
  IconChartBar,
  IconSparkles,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";

const navItems = [
  {
    href: "/portfolio",
    icon: <IconFolder size={18} stroke={1.5} />,
    label: "Portfolio",
  },
  {
    href: "/resume",
    icon: <IconFileText size={18} stroke={1.5} />,
    label: "Resume",
  },
  {
    href: "/certificates",
    icon: <IconCertificate size={18} stroke={1.5} />,
    label: "Certificates",
  },
  {
    href: "/tracker",
    icon: <IconBriefcase size={18} stroke={1.5} />,
    label: "Tracker",
  },
  {
    href: "/analytics",
    icon: <IconChartBar size={18} stroke={1.5} />,
    label: "Analytics",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken, isLoading, refresh, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      refresh().then(() => {
        if (!useAuthStore.getState().accessToken) {
          router.push("/login");
        }
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-full w-56 flex-col border-r border-white/[0.06] bg-[#0a0a0f]">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-white/[0.06] px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500">
            <IconSparkles size={14} stroke={2} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">SkillBridge</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-400">
              {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-white">
                {user?.name || user?.username}
              </p>
              <p className="truncate text-xs text-slate-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <IconLogout size={18} stroke={1.5} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  );
}
