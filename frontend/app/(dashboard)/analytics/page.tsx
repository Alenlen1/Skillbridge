"use client";

import { useState, useEffect } from "react";
import {
  IconEye,
  IconBriefcase,
  IconChartBar,
  IconTrendingUp,
} from "@tabler/icons-react";
import api from "@/lib/api";

interface AnalyticsEvent {
  id: string;
  type: string;
  createdAt: string;
}

interface AnalyticsData {
  portfolioViews: number;
  totalEvents: number;
  recentEvents: AnalyticsEvent[];
  applicationStats: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-500",
  Screening: "bg-yellow-500",
  Interview: "bg-purple-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

const DEFAULT_DATA: AnalyticsData = {
  portfolioViews: 0,
  totalEvents: 0,
  recentEvents: [],
  applicationStats: {},
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: res } = await api.get("/analytics");
      setData({
        portfolioViews: res.data?.portfolioViews ?? 0,
        totalEvents: res.data?.totalEvents ?? 0,
        recentEvents: Array.isArray(res.data?.recentEvents)
          ? res.data.recentEvents
          : [],
        applicationStats: res.data?.applicationStats ?? {},
      });
    } catch {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const totalApplications = Object.values(data.applicationStats).reduce(
    (a, b) => a + b,
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track your portfolio performance and application progress
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <IconEye size={18} stroke={1.5} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-semibold text-white">
            {data.portfolioViews}
          </p>
          <p className="mt-1 text-sm text-slate-500">Portfolio views</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <IconBriefcase size={18} stroke={1.5} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-semibold text-white">
            {totalApplications}
          </p>
          <p className="mt-1 text-sm text-slate-500">Total applications</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <IconChartBar size={18} stroke={1.5} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-semibold text-white">
            {data.applicationStats["Interview"] ?? 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">Interviews</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <IconTrendingUp
              size={18}
              stroke={1.5}
              className="text-indigo-400"
            />
          </div>
          <p className="text-2xl font-semibold text-white">
            {data.applicationStats["Offer"] ?? 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">Offers received</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Application breakdown */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-6 text-sm font-semibold text-white">
            Application breakdown
          </h2>
          {totalApplications === 0 ? (
            <p className="text-sm text-slate-600">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(data.applicationStats).map(([status, count]) => (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{status}</span>
                    <span className="text-sm font-medium text-white">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
                    <div
                      className={`h-1.5 rounded-full ${STATUS_COLORS[status] ?? "bg-indigo-500"}`}
                      style={{
                        width: `${Math.round((count / totalApplications) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-6 text-sm font-semibold text-white">
            Recent activity
          </h2>
          {data.recentEvents.length === 0 ? (
            <p className="text-sm text-slate-600">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-400">{event.type}</span>
                  <span className="text-xs text-slate-600">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
