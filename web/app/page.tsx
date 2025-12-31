"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  image_url?: string | null;
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  async function addToCart(productId: number) {
    setAddingId(productId);
    setToast("");

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Failed to add to cart");

      setToast("Added to cart");
      setTimeout(() => setToast(""), 1500);
    } catch (err: any) {
      setToast(err?.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-sm text-zinc-600">Loading products…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg text-zinc-500">Catalog</p>
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Products
            </h1>
          </div>
          <Link
            href="/cart"
            className="rounded-xl border bg-white px-3 py-2 text-sm text-black hover:bg-zinc-50"
          >
            View cart
          </Link>
        </div>

        {toast && (
          <div className="mt-4 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white">
            {toast}
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <h2 className="mt-4 text-sm font-semibold text-zinc-900">
                {p.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                {p.description}
              </p>

              <p className="mt-2 text-sm font-semibold text-zinc-900">
                {money(p.price_cents, p.currency)}
              </p>

              <button
                onClick={() => addToCart(p.id)}
                disabled={addingId === p.id}
                className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {addingId === p.id ? "Adding…" : "Add to cart"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
