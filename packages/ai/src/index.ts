import { TextExtractor } from './modules/Analysis/application/usecases/TextExtraction/TextExtractor.js';
import { KeywordExtractor } from './modules/Analysis/application/usecases/KeywordExtraction/KeywordExtractor.js';
import { UrlCategorizer } from './modules/Analysis/application/usecases/UrlCategorization/UrlCategorizer.js';
import type { UrlCategorization } from './modules/Analysis/application/usecases/UrlCategorization/UrlCategorizer.js';

export class UrlAnalyzer {
  url: string;
  categorization: UrlCategorization;
  keywords: string[];
  text: string;
  type: string;
  description: string;

  constructor(url: string) {
    this.url = url;
  }

  async analyze() {
    const categorizer = new UrlCategorizer(this.url);
    this.categorization = (await categorizer.categorizeUrl()).categorization;

    const textExtractor = new TextExtractor(this.url);
    await textExtractor.extractText();

    this.text = textExtractor.extraction.text!;
    this.description = textExtractor.extraction.description!;
    this.type = textExtractor.extraction.type!;

    if (this.text) {
      const extractor = new KeywordExtractor(this.text!);
      this.keywords = (await extractor.extractKeywords()).keywords;
    }

    return this;
  }
}
