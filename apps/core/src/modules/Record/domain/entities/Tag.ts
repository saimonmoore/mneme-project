import { Record } from "@/modules/Record/domain/entities/Record.js";
import { TagDto } from "@/modules/Record/domain/dtos/TagDto.js";
import { TagInputDto } from "@/modules/Record/domain/dtos/TagInputDto.js";
import { TagSchema } from "@/modules/Record/domain/entities/TagSchema.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";
import { User } from "@/modules/User/domain/entities/User.js";

export class Tag {
  static TAGS_KEY = "org.mneme.tags";
  static TAGS_BY_LABEL_KEY = "org.mneme.tagsByLabel";

  static TAGS_BY_USER_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Tag.TAGS_KEY}!`;
  static MY_TAGS_BY_LABEL_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!${Tag.TAGS_BY_LABEL_KEY}!`;

  label: string;
  wikiLink?: string;
  _records: Set<Record>;

  get hash(): string {
    return sha256(this.label);
  }

  constructor({ label, wikiLink }: TagInputDto) {
    this.label = label;
    this.wikiLink = wikiLink;

    this._records = new Set();

    this.validate();
  }

  static fromProperties(properties: TagInputDto) {
    return new Tag(properties);
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

  toProperties(): TagDto {
    return {
      label: this.label,
      wikiLink: this.wikiLink,
      records: this.records,
    };
  }
}
