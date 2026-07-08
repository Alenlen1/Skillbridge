"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/auth";
import api from "@/lib/api";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import EducationSection from "@/components/portfolio/EducationSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import GithubSection from "@/components/portfolio/GithubSection";
import SocialLinksSection from "@/components/portfolio/SocialLinksSection";
import EndorsementsSection from "@/components/portfolio/EndorsementsSection";

const schema = z.object({
  about: z.string().max(500, "Max 500 characters").optional(),
  location: z.string().max(100).optional(),
  headline: z.string().max(100).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
});

type FormData = z.infer<typeof schema>;

const DRAFT_KEY = "skillbridge-portfolio-draft";
// Resets to false on a real page refresh (whole JS bundle re-executes),
// stays true across SPA navigation within the same page load.
let hasCheckedThisPageLoad = false;

export default function PortfolioPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftData, setDraftData] = useState<FormData | null>(null);
  const [serverData, setServerData] = useState<FormData>({
    about: "",
    headline: "",
    location: "",
    website: "",
    phone: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Auto-save the form to localStorage as the user types (debounced)
  useEffect(() => {
    const subscription = watch((values) => {
      const timer = setTimeout(() => {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ values, savedAt: Date.now() }),
        );
      }, 800);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await api.get("/portfolio/me");

        const portfolio = res.data.data;
        const serverValues: FormData = {
          about: portfolio.about ?? "",
          headline: portfolio.headline ?? "",
          location: portfolio.location ?? "",
          website: portfolio.website ?? "",
          phone: portfolio.phone ?? "",
        };

        const alreadyChecked = hasCheckedThisPageLoad;

        setServerData(serverValues);

        const rawDraft = localStorage.getItem(DRAFT_KEY);
        let draftValues: FormData | null = null;

        if (rawDraft) {
          try {
            const parsed = JSON.parse(rawDraft) as {
              values: FormData;
              savedAt: number;
            };
            const isDifferent =
              JSON.stringify(parsed.values) !== JSON.stringify(serverValues);
            if (isDifferent) {
              draftValues = parsed.values;
            } else {
              localStorage.removeItem(DRAFT_KEY);
            }
          } catch {
            localStorage.removeItem(DRAFT_KEY);
          }
        }

        if (draftValues) {
          if (alreadyChecked) {
            // Same page load, just navigated within the app —
            // silently keep showing their unsaved edits, no need to ask.
            reset(draftValues);
          } else {
            // Real refresh, crash, or reopened tab — ask first.
            setDraftData(draftValues);
            setShowDraftBanner(true);
            reset(serverValues);
          }
        } else {
          reset(serverValues);
        }

        hasCheckedThisPageLoad = true;
      } catch (err) {
        console.error(err);
      }
    };

    loadPortfolio();
  }, [reset]);

  const handleRestoreDraft = () => {
    if (draftData) {
      reset(draftData);
    }
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
    setDraftData(null);
    reset(serverData);
  };

  const onSubmit = async (values: FormData) => {
    try {
      setError("");
      await api.put("/portfolio/me", values);
      localStorage.removeItem(DRAFT_KEY);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(e.response?.data?.error?.message || "Something went wrong");
    }
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Portfolio
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your public profile is live at{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL}/${user?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 underline hover:text-indigo-300"
          >
            {process.env.NEXT_PUBLIC_APP_URL}/{user?.username}
          </a>
        </p>
      </div>

      {showDraftBanner && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm">
          <p className="text-amber-400">
            We found unsaved changes from your last session — restore them?
          </p>
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-400"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="rounded-md border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/10"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            About
          </label>
          <textarea
            {...register("about")}
            rows={4}
            placeholder="Tell recruiters about yourself, your goals, and what you're working on..."
            className="w-full resize-none rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {errors.about?.message && (
            <p className="mt-1 text-xs text-red-400">{errors.about.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Headline
          </label>
          <input
            {...register("headline")}
            type="text"
            placeholder="e.g. Sophomore IT Student : Full-Stack Developer"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Location
          </label>
          <input
            {...register("location")}
            type="text"
            placeholder="Manila, Philippines"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {errors.location?.message && (
            <p className="mt-1 text-xs text-red-400">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Website
          </label>
          <input
            {...register("website")}
            type="text"
            placeholder="https://yourwebsite.com"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {errors.website?.message && (
            <p className="mt-1 text-xs text-red-400">
              {errors.website.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone number
          </label>
          <input
            {...register("phone")}
            type="text"
            placeholder="+63 912 345 6789"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {errors.phone?.message && (
            <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          {saved && (
            <p className="text-sm text-green-400">Saved successfully</p>
          )}
        </div>
      </form>
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <ExperienceSection />
      <GithubSection />
      <SocialLinksSection />
      <EndorsementsSection />
    </div>
  );
}
