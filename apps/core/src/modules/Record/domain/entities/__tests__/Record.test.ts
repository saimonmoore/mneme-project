import { Record } from '../Record';
import { RecordType, RecordLanguage } from '@mneme/domain';
import { KeywordInputDto } from '../../dtos/KeywordInputDto';

describe('Record', () => {
  describe('keywords setter', () => {
    let record: Record;

    beforeEach(() => {
      record = new Record({
        url: 'https://example.com',
        type: RecordType.HTML,
        language: RecordLanguage.ENGLISH,
      });
    });

    it('should add a single keyword', () => {
      record.keywords = { label: 'JavaScript' };
      expect(record.keywords).toHaveLength(1);
      expect(record.keywords[0].label).toBe('JavaScript');
    });

    it('should add multiple keywords', () => {
      record.keywords = [
        { label: 'JavaScript' },
        { label: 'TypeScript' },
        { label: 'React' },
      ];
      expect(record.keywords).toHaveLength(3);
      expect(record.keywords.map(k => k.label)).toEqual(['JavaScript', 'TypeScript', 'React']);
    });

    it('should not add duplicate keywords (case-insensitive)', () => {
      record.keywords = [
        { label: 'JavaScript' },
        { label: 'javascript' },
        { label: 'TypeScript' },
      ];
      expect(record.keywords).toHaveLength(2);
      expect(record.keywords.map(k => k.label)).toEqual(['JavaScript', 'TypeScript']);
    });

    it('should handle empty input', () => {
      record.keywords = [];
      expect(record.keywords).toHaveLength(0);
    });


    it('should add keywords incrementally', () => {
      record.keywords = { label: 'JavaScript' };
      record.keywords = { label: 'TypeScript' };
      record.keywords = [{ label: 'React' }, { label: 'Vue' }];
      expect(record.keywords).toHaveLength(4);
      expect(record.keywords.map(k => k.label)).toEqual(['JavaScript', 'TypeScript', 'React', 'Vue']);
    });

    it('should not add duplicate keywords when adding incrementally', () => {
      record.keywords = { label: 'JavaScript' };
      record.keywords = { label: 'TypeScript' };
      record.keywords = [{ label: 'javascript' }, { label: 'React' }];
      expect(record.keywords).toHaveLength(3);
      expect(record.keywords.map(k => k.label)).toEqual(['JavaScript', 'TypeScript', 'React']);
    });

    it('should handle keywords with additional properties', () => {
      const keywordsWithWikiLink: KeywordInputDto[] = [
        { label: 'JavaScript', wikiLink: 'https://en.wikipedia.org/wiki/JavaScript' },
        { label: 'TypeScript', wikiLink: 'https://en.wikipedia.org/wiki/TypeScript' },
      ];
      record.keywords = keywordsWithWikiLink;
      expect(record.keywords).toHaveLength(2);
      expect(record.keywords[0].label).toBe('JavaScript');
      expect(record.keywords[0].wikiLink).toBe('https://en.wikipedia.org/wiki/JavaScript');
      expect(record.keywords[1].label).toBe('TypeScript');
      expect(record.keywords[1].wikiLink).toBe('https://en.wikipedia.org/wiki/TypeScript');
    });
  });
});