import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/serverAuth";

export async function POST() {
  await clearAuthCookies();

  // Redirect back to login
  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    { status: 303 }
  );
}
