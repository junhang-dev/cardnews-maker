import { GenerateInput, GenerateOutput, Generator, Slide } from './Generator';

const toSeed = (input: GenerateInput): number => {
  const text = `${input.topic}|${input.keywords.join('|')}`.trim().toLowerCase();
  let hash = 2166136261;

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const pick = <T>(values: T[], seed: number, offset: number): T => {
  const index = (seed + offset) % values.length;
  return values[index];
};

export class MockGenerator implements Generator {
  async generate(input: GenerateInput): Promise<GenerateOutput> {
    const keywords = input.keywords.length > 0 ? input.keywords : ['핵심', '기본', '실전'];
    const seed = toSeed(input);

    const tone = ['친절한', '직관적인', '실무형', '초보자 친화적인'];
    const verbs = ['이해하기', '적용하기', '점검하기', '개선하기'];
    const formats = ['체크리스트', '요약', '가이드', '템플릿'];

    const slides: Slide[] = [
      {
        title: `${input.topic}: 한눈에 보기`,
        body: `${pick(tone, seed, 1)} 흐름으로 ${input.topic}의 전체 구조를 8장 안에 정리합니다.`,
      },
      {
        title: `왜 중요한가`,
        body: `${input.topic}를 잘하면 ${pick(formats, seed, 2)} 기반으로 의사결정 속도가 빨라집니다.`,
      },
      {
        title: `핵심 키워드 1 - ${keywords[0]}`,
        body: `${keywords[0]} 중심으로 문제를 정의하고, 목표를 숫자로 명확히 설정합니다.`,
      },
      {
        title: `핵심 키워드 2 - ${keywords[1 % keywords.length]}`,
        body: `${keywords[1 % keywords.length]} 단계에서는 작은 단위로 실행해 빠른 피드백을 받습니다.`,
      },
      {
        title: `핵심 키워드 3 - ${keywords[2 % keywords.length]}`,
        body: `${keywords[2 % keywords.length]} 관점에서 결과를 기록하고 다음 실험에 반영합니다.`,
      },
      {
        title: `자주 하는 실수`,
        body: `${pick(verbs, seed, 3)} 전에 범위를 너무 넓게 잡는 실수를 피하세요.`,
      },
      {
        title: `실행 루틴`,
        body: `매일 15분: 계획 → 실행 → 회고 순서로 ${input.topic} 루틴을 유지합니다.`,
      },
      {
        title: `마무리`,
        body: `오늘의 한 줄: "${keywords[0]}부터 작게 시작하면 ${input.topic}는 꾸준히 성장합니다."`,
      },
    ];

    return { slides: slides as GenerateOutput['slides'] };
  }
}
