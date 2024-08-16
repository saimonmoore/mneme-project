import { UniquePairSet, UniqueFields } from '../UniquePairSet';
import { v4 as uuidv4 } from 'uuid';

interface TestItem {
  id: string;
  keyword: string;
  additionalProp?: string;
}

const uniqueFields: UniqueFields<TestItem> = {
  id: 'id',
  label: 'keyword',
};

describe('UniquePairSet', () => {
  let set: UniquePairSet<TestItem>;

  beforeEach(() => {
    set = new UniquePairSet<TestItem>(uniqueFields);
  });

  test('should add items successfully', () => {
    const item1 = { id: uuidv4(), keyword: 'test1' };
    const item2 = { id: uuidv4(), keyword: 'test2' };

    set.add(item1);
    set.add(item2);

    expect(set.size).toBe(2);
    expect(set.has(item1.id)).toBe(true);
    expect(set.hasLabel(item1.keyword)).toBe(true);
  });

  test('should normalize id and keyword', () => {
    const item = { id: 'TEST-ID', keyword: 'TEST-KEYWORD' };
    set.add(item);

    expect(set.has('test-id')).toBe(true);
    expect(set.hasLabel('test-keyword')).toBe(true);
  });

  test('should throw error when adding item with duplicate id', () => {
    const item1 = { id: 'test-id', keyword: 'test1' };
    const item2 = { id: 'test-id', keyword: 'test2' };

    set.add(item1);
    expect(() => set.add(item2)).toThrow(
      "Item with id 'test-id' already exists.",
    );
  });

  test('should throw error when adding item with duplicate keyword', () => {
    const item1 = { id: uuidv4(), keyword: 'test' };
    const item2 = { id: uuidv4(), keyword: 'test' };

    set.add(item1);
    expect(() => set.add(item2)).toThrow(
      "Item with label 'test' already exists.",
    );
  });

  test('should update item successfully', () => {
    const item = { id: 'test-id', keyword: 'test1' };
    set.add(item);

    const updatedItem = {
      id: 'test-id',
      keyword: 'test2',
      additionalProp: 'new',
    };
    set.update(updatedItem);

    expect(set.size).toBe(1);
    expect(set.get('test-id')).toEqual(updatedItem);
    expect(set.hasLabel('test1')).toBe(false);
    expect(set.hasLabel('test2')).toBe(true);
  });

  test('should throw error when updating non-existent item', () => {
    const item = { id: 'non-existent', keyword: 'test' };
    expect(() => set.update(item)).toThrow(
      "Item with id 'non-existent' does not exist.",
    );
  });

  test('should throw error when updating item with existing keyword', () => {
    const item1 = { id: 'id1', keyword: 'test1' };
    const item2 = { id: 'id2', keyword: 'test2' };
    set.add(item1);
    set.add(item2);

    const updatedItem = { id: 'id1', keyword: 'test2' };
    expect(() => set.update(updatedItem)).toThrow(
      "Item with label 'test2' already exists.",
    );
  });

  test('should delete item successfully', () => {
    const item = { id: 'test-id', keyword: 'test' };
    set.add(item);

    expect(set.delete('test-id')).toBe(true);
    expect(set.size).toBe(0);
    expect(set.has('test-id')).toBe(false);
    expect(set.hasLabel('test')).toBe(false);
  });

  test('should return false when deleting non-existent item', () => {
    expect(set.delete('non-existent')).toBe(false);
  });

  test('should clear all items', () => {
    set.add({ id: 'id1', keyword: 'test1' });
    set.add({ id: 'id2', keyword: 'test2' });

    set.clear();
    expect(set.size).toBe(0);
  });

  test('should be iterable', () => {
    const items = [
      { id: 'id1', keyword: 'test1' },
      { id: 'id2', keyword: 'test2' },
    ];

    items.forEach((item) => set.add(item));

    const iteratedItems = Array.from(set);
    expect(iteratedItems).toEqual(items);
  });

  test('should handle additional properties', () => {
    const item = { id: 'test-id', keyword: 'test', additionalProp: 'extra' };
    set.add(item);

    const retrievedItem = set.get('test-id');
    expect(retrievedItem).toEqual(item);
  });

  test('should ignore case when comparing keywords', () => {
    const item1 = { id: 'id1', keyword: 'test' };
    const item2 = { id: 'id2', keyword: 'TEST' };

    set.add(item1);
    expect(() => set.add(item2)).toThrow(
      "Item with label 'test' already exists.",
    );
  });

  test('should allow updating additional properties', () => {
    const item = { id: 'test-id', keyword: 'test', additionalProp: 'old' };
    set.add(item);

    const updatedItem = {
      id: 'test-id',
      keyword: 'test',
      additionalProp: 'new',
    };
    set.update(updatedItem);

    expect(set.get('test-id')).toEqual(updatedItem);
  });
});
