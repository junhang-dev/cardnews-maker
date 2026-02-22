import { Generator } from './Generator';
import { MockGenerator } from './MockGenerator';
import { OpenAIGenerator, OpenAIGeneratorDeps } from './OpenAIGenerator';

export type GeneratorProvider = 'mock' | 'openai';

export interface CreateGeneratorOptions {
  provider?: GeneratorProvider;
  openAI?: OpenAIGeneratorDeps;
}

export const createGenerator = (options: CreateGeneratorOptions = {}): Generator => {
  const provider = options.provider ?? 'mock';

  if (provider === 'openai') {
    if (!options.openAI) {
      throw new Error('OpenAI provider requires openAI deps');
    }

    return new OpenAIGenerator(options.openAI);
  }

  return new MockGenerator();
};

export * from './Generator';
export * from './MockGenerator';
export * from './OpenAIGenerator';
