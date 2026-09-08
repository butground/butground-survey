'use client';

interface IntroScreenProps {
  onStart: () => void;
}

// TODO: 실제 사진이 정해지면 /public에 넣고 이 자리표시(placeholder)를
// <img src="/intro-photo.jpg" alt="벗밭" className="h-full w-full object-cover" /> 로 교체하면 됨.
export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-7 py-16 text-center">
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center animate-rise">
        <div className="mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-accent-soft text-6xl">
          🥗
        </div>

        <h1 className="text-[clamp(24px,5vw,34px)] font-extrabold leading-[1.5] text-ink">
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
