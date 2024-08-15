import { KeywordCommon, UserCommon } from "@mneme/domain"
import type { Hash } from "@mneme/domain"

type Http = 'http';
type Https = 'https'
export type RecordUrl = `${Http | Https}://${string}`;

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

// TODO: Fix domain entities to not have optional fields
// TODO: Fix common input & output Dto's
export interface RecordCommon {
  url: RecordUrl;
  hash?: Hash;
  type: RecordType;
  title?: string;
  image?: string;
  logo?: string;
  description?: string;
  publisher?: string;
  keywords?: Partial<KeywordCommon>[];
  createdAt?: Date;
  updatedAt?: Date;
  language?: RecordLanguage;
  creator?: Partial<UserCommon>;
  creatorId?: Hash;
};