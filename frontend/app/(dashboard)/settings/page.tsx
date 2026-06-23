"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setAuth, logout } = useAuthStore();

  // Profile (name) state
  const [name, setName] = useState(user?.name || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Username state
  const [username, setUsername] = useState(user?.username || "");
  const [savedUsername, setSavedUsername] = useState(user?.username || "");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [copied, setCopied] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Visibility state
  const [isPublic, setIsPublic] = useState(true);
  const [visibilityLoading, setVisibilityLoading] = useState(true);
  const [visibilitySaving, setVisibilitySaving] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchVisibility();
  }, []);

  const fetchVisibility = async () => {
    try {
      const { data } = await api.get("/portfolio/me");
      setIsPublic(data.data.isPublic);
    } catch {
      // Silently fail, defaults stay as-is
    } finally {
      setVisibilityLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (name.trim().length < 2) {
      setProfileError("Name must be at least 2 characters");
      return;
    }
    try {
      setProfileError("");
      setProfileSaving(true);
      const { data } = await api.patch("/settings/profile", {
        name: name.trim(),
      });
      if (user) {
        setAuth(data.data, localStorage.getItem("accessToken") || "");
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      setProfileError("Failed to update name");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUsernameSave = async () => {
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      setUsernameError("Username must be 3-20 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only letters, numbers, and underscores allowed");
      return;
    }

    try {
      setUsernameError("");
      setUsernameSaving(true);
      const { data } = await api.patch("/settings/username", {
        username: trimmed,
      });
      if (user) {
        setAuth(data.data, localStorage.getItem("accessToken") || "");
      }

      // The username changing means the public portfolio URL changed too,
      // so throw away the cached page for the old AND new username.
      fetch("/api/revalidate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      }).catch(() => {});

      setUsernameSaved(true);
      setSavedUsername(trimmed);
      setTimeout(() => setUsernameSaved(false), 3000);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setUsernameError(
        e.response?.data?.error?.message || "Failed to update username",
      );
    } finally {
      setUsernameSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordSaving(true);
      await api.patch("/settings/password", { currentPassword, newPassword });
      await logout();
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setPasswordError(
        e.response?.data?.error?.message || "Failed to update password",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleVisibilityToggle = async () => {
    const newValue = !isPublic;
    try {
      setVisibilitySaving(true);
      await api.patch("/settings/visibility", { isPublic: newValue });
      setIsPublic(newValue);

      if (user?.username) {
        fetch("/api/revalidate-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username }),
        }).catch(() => {});
      }
    } catch {
      // Revert on failure
    } finally {
      setVisibilitySaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }
    if (deleteConfirmText !== user?.email) {
      setDeleteError("Email does not match your account");
      return;
    }

    try {
      setDeleting(true);
      await api.delete("/settings/account", {
        data: { password: deletePassword },
      });
      localStorage.removeItem("accessToken");
      router.push("/");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: { message?: string } } };
      };
      setDeleteError(
        e.response?.data?.error?.message || "Failed to delete account",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account and portfolio preferences
        </p>
      </div>

      {/* Profile section */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-1 text-sm font-semibold text-white">Profile</h2>
        <p className="mb-5 text-sm text-slate-500">Update your display name</p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {profileError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {profileError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleProfileSave}
              disabled={profileSaving}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Save name"}
            </button>
            {profileSaved && (
              <p className="flex items-center gap-1 text-sm text-green-400">
                <IconCheck size={14} stroke={2} />
                Saved
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Username section */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-1 text-sm font-semibold text-white">Username</h2>
        <p className="mb-5 text-sm text-slate-500">
          This changes your public portfolio URL — share the new link after
          saving
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Username
            </label>
            <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 transition focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <span className="text-sm text-slate-600">skillbridge.app/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
            </div>
            {username !== savedUsername && (
              <p className="mt-2 text-xs text-amber-400">Unsaved changes</p>
            )}
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs text-slate-500">Your portfolio:</p>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="truncate text-sm text-slate-300">
                {window.location.origin}/{savedUsername}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={handleUsernameSave}
                disabled={usernameSaving}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {usernameSaving ? "Saving..." : "Save Username"}
              </button>

              <button
                type="button"
                onClick={() =>
                  window.open(
                    `${window.location.origin}/${savedUsername}`,
                    "_blank",
                  )
                }
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                View Portfolio ↗
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${username}`,
                  );

                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Copy Link
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-xs text-green-400">
                ✓ Portfolio link copied
              </p>
            )}
          </div>

          {usernameError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {usernameError}
            </div>
          )}

          <div className="flex items-center gap-3">
            {usernameSaved && (
              <p className="flex items-center gap-1 text-sm text-green-400">
                <IconCheck size={14} stroke={2} />
                Saved
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Visibility section */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-1 text-sm font-semibold text-white">
          Portfolio visibility
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Control whether your portfolio can be viewed publicly
        </p>

        {visibilityLoading ? (
          <div className="h-9 w-32 animate-pulse rounded-lg bg-white/[0.05]" />
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-xs text-slate-500">
                {isPublic
                  ? "Anyone with your link can view your portfolio"
                  : "Your portfolio is hidden from public view"}
              </p>
            </div>
            <button
              onClick={handleVisibilityToggle}
              disabled={visibilitySaving}
              className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                isPublic ? "bg-indigo-500" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        )}
      </section>

      {/* Password section */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-1 text-sm font-semibold text-white">Password</h2>
        <p className="mb-5 text-sm text-slate-500">
          Change your account password. You&apos;ll need to log in again
          afterward.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 pr-12 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              New password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-indigo-400"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-indigo-400"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}

          <button
            onClick={handlePasswordSave}
            disabled={passwordSaving}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update password"}
          </button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-red-400">
          <IconAlertTriangle size={16} stroke={1.5} />
          Danger zone
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Enter your password to confirm
              </label>
              <div className="relative">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 pr-12 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />

                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-red-400"
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Type your email{" "}
                <span className="font-mono text-red-400">{user?.email}</span> to
                confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={user?.email}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-700 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {deleteError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Permanently delete account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                disabled={deleting}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
