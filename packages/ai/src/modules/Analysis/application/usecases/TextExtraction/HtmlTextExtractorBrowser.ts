export class HtmlTextExtractorBrowser {
  private bodyText: string;

  constructor(bodyText: string) {
    this.bodyText = bodyText;
  }

  extract(): { text: string; description?: string } {
    const parser = new (global as any).DOMParser();
    const doc = parser.parseFromString(this.bodyText, 'text/html');
    const text = doc.body.innerText;
    const description =
      doc.head
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || undefined;

    return { text, description };
  }
}
