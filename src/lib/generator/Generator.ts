export interface GenerateInput {
  topic: string;
  keywords: string[];
}

export interface Slide {
  title: string;
  body: string;
}

export type Slides8 = [
  Slide,
  Slide,
  Slide,
  Slide,
  Slide,
  Slide,
  Slide,
  Slide,
];

export interface GenerateOutput {
  slides: Slides8;
}

export interface Generator {
  generate(input: GenerateInput): Promise<GenerateOutput>;
}
