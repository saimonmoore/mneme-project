export class ObjectSet<T extends { [key: string]: any }> {
  private equalityKeys: string[];
  private map: Map<string, T>;
  private set: Set<string>;

  constructor(equalityKeys: string | string[]) {
    this.equalityKeys = Array.isArray(equalityKeys) ? equalityKeys : [equalityKeys];
    this.map = new Map();
    this.set = new Set();
  }

  add(element: T): this {
    const normalizedElement = this.normalizeElement(element);
    if (this.hasMatchingEqualityKeys(normalizedElement)) {
      return this; // Element with matching equality keys already exists, don't add
    }
    const key = this.getKey(normalizedElement);
    if (key === undefined) {
      throw new Error(`Element must have all of these properties: ${this.equalityKeys.join(', ')}`);
    }
    this.set.add(key);
    this.map.set(key, normalizedElement); // Store the original element
    return this;
  }

  clear(): void {
    this.set.clear();
    this.map.clear();
  }

  delete(element: T): boolean {
    const normalizedElement = this.normalizeElement(element);
    const key = this.getKey(normalizedElement);
    if (key === undefined) return false;
    const result = this.set.delete(key);
    this.map.delete(key);
    return result;
  }

  difference(other: ObjectSet<T>): ObjectSet<T> {
    const result = new ObjectSet<T>(this.equalityKeys);
    for (const element of this) {
      if (!other.has(element)) {
        result.add(element);
      }
    }
    return result;
  }

  entries(): IterableIterator<[T, T]> {
    const self = this;
    return (function* () {
      for (const value of self.map.values()) {
        yield [value, value] as [T, T];
      }
    })();
  }

  forEach(callbackfn: (value: T, value2: T, set: ObjectSet<T>) => void, thisArg?: any): void {
    this.map.forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  has(element: T): boolean {
    const normalizedElement = this.normalizeElement(element);
    const key = this.getKey(normalizedElement);
    return key !== undefined && this.set.has(key);
  }

  intersection(other: ObjectSet<T>): ObjectSet<T> {
    const result = new ObjectSet<T>(this.equalityKeys);
    for (const element of this) {
      if (other.has(element)) {
        result.add(element);
      }
    }
    return result;
  }

  isDisjointFrom(other: ObjectSet<T>): boolean {
    for (const element of this) {
      if (other.has(element)) {
        return false;
      }
    }
    return true;
  }

  isSubsetOf(other: ObjectSet<T>): boolean {
    for (const element of this) {
      if (!other.has(element)) {
        return false;
      }
    }
    return true;
  }

  isSupersetOf(other: ObjectSet<T>): boolean {
    return other.isSubsetOf(this);
  }

  keys(): IterableIterator<T> {
    return this.values();
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  symmetricDifference(other: ObjectSet<T>): ObjectSet<T> {
    const result = new ObjectSet<T>(this.equalityKeys);
    for (const element of this) {
      if (!other.has(element)) {
        result.add(element);
      }
    }
    for (const element of other) {
      if (!this.has(element)) {
        result.add(element);
      }
    }
    return result;
  }

  union(other: ObjectSet<T>): ObjectSet<T> {
    const result = new ObjectSet<T>(this.equalityKeys);
    for (const element of this) {
      result.add(element);
    }
    for (const element of other) {
      result.add(element);
    }
    return result;
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }

  get size(): number {
    return this.set.size;
  }

  private normalizeElement(element: T): T {
    const normalized = { ...element };
    for (const key of this.equalityKeys) {
      if (typeof normalized[key as keyof T] === 'string') {
        (normalized[key as keyof T] as string) = (normalized[key as keyof T] as string).toLowerCase();
      }
    }
    return normalized;
  }

  private getKey(element: T): string | undefined {
    const keyParts = this.equalityKeys.map(key => {
      const value = element[key];
      return value !== undefined ? String(value) : undefined;
    });

    return keyParts.every(part => part !== undefined) 
      ? keyParts.join('-') 
      : undefined;
  }

  private hasMatchingEqualityKeys(element: T): boolean {
    return this.equalityKeys.some(key => {
      const normalizedValue = this.normalizeValue(String(element[key]));
      return Array.from(this.map.values()).some(existingElement => 
        this.normalizeValue(String(existingElement[key])) === normalizedValue
      );
    });
  }

  private normalizeValue(value: string): string {
    return value.toLowerCase();
  }
}