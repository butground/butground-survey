import type { ProgramsByTag } from '@/types';

/**
 * 태그별 결과 화면 프로그램 카드. 4개 모델명: 식생활 알아가기(인식) · 음식시민 되기(실천) ·
 * 지역 만나기(확장) · 경험 나누기(안내).
 * ⚠️ '경험 나누기(안내)' 카드는 아직 실제 사례 텍스트를 못 받아서 기존 요약 문구를 heading으로만
 *    옮겨둔 상태(대표사진은 반영됨). 생태미식캠프 카드도 대표사진/영상만 있고 세부 fieldVisits는 아직 없음.
 *    link/fieldVisits[].links[].url이 '#'인 곳은 실제 링크로 교체하면 됨.
 */
export const programsByTag: ProgramsByTag = {
  인식: [
    {
      icon: '📖',
      image: null,
      title: '식사 너머의 이야기 워크숍 (가제)',
      desc: '먹거리가 식탁에 오르기까지의 생산·가공·유통 이야기를 들려주는 프로그램이에요.',
      link: '#',
      heading: '[식생활 알아가기] 생산부터 폐기와 순환까지, 식사를 둘러싼 다양한 주제를 이론과 실습으로 탐색하는 1회차~한 학기 단위의 식생활교육',
      bullets: [
        { label: '주제별 강의', text: '식사를 둘러싼 사회적 맥락과 환경 요소를 테마별로 탐구합니다.' },
        { label: '단기 특강', text: '나의 식사를 돌아보고 환경과 먹거리의 연관성을 알아봅니다.' },
      ],
      diagram: [
        { label: '생산', items: ['산', '들', '바다', '논'] },
        { label: '가공', items: ['발효', '가공식품', '조미료'] },
        { label: '유통/관계', items: ['로컬푸드', '민중교역', '시장'] },
        { label: '소비', items: ['제철', '동물복지', '채식'] },
        { label: '폐기/순환', items: ['업사이클링', '토종씨앗', '친환경'] },
      ],
      fieldVisits: [
        { label: '[월드비전]', text: '식생활역량강화교육 연계 기관' },
        { label: '[나눔공동체학교]', text: '느린학습자 청소년 생태먹거리 프로젝트 수업' },
        { text: '', image: '/insight-kit.jpg', caption: '총 17개 주제별 강의 키트' },
        { text: '', image: '/insight-lecture.jpg', caption: '목적, 대상에 맞는 이야기 전달' },
      ],
    },
  ],
  실천: [
    {
      icon: '🍳',
      image: '/practice-hero.jpg',
      title: '제철 식탁 실천 클래스 (가제)',
      desc: '식재료와 조리법을 직접 다뤄보며 나의 식사 습관과 태도를 돌아보는 프로그램이에요.',
      link: '#',
      heading: '[음식시민 되기] 식재료 이해부터 조리까지 직접 경험하며, 나의 맛 감각과 식사 습관을 만들어가는 식사자립교육',
      bullets: [
        {
          label: '식사자립교육',
          text: '식재료 이해부터 조리법까지, 일상을 돌보는 주체적인 식사 역량을 습득합니다.',
          subBullets: [
            '계절 감각: 다채로운 제철 식재료를 감각하고, 재료 이야기 듣기',
            '조립식 레시피: 내 생활에 맞게, 내 감각을 따라 함께 요리하기',
          ],
        },
      ],
      fieldVisits: [
        {
          label: '[서울청년센터] 제철 식사 교육',
          text: "- '조립식 레시피'를 통해 나의 환경과 입맛에 맞게 만들어갑니다.",
          image: '/seoulyouth.jpg',
        },
        {
          label: '[마르쉐 농부시장X벗밭]',
          text: '지구농부들의 제철 꾸러미를 나누고 함께 요리해 먹는 계절 모임입니다.',
          image: '/marche.jpg',
          links: [
            {
              text: '"퇴근후마르쉐는, 이미 존재하던 연결을 알아차리게 해줘요" 윤 님과의 대화 : 벗밭의 벗과 함께 나눈 이야기들',
              url: '#',
            },
          ],
        },
      ],
    },
  ],
  확장: [
    {
      icon: '🚜',
      image: '/expand-hero.jpg',
      title: '농가방문',
      desc: '제철 먹거리를 직접 기르는 농부님을 찾아가 생산 현장을 눈으로 확인하고, 재배 과정과 이야기를 직접 듣는 프로그램이에요.',
      link: '#',
      heading: '[지역 만나기] 밭과 지역을 직접 경험하며 자연과 사람, 먹거리의 연결을 만나는 생태미식캠프 · 프로젝트 수업',
      values: [
        {
          icon: '🌳',
          titleKo: '생태',
          titleEn: 'Ecology',
          desc: '기후, 토양, 종 다양성, 제철의 흐름을 이해하며 식재료를 **살아있는 생태계의 일부**로 인식합니다.',
          sdgs: ['SDG 13 기후변화 대응', 'SDG 15 육상 생태계 보전', 'SDG 12 책임 있는 소비와 생산'],
        },
        {
          icon: '🍚',
          titleKo: '미식',
          titleEn: 'Gastronomy',
          desc: '**어디서·누가·어떻게 만든 음식인가**를 질문합니다. 음식을 통해 문화, 노동, 지역의 이야기를 알아갑니다.',
          sdgs: ['SDG 3 건강과 웰빙', 'SDG 12 책임 있는 소비와 생산'],
        },
        {
          icon: '🤝',
          titleKo: '관계',
          titleEn: 'Relationship',
          desc: '사람과 사람, 사람과 자연을 잇는 관계를 회복합니다. 관계맺고 대화하며 **서로에게 기대고, 서로를 환대하는 존재**로 만납니다.',
          sdgs: ['SDG 11 지속가능한 도시와 공동체'],
        },
        {
          icon: '🕊️',
          titleKo: '커뮤니티',
          titleEn: 'Community',
          desc: '함께 먹고, 만들고, 이야기한 경험이 한 번의 체험을 넘어 **관계의 기억**으로 남도록 합니다. 캠프 이후에도 이어지는 느슨하지만 지속적인 연결을 지향합니다.',
          sdgs: ['SDG 11 지속가능한 도시와 공동체'],
        },
        {
          icon: '🏃',
          titleKo: '실천',
          titleEn: 'Practice',
          desc: '캠프에서의 **배움이 각자의 일상 식탁과 선택으로 이어지도록** 설계합니다. 환경적으로도, 저마다의 삶에서도 지속 가능한 실천을 함께 찾아나갑니다.',
          sdgs: ['SDG 12 책임 있는 소비와 생산', 'SDG 4 양질의 교육'],
        },
      ],
      fieldVisits: [
        {
          label: '[밭에서 만나는 계절]',
          text: '아이들과 함께 식탁 너머 작물이 자라는 모습을 관찰하고 함께 밭에서 식탁까지의 과정을 경험해요. 오감으로 밭을 즐겨요!',
        },
        {
          label: '[샐러드연맹X벗밭]',
          text: '냉이마트 — 당신이 먹는 냉이는 마트에서 자라는 게 아니에요! 마트에서는 보이지 않는 풍경을 직접 만나고 바로 캔 냉이를 함께 맛보는 시간! 다양한 식물들의 이름도 살펴보아요.',
          image: '/naengi-mart.jpg',
        },
      ],
    },
    {
      icon: '🏕️',
      image: '/ecocamp-hero.jpg',
      title: '생태미식캠프, 생태미식여행학교',
      desc: '지역의 자연과 먹거리, 사람을 며칠간 깊이 만나는 캠프형 프로그램이에요.',
      link: '#',
      heading: '[지역 만나기] 밭과 지역을 직접 경험하며 자연과 사람, 먹거리의 연결을 만나는 생태미식캠프 · 프로젝트 수업',
      video: {
        embedUrl: 'https://drive.google.com/file/d/1J9j2nLk2Bn1oE1FEw1gOWnZ-rEEyH3Jm/preview',
        caption: '생태미식캠프 예시 영상',
      },
    },
    {
      icon: '🍽️',
      image: null,
      title: '식문화 PBL - 환대의식탁',
      desc: '우리 지역의 먹거리 문제를 직접 발견하고, 더 나은 식문화를 스스로 기획해보는 프로젝트 기반 학습(PBL) 프로그램이에요.',
      link: '#',
      heading: '[지역 만나기] 밭과 지역을 직접 경험하며 자연과 사람, 먹거리의 연결을 만나는 생태미식캠프 · 프로젝트 수업',
      fieldVisits: [
        {
          label: '[서강대X벗밭]',
          text: "<환대의 식탁>, <혼디드렁> 다양한 지역에서 내가 딛고 있는 땅과 이웃과 더불어 살아가는 사람들을 만나 이야기하고, '나는 어떻게 살고 싶은가?'에 관해 이야기합니다.",
          image: '/sogang-pbl.jpg',
          links: [
            { text: '관련 콘텐츠 보기 (영상)', url: 'https://youtu.be/ouC9Aksn3cM?si=ip9L-WBma8b73zC_' },
            {
              text: '관련 콘텐츠 보기 (보도자료)',
              url: 'https://www.sogang.ac.kr/ko/detail/547874?namepage=StoryMedia&text=%EC%84%9C%EA%B0%95+Story&redirect=/ko/story/media-center?tab=1',
            },
          ],
        },
      ],
    },
  ],
  안내: [
    {
      icon: '🧑‍🏫',
      image: '/guide-hero.jpg',
      title: '식문화 교육 퍼실리테이터 과정 (가제)',
      desc: '좋은 식경험을 직접 기획하고 진행할 수 있도록 교육·활동 설계 방법을 안내하는 프로그램이에요.',
      link: '#',
      // TODO: 안내하기 카드의 실제 사례 텍스트/사진을 받으면 heading 아래에 bullets·fieldVisits로 채우기
      heading: '[경험 나누기] 좋은 식문화를 자신의 교육과 활동으로 기획하고 나누는 강사교육 · 퍼실리테이터 양성',
      bullets: [{ text: '내가 배운 것을 다른 사람에게 전할 수 있는 힘을 길러줘요.' }],
    },
  ],
};
