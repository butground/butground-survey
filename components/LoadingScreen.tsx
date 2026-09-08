'use client';

import { useEffect, useState } from 'react';

const SPOKE_OPACITIES = [1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44, 0.36, 0.28, 0.2, 0.12];

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [phase, setPhase] = useState<1 | 2 | 0>(1);

  useEffect(() => {
    // 0~2s: 문구1 노출 → 2~3s: 페이드아웃(1s)되며 문구2 페이드인 → 3~5s: 문구2 노출 → 결과 화면
    const t1 = setTimeout(() => setPhase(0), 2000);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[30px] bg-bg p-6 text-center"
      role="status"
      aria-live="polite"
    >
      <svg
        className="h-14 w-14 animate-spin motion-reduce:animate-none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {SPOKE_OPACITIES.map((opacity, i) => (
          <rect
            key={i}
            x="47"
            y="8"
            width="6"
            height="18"
            rx="3"
            fill="#F38338"
            style={{ opacity }}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </svg>

      <div className="relative min-h-[84px] w-full max-w-[520px]">
        <div
          className={`absolute inset-0 flex items-center justify-center px-3 text-center transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            phase === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="m-0 max-w-[520px] text-[clamp(20px,4.2vw,30px)] font-bold leading-[1.5] text-ink">
            벗밭의 교육은 연령대에 상관없이
            <br />
            맞춤형으로 진행 가능합니다.
          </p>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center px-3 text-center transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            phase === 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="m-0 max-w-[520px] text-[clamp(20px,4.2vw,30px)] font-bold leading-[1.5] text-ink">
            그럼 자세히 볼까요?
          </p>
        </div>
      </div>
    </div>
  );
}
