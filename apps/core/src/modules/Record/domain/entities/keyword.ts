import { MnemeRecord, MnemeTopic } from '@/modules/Record/domain/entities/record.js';

export class KeywordEntity {
  label: string;
  wikiLink: string;
  records: MnemeRecord[] | undefined;

  static create(keyword: MnemeTopic) {
    return new KeywordEntity(keyword);
  }

  constructor({ label, wikiLink, records }: MnemeTopic) {
    this.label = label;
    this.wikiLink = wikiLink;

    if (records) {
      this.records = records;
    }
  }
}
