import { NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/serverAuth";

async function refreshAccessToken(base: string, refresh: string) {
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

export async function POST(req: Request) {
  const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";
  let access = await getAccessToken();
  const refresh = await getRefreshToken();
  const body = await req.json().catch(() => ({}));

  if (!access) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  let res = await fetch(`${base}/account/change-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (res.status === 401 && refresh) {
    const newAccess = await refreshAccessToken(base, refresh);
    if (!newAccess) {
      await clearAuthCookies();
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    await setAuthCookies(newAccess, refresh);
    access = newAccess;

    res = await fetch(`${base}/account/change-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  }

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
