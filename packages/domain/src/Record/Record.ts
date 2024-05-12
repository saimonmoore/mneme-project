import { KeywordCommon, TagCommon, UserCommon } from "@mneme/domain"

export type RecordUrl = `http(s?)://${string}`;
export enum RecordLanguage {
  ENGLISH = "en",
  GREEK = "el",
  CATALAN = "ca",
  SPANISH = "es"
}

export enum RecordType {
  TWITTER = "twitter",
  YOUTUBE = "youtube",
  HTML = "html",
  PDF = "pdf",
}

export interface RecordCommon {
  url: RecordUrl;
  type: RecordType;
  keywords: Partial<KeywordCommon>[];
  tags: Partial<TagCommon>[];
  createdAt?: Date;
  updatedAt?: Date;
  language?: RecordLanguage;
  creator?: Partial<UserCommon>;
};