interface QuestionNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onNavigate,
}: QuestionNavigationProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <h3 className="text-sm font-medium text-slate-400 mb-3">
        Question Navigation
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`
              w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
              ${
                currentIndex === i
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : answeredQuestions.has(i)
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-500/30" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-700" />
          <span>Not answered</span>
        </div>
      </div>
    </div>
  );
}
