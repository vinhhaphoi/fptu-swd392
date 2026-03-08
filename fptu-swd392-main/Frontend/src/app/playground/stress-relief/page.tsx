import Link from "next/link";

export default function StressReliefPlaygroundPage() {
  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Stress Relief</h1>
      <p className="text-foreground/70">
        Bật Anti-gravity để biến các “block” thành vật thể bay/va chạm. (Esc để
        tắt nhanh)
      </p>

      <Link
        href="/playground"
        className="inline-flex rounded-2xl border border-foreground/10 px-4 py-2 font-semibold hover:bg-foreground/5"
      >
        Back to Playground
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {["LISTENING", "READING", "WRITING", "SPEAKING", "VOCAB", "GRAMMAR"].map(
          (label) => (
            <div
              key={label}
              className="p-6 rounded-3xl border border-foreground/10 bg-card font-black tracking-wide text-center"
            >
              {label}
            </div>
          )
        )}
      </div>
    </div>
  );
}

