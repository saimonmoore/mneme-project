import { sha256 } from '@/infrastructure/helpers/hash.js';
import { User } from '@/modules/User/domain/entities/User.js';
import { RecordDto } from '@/modules/Record/domain/dtos/RecordDto.js';
import { RecordInputDto } from '@/modules/Record/domain/dtos/RecordInputDto.js';
import { KeywordInputDto } from '@/modules/Record/domain/dtos/KeywordInputDto.js';
import { RecordSchema } from '@/modules/Record/domain/entities/RecordSchema.js';
import { Keyword } from '@/modules/Record/domain/entities/Keyword.js';

import { RecordType, RecordLanguage } from '@mneme/domain';
import type { Hash, RecordCommon, RecordUrl } from '@mneme/domain';

export type MnemeRecord = RecordCommon & {
  creatorHash: Hash;
  creator?: User;
};

export class Record {
  static RECORDS_KEY = 'org.mneme.records!';
  static RECORDS_BY_USER_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}`;
  static RECORD_BY_USER_KEY = (userKey: string, recordHash: string) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}${recordHash}`;

  static ACTIONS = {
    CREATE: 'createRecord',
    UPDATE: 'updateRecord',
    DELETE: 'deleteRecord',
  };

  url: RecordUrl;
  title: string;
  description?: string;
  image?: string;
  logo?: string;
  publisher?: string;
  language: RecordLanguage | undefined;
  type: RecordType;
  _keywords: Set<Keyword>;
  createdAt: Date;
  updatedAt: Date;
  creatorId?: Hash;
  creator?: User;

  constructor({
    url,
    type,
    language,
    keywords,
    creatorId,
    title,
    description,
    image,
    logo,
    publisher,
  }: RecordInputDto) {
    this.url = url;
    this.type = type;
    this.creatorId = creatorId;

    this.addKeywords(keywords);

    this.title = title;
    this.description = description;
    this.image = image;
    this.logo = logo;
    this.publisher = publisher;
    this.language = language;

    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.validate();
  }

  setCreator(user: User) {
    if (!user) {
      throw new Error('User is required to set creator');
    }

    this.creator = user;
    this.creatorId = user.hash;
  }

  static getRecordTypeList() {
    return Object.values(RecordType);
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

  set keywords(keywords: KeywordInputDto | KeywordInputDto[]) {
    Array(keywords || [])
      .flat()
      .forEach((keyword) =>
        this._keywords.add(Keyword.fromProperties(keyword)),
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
      title: this.title,
      description: this.description,
      image: this.image,
      logo: this.logo,
      publisher: this.publisher,
      type: this.type,
      language: this.language,
      keywords: this.keywords,
      creator: this.creator,
      creatorId: this.creator?.hash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private addKeywords(keywords?: KeywordInputDto[]) {
    this._keywords = keywords
      ? new Set(
          keywords
            .filter(Boolean)
            .map((keyword) => Keyword.fromProperties(keyword)),
        )
      : new Set();
  }
}
