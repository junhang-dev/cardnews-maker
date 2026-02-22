import { GenerateInput, GenerateOutput, Generator } from './Generator';

export interface OpenAIGeneratorDeps {
  // TODO: OpenAI SDK 클라이언트 타입으로 교체
  client: unknown;
  model?: string;
}

/**
 * OpenAI 기반 생성기 스켈레톤.
 *
 * TODO:
 * - 프롬프트 템플릿 작성(topic, keywords → slide 8장)
 * - JSON schema 기반 응답 검증 및 파싱
 * - 재시도/타임아웃/에러 핸들링 정책 적용
 */
export class OpenAIGenerator implements Generator {
  private readonly model: string;

  constructor(private readonly deps: OpenAIGeneratorDeps) {
    this.model = deps.model ?? 'gpt-4.1-mini';
  }

  async generate(input: GenerateInput): Promise<GenerateOutput> {
    void this.deps.client;
    void this.model;
    void input;

    throw new Error('TODO: Implement generate in OpenAIGenerator');
  }
}
