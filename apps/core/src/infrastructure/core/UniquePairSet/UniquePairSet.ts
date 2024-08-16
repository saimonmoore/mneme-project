import { v4 as uuidv4 } from 'uuid';

export type UniqueFields<T> = {
  id: keyof T;
  label: keyof T;
};

export class UniquePairSet<T extends object> {
  private items: Map<string, T> = new Map();
  private labelMap: Map<string, string> = new Map();
  private uniqueFields: UniqueFields<T>;

  constructor(uniqueFields: UniqueFields<T>) {
    this.uniqueFields = uniqueFields;
  }

  private normalize(value: any): string {
    return typeof value === 'string' ? value.toLowerCase() : String(value);
  }

  private validateUniqueness(item: T, ignoreId?: string): void {
    const id = this.normalize(item[this.uniqueFields.id]);
    const label = this.normalize(item[this.uniqueFields.label]);

    if (
      (!ignoreId && this.items.has(id)) ||
      (ignoreId && ignoreId !== id && this.items.has(id))
    ) {
      throw new Error(`Item with id '${id}' already exists.`);
    }

    const existingId = this.labelMap.get(label);
    if (existingId && existingId !== ignoreId) {
      throw new Error(`Item with label '${label}' already exists.`);
    }
  }

  add(item: T): void {
    this.validateUniqueness(item);

    const id = this.normalize(item[this.uniqueFields.id]);
    const label = this.normalize(item[this.uniqueFields.label]);

    this.items.set(id, {
      ...item,
      [this.uniqueFields.id]: id,
      [this.uniqueFields.label]: label,
    });
    this.labelMap.set(label, id);
  }

  update(item: T): void {
    const id = this.normalize(item[this.uniqueFields.id]);
    if (!this.items.has(id)) {
      throw new Error(`Item with id '${id}' does not exist.`);
    }

    this.validateUniqueness(item, id);

    const oldItem = this.items.get(id)!;
    const oldLabel = this.normalize(oldItem[this.uniqueFields.label]);
    const newLabel = this.normalize(item[this.uniqueFields.label]);

    if (oldLabel !== newLabel) {
      this.labelMap.delete(oldLabel);
      this.labelMap.set(newLabel, id);
    }

    this.items.set(id, {
      ...item,
      [this.uniqueFields.id]: id,
      [this.uniqueFields.label]: newLabel,
    });
  }

  get(id: string): T | undefined {
    return this.items.get(this.normalize(id));
  }

  getByLabel(label: string): T | undefined {
    const id = this.labelMap.get(this.normalize(label));
    return id ? this.items.get(id) : undefined;
  }

  has(id: string): boolean {
    return this.items.has(this.normalize(id));
  }

  hasLabel(label: string): boolean {
    return this.labelMap.has(this.normalize(label));
  }

  delete(id: string): boolean {
    const normalizedId = this.normalize(id);
    const item = this.items.get(normalizedId);
    if (item) {
      const label = this.normalize(item[this.uniqueFields.label]);
      this.labelMap.delete(label);
      return this.items.delete(normalizedId);
    }
    return false;
  }

  clear(): void {
    this.items.clear();
    this.labelMap.clear();
  }

  get size(): number {
    return this.items.size;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.items.values();
  }

  difference(other: UniquePairSet<T>): T[] {
    return Array.from(this.items.values()).filter(
      item => !other.hasLabel(String(item[this.uniqueFields.label]))
    );
  }

  static difference<U extends object>(
    array1: U[],
    array2: U[],
    uniqueFields: UniqueFields<U>
  ): U[] {
    const set1 = new UniquePairSet<U>(uniqueFields);
    const set2 = new UniquePairSet<U>(uniqueFields);

    array1.forEach(item => set1.add(item));
    array2.forEach(item => set2.add(item));

    return set1.difference(set2);
  }
}