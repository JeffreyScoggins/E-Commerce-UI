"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on login page
  if (pathname === "/login") return null;

  return (
    <header className="border-b bg-gray-500">
      <div className="mx-auto flex max-w-6xl items-center justify-between  px-4 py-4">
        <Link href="/" className="text-3xl  text-black font-semibold tracking-tight">
          Agency
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white-700 hover:text-red-700">
            Products
          </Link>
          <Link href="/account" className="text-white-700 hover:text-red-700">
            Account
          </Link>
          <Link href="/cart" className="text-white-700 hover:text-red-700">
            Cart
          </Link>
            <div className="flex justify-end">
                <form action="/api/auth/logout" method="post">
                <button className="rounded-xl border border-black px-3 py-1.5 text-sm text-black bg-indigo-300 hover:bg-white">
                    Sign out
                </button>
                </form>
            </div>
        </nav>
      </div>
    </header>
  );
}
