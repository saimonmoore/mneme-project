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

    it('should add a single keyword without a hash', () => {
      record.keywords = { label: 'JavaScript' };
      expect(record.keywords).toHaveLength(1);
      expect(record.keywords[0].label).toBe('javascript');
      expect(record.keywords[0].hash).toBeDefined();
      expect(record.keywords[0].hash.length).toBe(64);
    });

    it('should add a single keyword with a hash', () => {
      const hash = '9936777a0bf346b4e5b19dd4cd8e67849f016683448b5316eaeafc6c8d609ca3';
      record.keywords = { label: 'JavaScript', hash };
      expect(record.keywords).toHaveLength(1);
      expect(record.keywords[0].label).toBe('javascript');
      expect(record.keywords[0].hash).toBe(hash);
    });

    it('should add multiple keywords', () => {
      record.keywords = [
        { label: 'JavaScript' },
        { label: 'TypeScript' },
        { label: 'React' },
      ];
      expect(record.keywords).toHaveLength(3);
      expect(record.keywords.map(k => k.label)).toEqual(['javascript', 'typescript', 'react']);
    });

    it('should not add duplicate keywords (case-insensitive)', () => {

      record.keywords = [
        { label: 'JavaScript' },
        { label: 'TypeScript' },
      ];

      expect(record.keywords).toHaveLength(2);

      expect(() => {
        record.keywords = [
          { label: 'javascript' },
        ];
      }).toThrow(/already exists/);

      expect(record.keywords.map(k => k.label)).toEqual(['javascript', 'typescript']);
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
      expect(record.keywords.map(k => k.label)).toEqual(['javascript', 'typescript', 'react', 'vue']);
    });

    it('should update keywords', () => {
      record.keywords = { label: 'JavaScript' };
      record.keywords = { label: 'TypeScript' };
      record.keywords = [{ label: 'React' }, { label: 'Vue' }];
      expect(record.keywords).toHaveLength(4);
      expect(record.keywords.map(k => k.label)).toEqual(['javascript', 'typescript', 'react', 'vue']);

      const typescript = record.getKeywordByLabel('typescript');
      const typescriptHash = typescript?.hash;
      expect(typescript).toBeDefined();
      expect(typescript?.label).toBe('typescript');
      expect(typescriptHash).toBeDefined();
      expect(typescriptHash?.length).toBe(64);

      record.updateKeywords({...typescript, label: 'TS' });

      expect(record.keywords).toHaveLength(4);
      expect(record.keywords.map(k => k.label)).toEqual(['javascript', 'ts', 'react', 'vue']);

      const ts = record.getKeywordByLabel('ts');
      expect(ts).toBeDefined();
      expect(ts?.label).toBe('ts');
      expect(ts?.hash).toBe(typescriptHash);
    });
  });
});