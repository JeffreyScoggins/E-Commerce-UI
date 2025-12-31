import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";
  const r = await fetch(`${base}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    return NextResponse.json(
      { detail: data?.detail ?? "Login failed" },
      { status: r.status }
    );
  }

  const access = data?.access as string | undefined;
  const refresh = data?.refresh as string | undefined;

  if (!access || !refresh) {
    return NextResponse.json(
      { detail: "Token response missing access/refresh" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });

  const baseCookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookies.set("access_token", access, { ...baseCookie, maxAge: 60 * 15 });
  res.cookies.set("refresh_token", refresh, { ...baseCookie, maxAge: 60 * 60 * 24 * 7 });

  return res;
}
