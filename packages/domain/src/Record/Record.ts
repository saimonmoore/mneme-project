import { KeywordCommon, UserCommon } from "@mneme/domain"
import type { Hash } from "@mneme/domain"

export type RecordUrl = `http(s?)://${string}`;
export enum RecordLanguage {
  ENGLISH = "en",
  GREEK = "el",
  CATALAN = "ca",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de"
}

export enum RecordType {
  TWITTER = "twitter",
  BLUESKY = "bsky",
  YOUTUBE = "youtube",
  GITHUB = "github",
  HTML = "html",
  PDF = "pdf",
  UNKNOWN = "unknown",
}

export interface RecordCommon {
  url: RecordUrl;
  hash?: Hash;
  type: RecordType;
  title: string;
  image?: string;
  logo?: string;
  description?: string;
  publisher?: string;
  keywords: Partial<KeywordCommon>[];
  createdAt?: Date;
  updatedAt?: Date;
  language?: RecordLanguage;
  creator?: Partial<UserCommon>;
  creatorId?: Hash;
};