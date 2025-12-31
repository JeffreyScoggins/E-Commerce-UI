import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  image_url?: string | null;
  category?: { id: number; name: string; slug: string };
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/products`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    return (
      <main className="p-6">
        <p className="text-sm">Please log in.</p>
        <Link href="/login" className="underline">Go to login</Link>
      </main>
    );
  }

  const all: Product[] = await res.json();
  const products = all.filter((p) => p.category?.slug === slug);

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-500">Category</p>
            <h1 className="text-2xl font-semibold tracking-tight">{slug}</h1>
          </div>
          <Link href="/" className="text-sm underline">
            Back to all products
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <h2 className="mt-4 text-sm font-semibold text-zinc-900">{p.name}</h2>
              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{p.description}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                {money(p.price_cents, p.currency)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
