import { sha256 } from "@/infrastructure/helpers/hash.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { RecordDto } from "@/modules/Record/domain/dtos/RecordDto.js";
import { RecordInputDto } from "@/modules/Record/domain/dtos/RecordInputDto.js";
import { TagInputDto } from "@/modules/Record/domain/dtos/TagInputDto.js";
import { KeywordInputDto } from "@/modules/Record/domain/dtos/KeywordInputDto.js";
import { RecordSchema } from "@/modules/Record/domain/entities/RecordSchema.js";
import { Tag } from "@/modules/Record/domain/entities/Tag.js";
import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";

export type MnemeTopic = {
  label: string;
  wikiLink: string;
};

export enum MnemeRecordType {
  TWITTER = "twitter",
  YOUTUBE = "youtube",
  HTML = "html",
  PDF = "pdf",
}

export type MnemeRecord = {
  url: string;
  type: MnemeRecordType;
  keywords: MnemeTopic[];
  tags: MnemeTopic[];
  createdAt: string;
  updatedAt: string;
  hash?: string;
  language?: string;
  creatorHash: string;
  creator?: User;
};

export class Record {
  static RECORDS_KEY = "org.mneme.records!";
  static RECORDS_BY_USER_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}!`;
  static RECORD_BY_USER_KEY = (userKey: string, recordHash: string) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}!${recordHash}`;

  static ACTIONS = {
    CREATE: "createRecord",
    UPDATE: "updateRecord",
    DELETE: "deleteRecord",
  };

  url: string;
  language: string | undefined;
  type: MnemeRecordType;
  _keywords: Set<Tag>;
  _tags: Set<Keyword>;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: User | undefined;

  constructor({
    url,
    type,
    language,
    keywords,
    tags,
    creatorId,
  }: RecordInputDto) {
    this.url = url;
    this.type = type;
    this.creatorId = creatorId;

    this.addTags(tags);
    this.addKeywords(keywords);

    if (language) {
      this.language = language;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.validate();
  }

  setCreator(user: User) {
    this.creator = user;
  }

  static getMnemeRecordTypeList() {
    return Object.values(MnemeRecordType);
  } 

  static fromProperties(properties: RecordInputDto) {
    return new Record(properties);
  }

  get hash(): string {
    return sha256(this.url);
  }

  get key() {
    return Record.RECORDS_KEY + this.hash;
  }

  set tags(tags: TagInputDto | TagInputDto[]) {
    Array(tags || [])
      .flat()
      .forEach((tag) => this._tags.add(Tag.fromProperties(tag)));
  }

  get tags(): Tag[] {
    return Array.from(this._tags);
  }

  set keywords(keywords: KeywordInputDto | KeywordInputDto[]) {
    Array(keywords || [])
      .flat()
      .forEach((keyword) =>
        this._keywords.add(Keyword.fromProperties(keyword))
      );
  }

  get keywords(): Keyword[] {
    return Array.from(this._keywords);
  }

  validate() {
    return RecordSchema.parse(this.toProperties());
  }

  toProperties(): RecordDto {
    return {
      url: this.url,
      type: this.type,
      keywords: this.keywords,
      tags: this.tags,
      creatorId: this.creatorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private addTags(tags?: TagInputDto[]) {
    this._tags = tags
      ? new Set(tags.filter(Boolean).map((tag) => Tag.fromProperties(tag)))
      : new Set();
  }

  private addKeywords(keywords?: KeywordInputDto[]) {
    this._keywords = keywords
      ? new Set(
          keywords
            .filter(Boolean)
            .map((keyword) => Keyword.fromProperties(keyword))
        )
      : new Set();
  }
}
