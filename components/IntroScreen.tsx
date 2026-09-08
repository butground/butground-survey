'use client';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-7 py-16 text-center">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center animate-rise">
        <div className="mb-8 aspect-[3/2] w-full overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/intro-photo.jpg" alt="벗밭과 함께하는 식사 자리" className="h-full w-full object-cover" />
        </div>

        <h1 className="text-[clamp(21px,3.4vw,30px)] font-semibold leading-[1.45] text-ink">
          안녕하세요, 벗님!
          <br />
          만나서 반가워요. 여러분은 어떻게 먹고 있나요?
          <br />
          벗밭과 함께 즐거운 식사 여행을 떠나 보아요!
        </h1>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 rounded-full bg-accent px-10 py-4 font-sans text-base font-bold text-white transition-colors hover:bg-accent-dark active:scale-[.98]"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
