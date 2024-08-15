import { Keyword } from '../Keyword';
import { KeywordInputDto } from '../../dtos/KeywordInputDto';

describe('Keyword', () => {
  const validKeywordInput: KeywordInputDto = {
    label: 'Test Keyword',
    wikiLink: 'https://en.wikipedia.org/wiki/Test',
    hash: '9936777a0bf346b4e5b19dd4cd8e67849f016683448b5316eaeafc6c8d609ca3',
  };

  describe('fromProperties', () => {
    it('should create a Keyword instance from valid input', () => {
      const keyword = Keyword.fromProperties(validKeywordInput);
      expect(keyword).toBeInstanceOf(Keyword);
      expect(keyword.label).toBe(validKeywordInput.label);
      expect(keyword.wikiLink).toBe(validKeywordInput.wikiLink);
      expect(keyword.hash).toBe(validKeywordInput.hash);
    });
  });

  describe('validate', () => {
    it('should return no errors for valid input', () => {
      const keyword = Keyword.fromProperties(validKeywordInput);
      expect(() => {
        keyword.validate();
      }).not.toThrow();
    });

    it('should return errors for invalid input', () => {
      const invalidKeyword = Keyword.fromProperties({
        ...validKeywordInput,
        label: null!,
        wikiLink: 'invalid-url',
      });

      try {
        invalidKeyword.validate();
      } catch (error) {
        expect(JSON.parse((error as Error).message)).toEqual([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'null',
            message: 'Expected string, received null',
            path: ['label'],
          },
        ]);
      }
    });
  });

  describe('equals', () => {
    it('should return true for keywords with the same label (case-insensitive)', () => {
      const keyword1 = Keyword.fromProperties(validKeywordInput);
      const keyword2 = Keyword.fromProperties({
        ...validKeywordInput,
        label: 'TEST KEYWORD',
      });
      expect(keyword1.equals(keyword2)).toBe(true);
    });

    it('should return false for keywords with different labels', () => {
      const keyword1 = Keyword.fromProperties(validKeywordInput);
      const keyword2 = Keyword.fromProperties({
        ...validKeywordInput,
        label: 'Different Keyword',
      });
      expect(keyword1.equals(keyword2)).toBe(false);
    });
  });

  describe('hashCode', () => {
    it('should return the same hash code for equal keywords', () => {
      const keyword1 = Keyword.fromProperties(validKeywordInput);
      const keyword2 = Keyword.fromProperties({
        ...validKeywordInput,
        label: 'TEST KEYWORD',
      });
      expect(keyword1.hashCode()).toBe(keyword2.hashCode());
    });

    it('should return different hash codes for different keywords', () => {
      const keyword1 = Keyword.fromProperties(validKeywordInput);
      const keyword2 = Keyword.fromProperties({
        ...validKeywordInput,
        label: 'Different Keyword',
      });
      expect(keyword1.hashCode()).not.toBe(keyword2.hashCode());
    });
  });
});
