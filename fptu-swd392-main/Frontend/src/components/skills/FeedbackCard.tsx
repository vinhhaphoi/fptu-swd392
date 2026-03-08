interface FeedbackCardProps {
  title: string;
  score: number;
  maxScore: number;
  criteria: {
    name: string;
    score: number;
    maxScore: number;
    description: string;
    examples?: string[];
  }[];
  recommendations: string[];
  onRetry?: () => void;
  onBack?: () => void;
}

export default function FeedbackCard({
  title,
  score,
  maxScore,
  criteria,
  recommendations,
  onRetry,
  onBack,
}: FeedbackCardProps) {
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="bg-card border border-card-border rounded-2xl p-8 space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-card-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {score}
          </div>
          <div className="text-foreground/60 text-xl">/ {maxScore}</div>
          <div className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-500 font-semibold">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Evaluation Criteria</h3>
        {criteria.map((criterion, index) => (
          <div
            key={index}
            className="bg-foreground/5 rounded-xl p-5 border border-card-border"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{criterion.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {criterion.score}
                </span>
                <span className="text-foreground/40">/ {criterion.maxScore}</span>
              </div>
            </div>
            <p className="text-foreground/70 text-sm mb-2">{criterion.description}</p>
            {criterion.examples && criterion.examples.length > 0 && (
              <div className="mt-3 pt-3 border-t border-card-border">
                <p className="text-xs font-medium text-foreground/50 mb-2">
                  Examples:
                </p>
                <ul className="space-y-1">
                  {criterion.examples.map((example, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-foreground/60 flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
        <h3 className="font-semibold text-indigo-500 mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          Recommendations for Improvement
        </h3>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="text-sm text-foreground/70 flex items-start gap-2"
            >
              <span className="text-indigo-500 mt-1">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-card-border">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 rounded-xl border border-card-border text-foreground/70 hover:bg-foreground/5 transition-all"
          >
            Back to List
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
