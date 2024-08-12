import { agnosticFetch } from '../../../../../infrastructure/http.js';
import { HtmlTextExtractorBrowser } from './HtmlTextExtractorBrowser.js';
import { HtmlTextExtractorNode } from './HtmlTextExtractorNode.js';

const isBrowser: boolean =
  typeof (global as any).window !== 'undefined' &&
  typeof (global as any).window.document !== 'undefined';

type TextExtraction = {
  type?: string;
  text?: string;
  description?: string;
};

export class TextExtractor {
  private url: string;
  public extraction: TextExtraction = {};

  constructor(url: string) {
    this.url = url;
  }

  public async extractText() {
    let response;
    let contentType;
    let bodyText;

    response = await agnosticFetch.get(this.url);
    bodyText = await response.text();
    contentType = response.headers['content-type'];
    this.extraction.type = contentType ? contentType.split(';')[0] : 'unknown';

    switch (this.extraction.type) {
      case 'text/html': {
        const extractedText = await this.extractHtmlText(bodyText);
        Object.assign(this.extraction, extractedText);

        break;
      }

      case 'unknown': {
        throw new Error('[TextExtractor] Unknown content type');
        break;
      }

      default: {
        const extractedText = await this.extractHtmlText(bodyText);
        Object.assign(this.extraction, extractedText);

        break;
      }
    }
  }

  async extractHtmlText(bodyText: string): Promise<TextExtraction> {
    const extractor = isBrowser
      ? new HtmlTextExtractorBrowser(bodyText)
      : new HtmlTextExtractorNode(bodyText);

    return extractor.extract();
  }
}
