import Link from "next/link";

export default function WordBubblesPlaygroundPage() {
  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Word Bubbles</h1>
      <p className="text-foreground/70">
        Đây là trang test nhanh. Bật <span className="font-semibold">Anti-gravity</span>{" "}
        (góc phải dưới) để xem các “bubble” bay/va chạm.
      </p>

      <Link
        href="/playground"
        className="inline-flex rounded-2xl border border-foreground/10 px-4 py-2 font-semibold hover:bg-foreground/5"
      >
        Back to Playground
      </Link>

      <div className="flex flex-wrap gap-3 pt-4">
        {["contemplate", "resilient", "meticulous", "inevitable", "persuade", "vivid"].map(
          (w) => (
            <span
              key={w}
              className="px-4 py-2 rounded-full border border-foreground/10 bg-card font-semibold"
            >
              {w}
            </span>
          )
        )}
      </div>
    </div>
  );
}

