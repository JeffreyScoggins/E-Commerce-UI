import { NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/serverAuth";

async function refreshAccessToken(base: string, refresh: string) {
  const res = await fetch(`${base}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access) return null;
  return data.access as string;
}

export async function GET() {
  const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";

  let access = await getAccessToken();
  const refresh = await getRefreshToken();

  if (!access) {
    return NextResponse.json({ detail: "Unauthorized (no cookie)" }, { status: 401 });
  }

  let res = await fetch(`${base}/products/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (res.status === 401 && refresh) {
    const newAccess = await refreshAccessToken(base, refresh);
    if (!newAccess) {
      await clearAuthCookies();
      return NextResponse.json({ detail: "Unauthorized (refresh failed)" }, { status: 401 });
    }

    await setAuthCookies(newAccess, refresh);
    access = newAccess;

    res = await fetch(`${base}/products/`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
