import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/serverAuth";

export async function GET() {
  const base = process.env.DJANGO_API_BASE ?? "http://127.0.0.1:8000/api";
  const r = await fetch(`${base}/categories/`, {
    cache: "no-store",
  });

  const data = await r.json().catch(() => ([]));
  return NextResponse.json(data, { status: r.status });
}
