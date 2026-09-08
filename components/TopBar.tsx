interface TopBarProps {
  onRestart: () => void;
}

export default function TopBar({ onRestart }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-7 pt-[22px]">
      <span className="text-[13px] font-semibold tracking-[.2px] text-ink-soft">
        벗밭 · 식사 체크리스트
      </span>
      <button
        type="button"
        className="rounded-md px-2 py-1 text-lg text-ink-faint transition-colors hover:bg-[#f2f3f5] hover:text-ink"
        title="처음부터 다시"
        aria-label="처음부터 다시 시작"
        onClick={onRestart}
      >
        ↺
      </button>
    </div>
  );
}
