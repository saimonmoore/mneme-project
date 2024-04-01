import { apifyTwitterScraper } from './apifyTwitterScraper';

export type ScraperOutput = {
  content: string;
  urls: Array<string>;
};

export async function twitterScraper(url: string): Promise<ScraperOutput> {
  return await apifyTwitterScraper(url);
}
