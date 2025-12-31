import { getAccessToken } from "@/lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/api";

export async function apiGetAuth<T>(path: string): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}
