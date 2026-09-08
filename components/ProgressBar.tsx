interface ProgressBarProps {
  index: number;
  total: number;
}

export default function ProgressBar({ index, total }: ProgressBarProps) {
  const pct = total <= 1 ? 0 : Math.round((index / (total - 1)) * 100);
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-line">
      <div
        className="h-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
