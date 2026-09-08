'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProgressBar from './ProgressBar';
import TopBar from './TopBar';
import QuestionCard from './QuestionCard';
import Controls from './Controls';
import LoadingScreen from './LoadingScreen';
import ResultScreen from './ResultScreen';
import IntroScreen from './IntroScreen';
import { buildFlow } from '@/lib/branching';
import type { Question, QuestionOption, SurveyAnswers } from '@/types';

type Screen = 'intro' | 'survey' | 'loading' | 'results';

const AUTO_ADVANCE_DELAY = 320;

function isAnswered(slide: Question, answers: SurveyAnswers): boolean {
  const v = answers[slide.id];
  if (!slide.required) return true;
  if (slide.type === 'text' || slide.type === 'textarea') return typeof v === 'string' && v.trim().length > 0;
  if (slide.type === 'scale') return v !== undefined && v !== null;
  if (slide.type === 'single') return !!v;
  if (slide.type === 'multi') return Array.isArray(v) && v.length > 0;
  return true;
}

export default function SurveyApp() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [index, setIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>('intro');
  const [validationMsg, setValidationMsg] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const flow = useMemo(() => buildFlow(answers), [answers]);
  const slide = flow[index];

  const flashInvalid = useCallback((message: string) => {
    setValidationMsg(message);
    setShakeKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    setValidationMsg('');
    const currentSlide = flow[index];
    if (!isAnswered(currentSlide, answersRef.current)) {
      flashInvalid('필수 질문이에요');
      return;
    }
    if (index < flow.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setScreen('loading');
    }
  }, [flow, index, flashInvalid]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const restart = useCallback(() => {
    setAnswers({});
    setIndex(0);
    setValidationMsg('');
    setScreen('intro');
  }, []);

  const onTextChange = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onOtherChange = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [`${id}_other`]: value }));
  }, []);

  const onSingleSelect = useCallback(
    (targetSlide: Question, opt: QuestionOption) => {
      setAnswers((prev) => ({ ...prev, [targetSlide.id]: opt.value }));
      // '기타'처럼 추가 입력이 필요한 옵션은 자동으로 넘어가지 않고 OK를 기다림
      if (!opt.other) {
        setTimeout(() => {
          if (answersRef.current[targetSlide.id] === opt.value) {
            goNext();
          }
        }, AUTO_ADVANCE_DELAY);
      }
    },
    [goNext]
  );

  const onScaleSelect = useCallback(
    (targetSlide: Question, n: number) => {
      setAnswers((prev) => ({ ...prev, [targetSlide.id]: n }));
      setTimeout(() => {
        if (answersRef.current[targetSlide.id] === n) {
          goNext();
        }
      }, AUTO_ADVANCE_DELAY);
    },
    [goNext]
  );

  const onMultiToggle = useCallback((targetSlide: Question, opt: QuestionOption) => {
    setAnswers((prev) => {
      const list = (prev[targetSlide.id] as string[]) || [];
      if (list.includes(opt.value)) {
        return { ...prev, [targetSlide.id]: list.filter((v) => v !== opt.value) };
      }
      if (targetSlide.max && list.length >= targetSlide.max) {
        setValidationMsg(`최대 ${targetSlide.max}개까지 선택할 수 있어요`);
        return prev;
      }
      return { ...prev, [targetSlide.id]: [...list, opt.value] };
    });
  }, []);

  useEffect(() => {
    if (screen !== 'survey') return;
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      const typing = tag === 'INPUT' || tag === 'TEXTAREA';
      const currentSlide = flow[index];
      if (!currentSlide) return;

      if (e.key === 'Enter' && !typing) {
        e.preventDefault();
        goNext();
      }
      if (!typing && (currentSlide.type === 'single' || currentSlide.type === 'multi' || currentSlide.type === 'scale')) {
        const n = parseInt(e.key, 10);
        if (!Number.isNaN(n) && n >= 1) {
          if (currentSlide.type === 'scale' && n >= 1 && n <= 10) {
            onScaleSelect(currentSlide, n);
          } else if (currentSlide.options && currentSlide.options[n - 1]) {
            const opt = currentSlide.options[n - 1];
            currentSlide.type === 'multi' ? onMultiToggle(currentSlide, opt) : onSingleSelect(currentSlide, opt);
          }
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [screen, flow, index, goNext, onScaleSelect, onMultiToggle, onSingleSelect]);

  // 로딩 화면 진입과 동시에(비동기, 결과 화면 전환을 막지 않음) 서버로 응답 데이터 전송
  useEffect(() => {
    if (screen !== 'loading') return;
    const payload = {
      name: answers.name || '',
      job: answers.job || '',
      job_other: answers.job_other || '',
      age: answers.age || '',
      body: answers.body ?? '',
      mind: answers.mind ?? '',
      meaning: answers.meaning || [],
      table: answers.table || [],
      experience: answers.experience || [],
      branch_인식: answers.branch_인식 || [],
      branch_실천: answers.branch_실천 || [],
      branch_확장: answers.branch_확장 || [],
      branch_안내: answers.branch_안내 || [],
      audience: answers.audience || [],
      audience_other: answers.audience_other || '',
      feedback: answers.feedback || '',
    };
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error('[벗밭 설문] 제출 실패', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  if (screen === 'intro') {
    return <IntroScreen onStart={() => setScreen('survey')} />;
  }

  if (screen === 'results') {
    return <ResultScreen answers={answers} onRestart={restart} />;
  }

  if (screen === 'loading') {
    return <LoadingScreen onDone={() => setScreen('results')} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <ProgressBar index={index} total={flow.length} />
      <TopBar onRestart={restart} />

      <main className="flex flex-1 items-center px-7 pb-[140px] pt-[60px]">
        <QuestionCard
          slide={slide}
          index={index}
          answers={answers}
          onTextChange={onTextChange}
          onOtherChange={onOtherChange}
          onSingleSelect={onSingleSelect}
          onMultiToggle={onMultiToggle}
          onScaleSelect={onScaleSelect}
          onEnterText={goNext}
        />
      </main>

      <Controls
        showBack={index > 0}
        isLast={index === flow.length - 1}
        shakeKey={shakeKey}
        validationMsg={validationMsg}
        onBack={goBack}
        onNext={goNext}
      />
    </div>
  );
}
