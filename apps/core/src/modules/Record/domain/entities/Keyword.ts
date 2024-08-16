import { KeywordDto } from '@/modules/Record/domain/dtos/KeywordDto.js';
import { KeywordInputDto } from '@/modules/Record/domain/dtos/KeywordInputDto.js';
import { KeywordSchema } from '@/modules/Record/domain/entities/KeywordSchema.js';
import { uuid } from '@/infrastructure/helpers/uuid.js';
import { User } from '@/modules/User/domain/entities/User.js';
import type { Hash } from '@mneme/domain';

export class Keyword {
  static KEYWORDS_KEY = 'org.mneme.keywords';
  static KEYWORDS_BY_LABEL_KEY = 'org.mneme.keywordsByLabel';

  static KEYWORDS_BY_USER_KEY = (userKey: Hash) =>
    `${User.USERS_KEY}${userKey}!${Keyword.KEYWORDS_KEY}!`;
  static MY_KEYWORDS_BY_LABEL_KEY = (userKey: Hash) =>
    `${User.USERS_KEY}${userKey}!${Keyword.KEYWORDS_BY_LABEL_KEY}!`;

  hash: Hash;
  label: string;
  _records: Set<Hash>;

  constructor({ label, hash }: KeywordInputDto) {
    this.label = label.toLowerCase();
    this.hash = hash || uuid();

    this._records = new Set<Hash>();
  }

  static fromProperties(properties: KeywordInputDto) {
    return new Keyword(properties);
  }

  set records(records: Hash | Hash[]) {
    Array(records || [])
      .flat()
      .forEach((recordHash) => this._records.add(recordHash));
  }

  get records(): Hash[] {
    return Array.from(this._records);
  }

  validate() {
    return KeywordSchema.parse({
      label: this.label,
    });
  }

  toProperties(): KeywordDto {
    return {
      hash: this.hash,
      label: this.label,
    };
  }

  equals(other: Keyword): boolean {
    return this.label.toLowerCase() === other.label.toLowerCase();
  }

  hashCode(): number {
    return this.label
      .toLowerCase()
      .split('')
      .reduce((acc, char) => {
        return (acc << 5) - acc + char.charCodeAt(0);
      }, 0);
  }
}
