import Link from "next/link";

export default function DragPhysicsPlaygroundPage() {
  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">Drag & Drop Physics</h1>
      <p className="text-foreground/70">
        Bật <span className="font-semibold">Anti-gravity</span> ở góc phải dưới
        để thử hiệu ứng “Google-style” trên page này. Bạn có thể kéo thả các vật
        thể bằng chuột/touch.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/playground"
          className="inline-flex rounded-2xl border border-foreground/10 px-4 py-2 font-semibold hover:bg-foreground/5"
        >
          Back to Playground
        </Link>
        <span className="text-sm text-foreground/60">
          Shortcut: <span className="font-semibold">Ctrl + Shift + G</span> (tắt
          nhanh bằng <span className="font-semibold">Esc</span>)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <button className="p-6 rounded-3xl border border-foreground/10 bg-card text-left">
          Subject - Verb Agreement
        </button>
        <button className="p-6 rounded-3xl border border-foreground/10 bg-card text-left">
          Tenses & Time expressions
        </button>
        <button className="p-6 rounded-3xl border border-foreground/10 bg-card text-left">
          Articles (a/an/the)
        </button>
        <button className="p-6 rounded-3xl border border-foreground/10 bg-card text-left">
          Prepositions
        </button>
      </div>
    </div>
  );
}

