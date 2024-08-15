import { ObjectSet } from '../ObjectSet';

describe('ObjectSet', () => {
  type TestObject = { id: number; name: string };
  let set: ObjectSet<TestObject>;

  beforeEach(() => {
    set = new ObjectSet<TestObject>('id');
  });

  test('constructor', () => {
    expect(set).toBeDefined();
    expect(set.size).toBe(0);
  });

  test('add and has', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };

    set.add(obj1);
    expect(set.has(obj1)).toBe(true);
    expect(set.has(obj2)).toBe(false);
    expect(set.size).toBe(1);

    set.add(obj2);
    expect(set.has(obj2)).toBe(true);
    expect(set.size).toBe(2);

    // Adding duplicate should not increase size
    set.add(obj1);
    expect(set.size).toBe(2);
  });

  test('add with invalid object', () => {
    const invalidObj = { name: 'Invalid' };
    expect(() => set.add(invalidObj as any)).toThrow("Element must have 'id' property");
  });

  test('delete', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };

    set.add(obj1).add(obj2);
    expect(set.size).toBe(2);

    expect(set.delete(obj1)).toBe(true);
    expect(set.size).toBe(1);
    expect(set.has(obj1)).toBe(false);
    expect(set.has(obj2)).toBe(true);

    // Deleting non-existent element
    expect(set.delete({ id: 3, name: 'Charlie' })).toBe(false);
  });

  test('clear', () => {
    set.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    expect(set.size).toBe(2);

    set.clear();
    expect(set.size).toBe(0);
  });

  test('values and iteration', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };
    set.add(obj1).add(obj2);

    const values = Array.from(set.values());
    expect(values).toHaveLength(2);
    expect(values).toContainEqual(obj1);
    expect(values).toContainEqual(obj2);

    // Test iteration
    const iteratedValues: TestObject[] = [];
    for (const value of set) {
      iteratedValues.push(value);
    }
    expect(iteratedValues).toEqual(values);
  });

  test('entries', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };
    set.add(obj1).add(obj2);

    const entries = Array.from(set.entries());
    expect(entries).toHaveLength(2);
    expect(entries).toContainEqual([obj1, obj1]);
    expect(entries).toContainEqual([obj2, obj2]);
  });

  test('forEach', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };
    set.add(obj1).add(obj2);

    const mockCallback = jest.fn();
    set.forEach(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(obj1, obj1, set);
    expect(mockCallback).toHaveBeenCalledWith(obj2, obj2, set);
  });

  test('difference', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    const diff = set1.difference(set2);
    expect(diff.size).toBe(1);
    expect(diff.has({ id: 1, name: 'Alice' })).toBe(true);
  });

  test('intersection', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    const intersection = set1.intersection(set2);
    expect(intersection.size).toBe(1);
    expect(intersection.has({ id: 2, name: 'Bob' })).toBe(true);
  });

  test('isDisjointFrom', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');
    const set3 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 3, name: 'Charlie' }).add({ id: 4, name: 'David' });
    set3.add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    expect(set1.isDisjointFrom(set2)).toBe(true);
    expect(set1.isDisjointFrom(set3)).toBe(false);
  });

  test('isSubsetOf and isSupersetOf', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    expect(set1.isSubsetOf(set2)).toBe(true);
    expect(set2.isSubsetOf(set1)).toBe(false);

    expect(set2.isSupersetOf(set1)).toBe(true);
    expect(set1.isSupersetOf(set2)).toBe(false);
  });

  test('symmetricDifference', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    const symDiff = set1.symmetricDifference(set2);
    expect(symDiff.size).toBe(2);
    expect(symDiff.has({ id: 1, name: 'Alice' })).toBe(true);
    expect(symDiff.has({ id: 3, name: 'Charlie' })).toBe(true);
  });

  test('union', () => {
    const set1 = new ObjectSet<TestObject>('id');
    const set2 = new ObjectSet<TestObject>('id');

    set1.add({ id: 1, name: 'Alice' }).add({ id: 2, name: 'Bob' });
    set2.add({ id: 2, name: 'Bob' }).add({ id: 3, name: 'Charlie' });

    const union = set1.union(set2);
    expect(union.size).toBe(3);
    expect(union.has({ id: 1, name: 'Alice' })).toBe(true);
    expect(union.has({ id: 2, name: 'Bob' })).toBe(true);
    expect(union.has({ id: 3, name: 'Charlie' })).toBe(true);
  });

  test('equality key value casing is ignored', () => {
    const setCaseInsensitive = new ObjectSet<{ id: string; name: string }>('id');
    const obj1 = { id: 'JavaScript', name: 'Alice' };
    const obj2 = { id: 'TypeScript', name: 'Bob' };

    setCaseInsensitive.add(obj1);
    setCaseInsensitive.add(obj2);

    expect(setCaseInsensitive.size).toBe(2);
    expect(setCaseInsensitive.has({ id: 'javascript', name: 'Different Alice' })).toBe(true);
    expect(setCaseInsensitive.has({ id: 'typescript', name: 'Different Bob' })).toBe(true);

    // Adding objects with different casing shouldn't increase the size
    setCaseInsensitive.add({ id: 'Javascript', name: 'Another Alice' });
    setCaseInsensitive.add({ id: 'TYPESCRIPT', name: 'Another Bob' });
    expect(setCaseInsensitive.size).toBe(2);

    const values = Array.from(setCaseInsensitive.values());
    expect(values).toContainEqual(obj1);
    expect(values).toContainEqual(obj2);
  });
});