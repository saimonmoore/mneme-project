import { MnemeRecord, MnemeTopic } from '@/modules/Record/domain/entities/record.js';

export class TagEntity {
  label: string;
  wikiLink: string;
  records: MnemeRecord[] | undefined;

  static create(tag: MnemeTopic) {
    return new TagEntity(tag);
  }

  constructor({ label, wikiLink, records }: MnemeTopic) {
    this.label = label;
    this.wikiLink = wikiLink;
    if (records) {
      this.records = records;
    }
  }
}
