import Link from 'next/link';

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Physics UI Playground</h1>
      <p className="mb-4 text-gray-600">Test area for VSTEP interactive components.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/playground/word-bubbles" className="block p-6 border rounded-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Word Bubbles</h2>
          <p>Vocabulary discovery with floating bubbles.</p>
        </Link>
        
        <Link href="/playground/drag-physics" className="block p-6 border rounded-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Drag & Drop Physics</h2>
          <p>Grammar practice with weighted words.</p>
        </Link>
        
        <Link href="/playground/gamified-result" className="block p-6 border rounded-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Gamified Result</h2>
          <p>Celebration effects with falling elements.</p>
        </Link>
        
        <Link href="/playground/stress-relief" className="block p-6 border rounded-lg hover:bg-gray-50 transition">
          <h2 className="text-xl font-semibold mb-2">Stress Relief</h2>
          <p>Smash words against the wall.</p>
        </Link>
      </div>
    </div>
  );
}
