import { categorizeUrlViaMicrolink } from './MicrolinkUrlCategorizer';

export enum MnemePublishers {
  GitHub = 'GitHub',
  Wikipedia = 'Wikipedia',
  YouTube = 'YouTube',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
}

export type UrlCategorization = {
  url: string;
  publisher?: string;
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  language?: string;
};

export async function categorizeUrl(url: string): Promise<UrlCategorization> {
  return categorizeUrlViaMicrolink(url);
}
