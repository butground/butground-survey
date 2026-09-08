import type { ProgramCard } from '@/types';

interface ProgramCardViewProps {
  program: ProgramCard;
  index: number;
}

export default function ProgramCardView({ program, index }: ProgramCardViewProps) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-line bg-surface">
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-accent-soft text-[13px] text-ink-faint">
        {program.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={program.image} alt={program.title} className="h-full w-full object-cover" />
        ) : (
          <>
            <span className="text-[34px]">{program.icon}</span>
            <span>대표사진 자리</span>
          </>
        )}
      </div>
      <div className="px-6 pb-[26px] pt-[22px]">
        <div className="mb-2 text-xs font-extrabold tracking-[.5px] text-accent">{num}</div>
        <h3 className="mb-2.5 text-[19px] font-bold text-ink">{program.title}</h3>
        <p className="mb-3.5 text-[14.5px] leading-[1.65] text-ink-soft">{program.desc}</p>
        <a
          href={program.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-b-[1.5px] border-accent pb-px text-[13.5px] font-bold text-accent no-underline"
        >
          관련 콘텐츠 보기 →
        </a>
      </div>
    </div>
  );
}
