import { categorizeUrlViaMicrolink } from '../../../infrastructure/UrlCategorization/MicrolinkUrlCategorizer.js';

export enum MnemePublishers {
  GitHub = 'GitHub',
  Wikipedia = 'Wikipedia',
  YouTube = 'YouTube',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
}

export type UrlCategorization = {
  publisher?: string;
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  language?: string;
};

export class UrlCategorizer {
  categorization: UrlCategorization;
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async categorizeUrl(): Promise<UrlCategorizer> {
    this.categorization = await categorizeUrlViaMicrolink(this.url);

    return this;
  }
}
