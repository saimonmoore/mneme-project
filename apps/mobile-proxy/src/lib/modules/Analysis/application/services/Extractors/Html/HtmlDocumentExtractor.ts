import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

type HtmlDocument = {
  title: string;
  keywords: string[];
  text: string;
};

export class HtmlDocumentExtractor {
  static async extract(url: string): Promise<HtmlDocument> {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract keywords from metadata
    const keywordsString = $('meta[name="keywords"]').attr('content') || '';
    const keywords = keywordsString.split(',').map((keyword: string) => keyword.trim());

    // Extract title
    const title = $('title').text();

    // Extract content as text
    const text = $('body').text();

    return {
      title,
      keywords,
      text,
    };
  }
}

// const url = 'https://www.example.com';

// HtmlDocumentExtractor.extract(url)
//   .then(({ title, keywords, text }) => {
//     console.log('Title:', title);
//     console.log('Keywords:', keywords);
//     console.log('Text:', text);
//   })
//   .catch(error => {
//     console.error('Error fetching website:', error);
//   });