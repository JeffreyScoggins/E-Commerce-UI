"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on login page
  if (pathname === "/login") return null;

  return (
  <header className="border-b bg-black">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      
    
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-3xl font-semibold tracking-tight text-white"
        >
          Agency
        </Link>

        <nav className="hidden md:flex items-center gap-8 px-6 text-m">
          <Link href="/" className="text-zinc-300 hover:text-white">
            Products
          </Link>
          <Link href="/account" className="text-zinc-300 hover:text-white">
            Account
          </Link>
          <Link href="/cart" className="text-zinc-300 hover:text-white">
            Cart
          </Link>
        </nav>
      </div>

      <form action="/api/auth/logout" method="post">
        <button className="rounded-xl bg-zinc-300 px-3 py-1.5 text-sm text-black hover:bg-zinc-50">
          Sign out
        </button>
      </form>
    </div>
  </header>
);
}
