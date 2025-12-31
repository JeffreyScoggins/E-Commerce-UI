"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Me = { id: number; username: string; email: string };

export default function AccountPage() {

  
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  const [email, setEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      setErr("");
      const res = await fetch("/api/account/me", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) {
        setErr(`Failed to load account: ${res.status}`);
        return;
      }
      const data = (await res.json()) as Me;
      setMe(data);
      setEmail(data.email ?? "");
    })();
  }, [router]);

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setSavingEmail(true);

    try {
      const res = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error(data?.detail || "Failed to update email.");

      setMe(data);
      setMsg("Email updated.");
    } catch (e: any) {
      setErr(e?.message || "Failed to update email.");
    } finally {
      setSavingEmail(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setSavingPw(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error(data?.detail || "Failed to update password.");

      setCurrentPassword("");
      setNewPassword("");
      setMsg("Password updated.");
    } catch (e: any) {
      setErr(e?.message || "Failed to update password.");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Account</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
            {me ? `Hi, ${me.username}` : "Your account"}
          </h1>

          {msg ? (
            <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {msg}
            </div>
          ) : null}
          {err ? (
            <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6">
            <form onSubmit={saveEmail} className="rounded-2xl border p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Email</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Update the email address on your account.
              </p>

              <label className="mt-4 block text-sm font-medium text-zinc-800">
                Email address
              </label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />

              <button
                type="submit"
                disabled={savingEmail}
                className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {savingEmail ? "Saving..." : "Save email"}
              </button>
            </form>

            <form onSubmit={changePassword} className="rounded-2xl border p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Password</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Change your password.
              </p>

              <label className="mt-4 block text-sm font-medium text-zinc-800">
                Current password
              </label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200 text-black"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />

              <label className="mt-4 block text-sm font-medium text-zinc-800">
                New password
              </label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200 text-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="submit"
                disabled={savingPw}
                className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {savingPw ? "Saving..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
