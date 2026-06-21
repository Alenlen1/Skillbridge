"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    try {
      setError("");
      await api.post("/auth/forgot-password", values);
      setSent(true);
    } catch {
      // Backend always returns success for this endpoint to avoid leaking
      // which emails are registered, so this only triggers on network errors.
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="SkillBridge"
            width={36}
            height={22}
            className="mb-3 inline-block h-9 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold text-white">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-sm text-slate-300">
              If an account exists with that email, a reset link is on its way.
              Check your inbox (and spam folder).
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300"
            >
              ← Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="alen@example.com"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>

            <p className="text-center text-sm text-slate-500">
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300"
              >
                ← Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
