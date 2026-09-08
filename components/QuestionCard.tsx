'use client';

import { personalizeTitle } from '@/lib/personalize';
import type { Question, QuestionOption, SurveyAnswers } from '@/types';

function keyLabel(i: number): string {
  return i < 9 ? String(i + 1) : String.fromCharCode(65 + i - 9);
}

function renderTitle(title: string, emphasize?: string) {
  if (!emphasize) return title;
  const idx = title.indexOf(emphasize);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="font-extrabold text-accent">{emphasize}</span>
      {title.slice(idx + emphasize.length)}
    </>
  );
}

interface QuestionCardProps {
  slide: Question;
  index: number;
  answers: SurveyAnswers;
  onTextChange: (id: string, value: string) => void;
  onOtherChange: (id: string, value: string) => void;
  onSingleSelect: (slide: Question, opt: QuestionOption) => void;
  onMultiToggle: (slide: Question, opt: QuestionOption) => void;
  onScaleSelect: (slide: Question, n: number) => void;
  onEnterText: () => void;
}

export default function QuestionCard({
  slide,
  index,
  answers,
  onTextChange,
  onOtherChange,
  onSingleSelect,
  onMultiToggle,
  onScaleSelect,
  onEnterText,
}: QuestionCardProps) {
  const multi = slide.type === 'multi';
  const currentMulti: string[] = multi ? (answers[slide.id] as string[]) || [] : [];
  const currentSingle = !multi ? (answers[slide.id] as string | undefined) : undefined;
  const title = personalizeTitle(slide.title, answers.name);

  return (
    <div key={slide.id} className="mx-auto w-full max-w-[660px] animate-rise">
      <div className="mb-[18px] inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-md bg-accent px-1.5 text-[13px] font-bold text-white">
        {index + 1}
      </div>

      <h2 className="mb-2 text-[clamp(21px,3.4vw,30px)] font-semibold leading-[1.45] text-ink">
        {renderTitle(title, slide.emphasize)}
        {slide.required && <span className="ml-0.5 text-accent">*</span>}
      </h2>

      {slide.sub && <p className="mb-[30px] text-[14.5px] leading-[1.6] text-ink-soft">{slide.sub}</p>}

      {multi && (
        <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-[20px] bg-accent-soft px-3.5 py-1.5 text-[13.5px] font-extrabold text-accent-dark">
          {slide.max ? `✓ 중복 선택 가능 (최대 ${slide.max}개)` : '✓ 중복 선택 가능'}
        </div>
      )}

      {(slide.type === 'text' || slide.type === 'textarea') && (
        <TextField slide={slide} value={(answers[slide.id] as string) || ''} onChange={onTextChange} onEnter={onEnterText} />
      )}

      {(slide.type === 'single' || slide.type === 'multi') && slide.options && (
        <div className="flex flex-col gap-2.5">
          {slide.options.map((opt, i) => {
            const selected = multi ? currentMulti.includes(opt.value) : currentSingle === opt.value;
            return (
              <div key={opt.value}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => (multi ? onMultiToggle(slide, opt) : onSingleSelect(slide, opt))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      multi ? onMultiToggle(slide, opt) : onSingleSelect(slide, opt);
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-3.5 rounded-[10px] border-[1.5px] px-4 py-3.5 transition-colors ${
                    selected
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-surface hover:border-accent hover:bg-accent-soft'
                  }`}
                >
                  <div
                    className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-md border-[1.5px] text-xs font-bold transition-colors ${
                      selected ? 'border-accent bg-accent text-white' : 'border-line text-ink-soft'
                    }`}
                  >
                    {keyLabel(i)}
                  </div>
                  <div className="text-base leading-[1.5] text-ink">{opt.label}</div>
                </div>

                {opt.other && selected && (
                  <input
                    className="mt-2 w-full rounded-lg border-[1.5px] border-line px-3 py-2.5 text-[15px] outline-none focus:border-accent"
                    placeholder="직접 입력해주세요"
                    value={(answers[slide.id + '_other'] as string) || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onOtherChange(slide.id, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {slide.type === 'scale' && (
        <ScaleField slide={slide} value={answers[slide.id] as number | undefined} onSelect={onScaleSelect} />
      )}
    </div>
  );
}

function TextField({
  slide,
  value,
  onChange,
  onEnter,
}: {
  slide: Question;
  value: string;
  onChange: (id: string, value: string) => void;
  onEnter: () => void;
}) {
  const isTextarea = slide.type === 'textarea';
  const commonProps = {
    id: slide.id,
    value,
    placeholder: slide.placeholder || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(slide.id, e.target.value),
    autoFocus: true,
  };

  if (isTextarea) {
    return (
      <textarea
        {...commonProps}
        aria-label={slide.title}
        className="min-h-[110px] w-full resize-y rounded-[10px] border-[1.5px] border-line bg-transparent px-4 py-3.5 font-sans text-[17px] leading-[1.6] text-ink outline-none focus:border-accent"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            e.preventDefault();
            onEnter();
          }
        }}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type="text"
      aria-label={slide.title}
      className="w-full border-0 border-b-2 border-line bg-transparent px-0.5 py-2 pb-3 font-sans text-xl text-ink outline-none placeholder:text-ink-faint focus:border-accent"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}

function ScaleField({
  slide,
  value,
  onSelect,
}: {
  slide: Question;
  value: number | undefined;
  onSelect: (slide: Question, n: number) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2.5 min-[520px]:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(slide, n)}
            className={`rounded-lg border-[1.5px] py-3.5 text-base font-semibold transition-colors ${
              value === n
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface text-ink-soft hover:border-accent'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2.5 flex justify-between text-[12.5px] text-ink-faint">
        <span>매우 나쁘다</span>
        <span>매우 좋다</span>
      </div>
    </div>
  );
}
