'use client';

interface ControlsProps {
  showBack: boolean;
  isLast: boolean;
  shakeKey: number;
  validationMsg: string;
  onBack: () => void;
  onNext: () => void;
}

export default function Controls({ showBack, isLast, shakeKey, validationMsg, onBack, onNext }: ControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-bg from-30% to-transparent px-7 pb-[26px] pt-5">
      <div className="mx-auto flex w-full max-w-[660px] items-center gap-3.5">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-1 border-none bg-transparent py-1.5 text-sm text-ink-faint transition-colors hover:text-ink-soft ${
            showBack ? '' : 'invisible'
          }`}
        >
          ← 이전 질문
        </button>

        <button
          key={shakeKey}
          type="button"
          id="okBtn"
          onClick={onNext}
          className={`rounded-lg border-none bg-accent px-6 py-3.5 font-sans text-[15px] font-bold text-white transition-transform hover:bg-accent-dark active:scale-[.97] ${
            shakeKey > 0 ? 'animate-shake' : ''
          }`}
        >
          {isLast ? '제출하기' : 'OK'}
        </button>

        <span className="text-[13px] text-ink-faint">
          Enter{' '}
          <kbd className="ml-0.5 inline-block rounded border border-line px-1.5 py-px font-sans text-[11px]">↵</kbd>
        </span>

        <span className="ml-auto text-[13px] text-danger" role="alert" aria-live="assertive">
          {validationMsg}
        </span>
      </div>
    </div>
  );
}
