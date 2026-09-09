import type { ProgramCard, ProgramDiagramCategory, ProgramFieldVisit, ProgramValueCard } from '@/types';

interface ProgramCardViewProps {
  program: ProgramCard;
  index: number;
}

/** desc 안의 **굵게** 표시를 <strong>으로 변환해서 렌더링 */
function renderBoldMarkup(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const VALUE_CARD_DELAY = 0.15;

function ValuesGrid({ values }: { values: ProgramValueCard[] }) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {values.map((v, i) => (
        <div
          key={v.titleEn}
          className={`value-card rounded-xl border border-line bg-surface-2/60 p-4 ${
            i === values.length - 1 && values.length % 2 === 1 ? 'sm:col-span-2' : ''
          }`}
          style={{ animationDelay: `${i * VALUE_CARD_DELAY}s` }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">{v.icon}</span>
            <h4 className="text-[15.5px] font-bold text-ink">
              {v.titleKo} <span className="font-semibold text-ink-soft">({v.titleEn})</span>
            </h4>
          </div>
          <p className="mb-3 text-[13.5px] leading-[1.65] text-ink-soft">{renderBoldMarkup(v.desc)}</p>
          <div className="flex flex-wrap gap-1.5">
            {v.sdgs.map((sdg) => (
              <span
                key={sdg}
                className="rounded-md bg-surface px-2 py-1 text-[11.5px] font-medium leading-tight text-ink-soft"
              >
                {sdg}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const DIAGRAM_ROW_DELAY = 0.35;

function DiagramView({ categories }: { categories: ProgramDiagramCategory[] }) {
  const lineDuration = categories.length * DIAGRAM_ROW_DELAY + 0.8;

  return (
    <div className="relative mb-5">
      <div
        className="diagram-line absolute left-1/2 top-2 w-0.5 -translate-x-1/2 border-l-2 border-dashed border-accent/50"
        style={{ bottom: '8px', animationDuration: `${lineDuration}s` }}
        aria-hidden="true"
      />
      <div className="flex flex-col">
        {categories.map((cat, rowIndex) => {
          const leftItems = cat.items.filter((_, i) => i % 2 === 0);
          const rightItems = cat.items.filter((_, i) => i % 2 === 1);
          const rowDelay = rowIndex * DIAGRAM_ROW_DELAY;
          return (
            <div key={cat.label} className="flex items-center justify-center gap-2.5 py-2.5">
              <div className="flex flex-1 flex-col items-end gap-2">
                {leftItems.map((item, i) => (
                  <div
                    key={item}
                    className="diagram-box-left rounded-lg bg-surface-2 px-3.5 py-2 text-[16px] font-semibold leading-tight text-ink-soft"
                    style={{ animationDelay: `${rowDelay + 0.15 + i * 0.08}s` }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div
                className="diagram-circle relative z-10 flex h-24 w-24 flex-none items-center justify-center rounded-full bg-accent-soft text-center text-[16px] font-bold leading-tight text-accent-dark"
                style={{ animationDelay: `${rowDelay}s` }}
              >
                {cat.label}
              </div>

              <div className="flex flex-1 flex-col items-start gap-2">
                {rightItems.map((item, i) => (
                  <div
                    key={item}
                    className="diagram-box-right rounded-lg bg-surface-2 px-3.5 py-2 text-[16px] font-semibold leading-tight text-ink-soft"
                    style={{ animationDelay: `${rowDelay + 0.15 + i * 0.08}s` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldVisitItem({ visit }: { visit: ProgramFieldVisit }) {
  const hasImage = visit.image !== undefined;
  return (
    <div className="flex flex-col gap-2.5">
      {(visit.label || visit.text) && (
        <p className="text-[14px] leading-[1.65] text-ink-soft">
          {visit.label && <strong className="text-[14.5px] font-bold text-ink">{visit.label}</strong>}
          {visit.label && visit.text && ' '}
          {visit.text}
        </p>
      )}
      {visit.links && visit.links.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {visit.links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-b-[1.5px] border-accent pb-px text-[13.5px] font-bold text-accent no-underline"
            >
              {l.text}
            </a>
          ))}
        </div>
      )}
      {hasImage && (
        <div className="overflow-hidden rounded-xl">
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-accent-soft text-[13px] text-ink-faint">
            {visit.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={visit.image} alt={visit.caption || ''} className="h-full w-full object-cover" />
            ) : (
              <>
                <span className="text-[28px]">🖼️</span>
                <span>사진 자리</span>
              </>
            )}
          </div>
          {visit.caption && (
            <p className="mt-2 text-[13.5px] font-semibold leading-[1.5] text-ink">{visit.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgramCardView({ program, index }: ProgramCardViewProps) {
  const num = String(index + 1).padStart(2, '0');
  const hasRichContent = !!program.heading;

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

      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-[26px] sm:pt-[22px]">
        <div className="mb-2 text-xs font-extrabold tracking-[.5px] text-accent">{num}</div>

        {hasRichContent ? (
          <>
            <h3 className="mb-3.5 text-[17px] font-bold leading-[1.5] text-ink">{program.heading}</h3>

            {program.bullets && program.bullets.length > 0 && (
              <ul className="mb-4 flex flex-col gap-2">
                {program.bullets.map((b, i) => (
                  <li key={i} className="text-[14.5px] leading-[1.6] text-ink-soft">
                    <span className="flex gap-1.5">
                      <span className="text-accent">•</span>
                      <span>
                        {b.label && <strong className="font-bold text-ink">{b.label}</strong>}
                        {b.label && <span className="mx-1 text-ink-faint">|</span>}
                        {b.text}
                      </span>
                    </span>
                    {b.subBullets && b.subBullets.length > 0 && (
                      <ul className="ml-6 mt-1.5 flex flex-col gap-1">
                        {b.subBullets.map((sb, si) => (
                          <li key={si} className="flex gap-1.5 text-[13.5px] leading-[1.6] text-ink-soft">
                            <span className="text-ink-faint">–</span>
                            <span>{sb}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {program.diagram && program.diagram.length > 0 && <DiagramView categories={program.diagram} />}

            {program.values && program.values.length > 0 && <ValuesGrid values={program.values} />}

            {program.video && (
              <div className="mb-5">
                <div className="overflow-hidden rounded-xl">
                  <iframe
                    src={program.video.embedUrl}
                    title={program.video.caption || program.title}
                    className="aspect-video w-full"
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
                {program.video.caption && (
                  <p className="mt-2 text-[13.5px] font-semibold leading-[1.5] text-ink">{program.video.caption}</p>
                )}
              </div>
            )}

            {program.fieldVisits && program.fieldVisits.length > 0 && (
              <div className="border-t border-line pt-4">
                <div className="mb-3 text-[12.5px] font-extrabold tracking-[.5px] text-ink-faint">
                  &lt;함께한 기관과 활동 내용&gt;
                </div>
                <div className="flex flex-col gap-5">
                  {program.fieldVisits.map((v, i) => (
                    <FieldVisitItem key={i} visit={v} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
