import Link from "next/link";

export default function GamifiedResultPlaygroundPage() {
  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Gamified Result</h1>
      <p className="text-foreground/70">
        Trang này có nhiều “token” để bạn bật Anti-gravity và xem hiệu ứng giống
        reward rain / celebration.
      </p>

      <Link
        href="/playground"
        className="inline-flex rounded-2xl border border-foreground/10 px-4 py-2 font-semibold hover:bg-foreground/5"
      >
        Back to Playground
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-3xl border border-foreground/10 bg-card flex items-center justify-center font-bold"
          >
            +{(i + 1) * 5}
          </div>
        ))}
      </div>
    </div>
  );
}

