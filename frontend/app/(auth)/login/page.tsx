"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const clearAuthSession = () => {
      localStorage.removeItem("accessToken");
      try {
        setAuth(null as any, null as any);
      } catch (e) {
        setAuth({ id: "", email: "", username: "" } as any, "");
      }
    };

    clearAuthSession();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        clearAuthSession();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [setAuth]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      setError("");
      const { data } = await api.post("/auth/login", values);
      setAuth(data.data.user, data.data.accessToken);
      router.push("/portfolio");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Invalid email or password",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 transition hover:bg-indigo-400"
          >
            <span className="text-lg font-bold text-white">S</span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="alen@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Your password"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-xs text-slate-600 transition hover:text-slate-400"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
