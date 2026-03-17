export function ScoreIndicator({ value }: { value: number }) {
  const getColor = (v: number) => {
    if (v >= 75) return 'text-score-high bg-score-high/10';
    if (v >= 50) return 'text-score-mid bg-score-mid/10';
    return 'text-score-low bg-score-low/10';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 ${getColor(value)}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="font-mono text-xs font-medium tabular-nums">{value}</span>
    </div>
  );
}
