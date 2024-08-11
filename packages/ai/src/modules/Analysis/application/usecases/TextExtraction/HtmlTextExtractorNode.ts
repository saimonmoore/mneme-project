import * as cheerio from 'cheerio';

export class HtmlTextExtractorNode {
  private bodyText: string;

  constructor(bodyText: string) {
    this.bodyText = bodyText;
  }

  extract(): { text: string; description?: string } {
    const $ = cheerio.load(this.bodyText);
    const text = $('body').text();
    const description =
      $('meta[name="description"]').attr('content') || undefined;

    return { text, description };
  }
}
