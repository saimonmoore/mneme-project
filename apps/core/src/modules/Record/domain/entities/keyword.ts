import { Record } from "@/modules/Record/domain/entities/Record.js";
import { KeywordDto } from "@/modules/Record/domain/dtos/KeywordDto.js";
import { KeywordInputDto } from "@/modules/Record/domain/dtos/KeywordInputDto.js";
import { TagSchema } from "@/modules/Record/domain/entities/TagSchema.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";
import { User } from "@/modules/User/domain/entities/User.js";

export class Keyword {
  static KEYWORDS_KEY = "org.mneme.keywords";
  static KEYWORDS_BY_LABEL_KEY = "org.mneme.keywordsByLabel";

  static KEYWORDS_BY_USER_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Keyword.KEYWORDS_KEY}!`;
  static MY_KEYWORDS_BY_LABEL_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Keyword.KEYWORDS_BY_LABEL_KEY}!`;

  label: string;
  wikiLink: string;
  _records: Set<Record>;

  constructor({ label, wikiLink }: KeywordInputDto) {
    this.label = label;
    this.wikiLink = wikiLink;

    this._records = new Set();

    this.validate();
  }

  static fromProperties(properties: KeywordInputDto) {
    return new Keyword(properties);
  }

  get hash(): string {
    return sha256(this.label);
  }

  set records(records: Record | Record[]) {
    Array(records || [])
      .flat()
      .forEach((record) => this._records.add(record));
  }

  get records(): Record[] {
    return Array.from(this._records);
  }

  validate() {
    return TagSchema.parse(this.toProperties());
  }

  toProperties(): KeywordDto {
    return {
      label: this.label,
      wikiLink: this.wikiLink,
      records: this.records,
    };
  }
}
