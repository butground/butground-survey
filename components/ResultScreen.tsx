'use client';

import { useMemo, useState } from 'react';
import ProgramCardView from './ProgramCardView';
import { getAllPrograms, getPersonalizedPrograms } from '@/lib/matching';
import type { SurveyAnswers } from '@/types';

const APPLICATION_FORM_URL = 'https://forms.gle/cuPoA73yfbUGbs8n6';

interface ResultScreenProps {
  answers: SurveyAnswers;
  onRestart: () => void;
}

export default function ResultScreen({ answers, onRestart }: ResultScreenProps) {
  const [viewMode, setViewMode] = useState<'personalized' | 'all'>('personalized');

  const personalized = useMemo(() => getPersonalizedPrograms(answers), [answers]);
  const all = useMemo(() => getAllPrograms(), []);
  // 안전장치: 개인화 카드가 0개면 전체 카드 목록을 대신 보여준다.
  const personalizedList = personalized.length > 0 ? personalized : all;
  const list = viewMode === 'personalized' ? personalizedList : all;

  const name = (answers.name || '').trim();
  const chipData = [answers.job, answers.age, (answers.audience || []).join(', ')].filter(Boolean) as string[];

  const isAllView = viewMode === 'all';

  return (
    <div className="px-7 pb-[90px] pt-[70px]">
      <div className="mx-auto max-w-[760px]">
        <div aria-live="polite" className="sr-only">
          {isAllView ? '벗밭의 모든 교육 사례를 보고 있어요.' : '나에게 맞는 교육 결과를 보고 있어요.'}
        </div>

        {isAllView && (
          <button
            type="button"
            onClick={() => setViewMode('personalized')}
            className="mb-5 border-none bg-transparent p-0 text-sm font-semibold text-ink-soft hover:text-accent"
          >
            ← 내 맞춤 결과로 돌아가기
          </button>
        )}

        <div className="mb-2.5 text-[13px] font-bold text-accent">
          {isAllView ? '벗밭의 모든 교육 사례' : '결과: 나에게 맞는 교육 유형'}
        </div>

        <h1 className="mb-2.5 text-[clamp(24px,4vw,32px)] font-extrabold leading-[1.4] text-ink">
          {isAllView
            ? '벗밭이 준비한 모든 교육 사례를 소개할게요'
            : (name ? `${name}님, ` : '') + '벗밭의 교육사례를 소개할게요'}
        </h1>

        <p className="mb-[30px] text-[15px] leading-[1.6] text-ink-soft">
          {isAllView
            ? '지금까지 벗밭이 준비한 프로그램을 한자리에 모았어요. 마음에 드는 활동을 살펴보세요.'
            : '응답 내용을 바탕으로 벗밭이 제안하는 프로그램이에요. 아래 프로그램을 살펴보고 마음에 드는 활동을 골라보세요.'}
        </p>

        {!isAllView && chipData.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {chipData.map((c, i) => (
              <span key={i} className="rounded-[20px] bg-surface-2 px-3.5 py-1.5 text-[13px] text-ink-soft">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mb-9 flex flex-col gap-4">
          {list.map((p, i) => (
            <ProgramCardView key={p.title} program={p} index={i} />
          ))}
        </div>

        <div className="mb-9 rounded-lg bg-surface-2 px-3.5 py-3 text-[12.5px] leading-[1.6] text-ink-faint">
          ※ 위 프로그램 사진·링크는 테스트용 자리표시입니다. 실제 대표사진과 콘텐츠 링크를 전달해주시면 그대로
          교체할게요.
        </div>

        <div className="mb-7 border-y border-line px-5 py-10 text-center">
          {!isAllView && (
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className="mb-6 rounded-full border-[1.5px] border-accent bg-transparent px-5 py-2.5 text-sm font-bold text-accent hover:bg-accent-soft"
            >
              벗밭의 다른 교육 보러 가기
            </button>
          )}

          <p className="mb-5 mt-0 text-base font-bold text-ink">내가 찾던 교육, 맞춤형으로 상담받고 싶다면?</p>
          <a
            href={APPLICATION_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-full max-w-[420px] items-center justify-center rounded-full bg-accent px-6 py-[17px] font-sans text-base font-bold text-white no-underline transition-colors hover:bg-accent-dark active:scale-[.98]"
          >
            교육 신청서 작성하기
          </a>
          <p className="mb-0 mt-[26px] text-xl font-extrabold leading-[1.5] text-ink">
            부스를 둘러 보며 벗밭의 교육사례를 살펴보세요!
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border-[1.5px] border-line bg-surface px-5 py-[11px] font-sans text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
        >
          설문 다시 하기
        </button>

        {/* 개발/테스트 확인용. 실서비스 배포 시에는 이 영역을 제거해도 됨. */}
        <details className="mt-[30px] text-[13px] text-ink-soft">
          <summary className="cursor-pointer">응답 데이터 확인 (테스트용)</summary>
          <pre className="mt-2.5 whitespace-pre-wrap break-all rounded-lg bg-surface-2 p-3.5 text-xs">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
