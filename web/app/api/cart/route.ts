import { NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/serverAuth";

async function refreshAccess(base: string, refresh: string) {
  const r = await fetch(`${base}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data?.access) return null;
  return data.access as string;
}

async function djangoAuthedFetch(path: string, init: RequestInit) {
  const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";
  let access = await getAccessToken();
  const refresh = await getRefreshToken();

  if (!access) return { status: 401, json: { detail: "Unauthorized" } };

  let res = await fetch(`${base}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (res.status === 401 && refresh) {
    const newAccess = await refreshAccess(base, refresh);
    if (!newAccess) {
      await clearAuthCookies();
      return { status: 401, json: { detail: "Unauthorized" } };
    }
    await setAuthCookies(newAccess, refresh);
    access = newAccess;

    res = await fetch(`${base}${path}`, {
      ...init,
      headers: { ...(init.headers || {}), Authorization: `Bearer ${access}` },
      cache: "no-store",
    });
  }

  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

export async function GET() {
  // Django should implement GET /api/cart/ returning cart + items
  const out = await djangoAuthedFetch("/cart/", { method: "GET" });
  return NextResponse.json(out.json, { status: out.status });
}

export async function DELETE() {
  // Optional: Django can implement DELETE /api/cart/ to clear
  const out = await djangoAuthedFetch("/cart/", { method: "DELETE" });
  return NextResponse.json(out.json, { status: out.status });
}
