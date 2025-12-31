"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function Navbar() {
  const [cats, setCats] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setCats(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <header className="border-b bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* LEFT: Brand + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-semibold tracking-tight text-white">
            Agency
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* Products dropdown */}
            <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            >
            {/* Trigger */}
            <span className="cursor-pointer text-zinc-300 hover:text-white">
              Products
            </span>

            {/* Dropdown */}
            {open && (
              <div
                className="
                  absolute left-0 top-full z-50
                  mt-0
                  w-64
                  rounded-2xl
                  border
                  bg-white
                  shadow-lg
                "
                >
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Categories
                </div>

                <div className="max-h-80 overflow-auto py-1">
                  {cats.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="block px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      onClick={() => setOpen(false)}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>


            <Link href="/account" className="text-zinc-300 hover:text-white">
              Account
            </Link>
            <Link href="/cart" className="text-zinc-300 hover:text-white">
              Cart
            </Link>
          </nav>
        </div>

        {/* RIGHT: Sign out */}
        <form action="/api/auth/logout" method="post">
          <button className="rounded-xl bg-zinc-300 px-3 py-1.5 text-sm text-black hover:bg-zinc-50">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
