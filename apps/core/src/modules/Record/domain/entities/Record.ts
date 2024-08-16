import { sha256 } from '@/infrastructure/helpers/hash.js';
import { User } from '@/modules/User/domain/entities/User.js';
import { RecordDto } from '@/modules/Record/domain/dtos/RecordDto.js';
import { RecordInputDto } from '@/modules/Record/domain/dtos/RecordInputDto.js';
import { KeywordInputDto } from '@/modules/Record/domain/dtos/KeywordInputDto.js';
import { RecordSchema } from '@/modules/Record/domain/entities/RecordSchema.js';
import { Keyword } from '@/modules/Record/domain/entities/Keyword.js';

import { RecordType, RecordLanguage } from '@mneme/domain';
import type { Hash, RecordCommon, RecordUrl } from '@mneme/domain';
import { UniquePairSet } from '@/infrastructure/core/UniquePairSet/UniquePairSet.js';

export type MnemeRecord = RecordCommon & {
  creatorHash: Hash;
  creator?: User;
};

export class Record {
  static RECORDS_KEY = 'org.mneme.records!';
  static RECORDS_BY_USER_KEY = (userKey: Hash) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}`;
  static RECORD_BY_USER_KEY = (userKey: Hash, recordHash: Hash) =>
    `${User.USERS_KEY}${userKey}!${Record.RECORDS_KEY}${recordHash}`;

  static ACTIONS = {
    CREATE: 'createRecord',
    UPDATE: 'updateRecord',
    DELETE: 'deleteRecord',
  };

  _hash?: Hash;
  url: RecordUrl;
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  publisher?: string;
  language: RecordLanguage | undefined;
  type: RecordType;
  _keywords: UniquePairSet<Keyword>;
  createdAt: Date;
  updatedAt: Date;
  creatorId?: Hash;
  creator?: User;

  constructor({
    hash,
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
    this._hash = hash;
    this.url = url;
    this.type = type;
    this.creatorId = creatorId;

    this._keywords = new UniquePairSet<Keyword>({
      id: 'hash',
      label: 'label',
    });
    this.addKeywords(keywords);

    this.title = title;
    this.description = description;
    this.image = image;
    this.logo = logo;
    this.publisher = publisher;
    this.language = language;

    this.createdAt = new Date();
    this.updatedAt = new Date();
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

  get hash(): Hash {
    return this._hash || sha256(this.url);
  }

  set hash(hash: Hash) {
    this._hash = hash;
  }

  get key() {
    return Record.RECORDS_KEY + this.hash;
  }

  set keywords(keywords: KeywordInputDto | KeywordInputDto[]) {
    this.addKeywords(keywords);
  }

  get keywords(): Keyword[] {
    return Array.from(this._keywords);
  }

  getKeywordByLabel(label: string): Keyword | undefined {
    return this._keywords.getByLabel(label);
  }

  getKeywordByHash(hash: Hash): Keyword | undefined {
    return this._keywords.get(hash);
  }

  validate() {
    return RecordSchema.parse(this.toProperties());
  }

  toProperties(): RecordDto {
    return {
      url: this.url,
      hash: this.hash,
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

  addKeywords(keywords?: KeywordInputDto | KeywordInputDto[]) {
    if (!keywords) return;

    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    keywordArray
      .filter(Boolean)
      .forEach((keyword) =>
        this._keywords.add(Keyword.fromProperties(keyword))
      );
  }

  updateKeywords(keywords?: KeywordInputDto | KeywordInputDto[]) {
    if (!keywords) return;

    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    keywordArray.forEach((keyword) =>
      this._keywords.update(Keyword.fromProperties(keyword))
    );
  }
}
