"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/auth";
import {
  IconFolder,
  IconFileText,
  IconCertificate,
  IconBriefcase,
  IconChartBar,
  IconSparkles,
  IconLogout,
  IconMenu2,
  IconX,
  IconSettings,
} from "@tabler/icons-react";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

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
  {
    href: "/settings",
    icon: <IconSettings size={18} stroke={1.5} />,
    label: "Settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, accessToken, isLoading, refresh, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      refresh().then(() => {
        if (!useAuthStore.getState().accessToken) {
          router.push("/login");
        }
      });
    }
  }, []);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-5">
        <Link href="/portfolio" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="SkillBridge"
            width={36}
            height={22}
            className="h-9 w-auto"
            priority
          />
          <span className="text-sm font-semibold text-white">SkillBridge</span>
        </Link>
        {/* Close button, mobile only */}
        <button
          onClick={() => setMobileNavOpen(false)}
          className="text-slate-500 hover:text-white md:hidden"
        >
          <IconX size={20} stroke={1.5} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-white"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-indigo-500" />
              )}
              <span className={isActive ? "text-indigo-400" : ""}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-medium text-white">
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
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] md:flex">
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4 md:hidden">
        <Link href="/portfolio" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500">
            <IconSparkles size={14} stroke={2} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">SkillBridge</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="text-slate-300 hover:text-white"
        >
          <IconMenu2 size={22} stroke={1.5} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[80vw] flex-col border-r border-white/[0.06] bg-[#0a0a0f] transition-transform duration-200 md:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-60 flex-col border-r border-white/[0.06] bg-[#0a0a0f] md:flex">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
          <EmailVerificationBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
