"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price_cents: number;
    currency: string;
    image_url?: string | null;
  };
};

type Cart = {
  id: number;
  items: CartItem[];
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const subtotalCents = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, it) => sum + it.quantity * it.product.price_cents, 0);
  }, [cart]);

  const currency = cart?.items?.[0]?.product?.currency ?? "USD";

  async function loadCart() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error(`Failed to load cart: ${res.status}`);
      const data = (await res.json()) as Cart;
      setCart(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQty(itemId: number, nextQty: number) {
    if (!cart) return;

    // Optimistic update
    const prev = cart;
    setCart({
      ...cart,
      items: cart.items.map((it) => (it.id === itemId ? { ...it, quantity: nextQty } : it)),
    });

    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, quantity: nextQty }),
      });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error("Update failed.");
      // Optionally re-fetch to keep totals consistent with backend
      await loadCart();
    } catch {
      setCart(prev);
      setErr("Could not update quantity.");
    }
  }

  async function removeItem(itemId: number) {
    if (!cart) return;

    const prev = cart;
    setCart({ ...cart, items: cart.items.filter((it) => it.id !== itemId) });

    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error("Remove failed.");
      await loadCart();
    } catch {
      setCart(prev);
      setErr("Could not remove item.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
          <p className="mt-4 text-sm text-zinc-600">Loading…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-black">Cart</p>
            <h1 className="text-2xl text-black font-semibold tracking-tight">Your items</h1>
          </div>
          <Link
            href="/"
            className="rounded-xl border bg-white px-3 py-2 text-sm text-black hover:bg-zinc-50"
          >
            Continue shopping
          </Link>
        </div>

        {err ? (
          <div className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {!cart || cart.items.length === 0 ? (
          <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">
            <p className="text-sm text-black">Your cart is empty.</p>
            <p className="mt-2 text-sm text-black">
              Add a few items and they will show up here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="divide-y">
                {cart.items.map((it) => (
                  <div key={it.id} className="p-5">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-zinc-100">
                        {it.product.image_url ? (
                          <img
                            src={it.product.image_url}
                            alt={it.product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900">
                              {it.product.name}
                            </p>
                            <p className="mt-1 text-sm text-black">
                              {money(it.product.price_cents, it.product.currency)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(it.id)}
                            className="text-sm text-black hover:text-zinc-900"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}
                            className="h-9 w-9 rounded-xl border bg-white text-black text-sm hover:bg-zinc-50"
                          >
                            -
                          </button>

                          <span className="min-w-[32px] text-center text-black text-sm font-medium">
                            {it.quantity}
                          </span>

                          <button
                            onClick={() => updateQty(it.id, it.quantity + 1)}
                            className="h-9 w-9 rounded-xl border text-black bg-white text-sm hover:bg-zinc-50"
                          >
                            +
                          </button>

                          <div className="ml-auto text-sm font-semibold text-zinc-900">
                            {money(it.quantity * it.product.price_cents, it.product.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">Summary</h2>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  {money(subtotalCents, currency)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-zinc-600">Shipping</span>
                <span className="text-zinc-900">Calculated at checkout</span>
              </div>

              <div className="mt-5 border-t pt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-600">Total</span>
                <span className="text-base font-semibold text-zinc-900">
                  {money(subtotalCents, currency)}
                </span>
              </div>

              <button
                className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                onClick={() => alert("Next step: checkout")}
              >
                Checkout
              </button>

              <p className="mt-3 text-xs text-zinc-500">
                Checkout can be Stripe later. This page already supports quantities and removals.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
