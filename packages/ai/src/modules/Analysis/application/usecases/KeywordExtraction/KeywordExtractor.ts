import { extractKeywords } from '../../../infrastructure/KeywordExtraction/OpenAiKeywordExtractor.js';

export type KeywordExtractionResponse = {
  keywords: string[];
}

export class KeywordExtractor {
  keywords = [];
  numKeywords = 3;
  text: string;

  constructor(text: string, numKeywords = 3) {
    this.text = text;
    this.numKeywords = numKeywords;
  }

  async extractKeywords() {
    this.keywords = await extractKeywords(this.text, this.numKeywords);

    return this;
  }
}
