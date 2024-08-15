export class ObjectSet<T extends { [key: string]: any }> {
    private equalityKey: string;
    private map: Map<string, T>;
    private set: Set<string>;
  
    constructor(equalityKey: string) {
      this.equalityKey = equalityKey.toLowerCase(); // Convert to lowercase
      this.map = new Map();
      this.set = new Set();
    }
  
    add(element: T): this {
      const key = this.getKey(element);
      if (key === undefined) {
        throw new Error(`Element must have '${this.equalityKey}' property`);
      }
      const normalizedKey = this.normalizeValue(key);
      if (!this.set.has(normalizedKey)) {
        this.set.add(normalizedKey);
        this.map.set(normalizedKey, element);
      }
      return this;
    }
  
    clear(): void {
      this.set.clear();
      this.map.clear();
    }
  
    delete(element: T): boolean {
      const key = element[this.equalityKey];
      const result = this.set.delete(this.normalizeValue(key));
      this.map.delete(this.normalizeValue(key));
      return result;
    }
  
    difference(other: ObjectSet<T>): ObjectSet<T> {
      const result = new ObjectSet<T>(this.equalityKey);
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
      const key = this.getKey(element);
      return key !== undefined && this.set.has(this.normalizeValue(key));
    }
  
    intersection(other: ObjectSet<T>): ObjectSet<T> {
      const result = new ObjectSet<T>(this.equalityKey);
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
      const result = new ObjectSet<T>(this.equalityKey);
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
      const result = new ObjectSet<T>(this.equalityKey);
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
  
    private getKey(element: T): any {
      const key = Object.keys(element).find(k => k.toLowerCase() === this.equalityKey);
      return key !== undefined ? element[key] : undefined;
    }

    private normalizeValue(value: any): string {
      return typeof value === 'string' ? value.toLowerCase() : String(value);
    }
  }