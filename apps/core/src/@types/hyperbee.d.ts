import { Readable } from "streamx";
import { Codec } from "codecs";
import { Core } from "hypercore";
import { Mutex } from "mutexify";
import { Duplex } from "streamx";
import ReadyResource from "ready-resource";

declare type Range = {
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  limit?: number;
};

declare type WatchOptions = {
  keyEncoding?: Codec;
  valueEncoding?: Codec;
  map?: (snapshot: Hyperbee) => any;
  differ?: (
    current: Hyperbee,
    previous: Hyperbee,
    range: Range
  ) => AsyncIterable<any>;
  onchange?: () => Promise<void>;
  eager?: boolean;
  updateOnce?: boolean;
};

declare type GetOptions = {
  keyEncoding?: Codec;
  valueEncoding?: Codec;
  cas?: (existingEntry: any, newEntry: any) => Promise<boolean>;
};

declare type PutOptions = GetOptions;

declare type DelOptions = GetOptions;

declare type BatchOptions = {
  keyEncoding?: Codec;
  valueEncoding?: Codec;
  update?: boolean;
};

declare type SubOptions = {
  sep?: string | Buffer;
  keyEncoding?: Codec;
  valueEncoding?: Codec;
};

declare type CheckoutOptions = {
  keyEncoding?: Codec;
  valueEncoding?: Codec;
  reuseSession?: boolean;
};

declare type PeekOpts = {
  limit: number;
};

declare class Hyperbee extends ReadyResource {
  constructor(
    core: Core,
    opts?: {
      keyEncoding?: Codec;
      valueEncoding?: Codec;
      extension?: boolean;
      metadata?: any;
      lock?: Mutex;
      readonly?: boolean;
      prefix?: Buffer;
      alwaysDuplicate?: boolean;
      sessions?: boolean;
    }
  );
  get version(): number;
  get id(): Buffer;
  get key(): Buffer;
  get discoveryKey(): Buffer;
  get writable(): boolean;
  get readable(): boolean;
  get core(): Core;

  replicate(isInitiator: boolean, opts?: any): Duplex;
  update(opts?: any): Promise<void>;
  peek(
    range: Range,
    opts?: PeekOpts
  ): Promise<{ value: any } | null>;
  createRangeIterator(
    range: Range,
    opts?: any
  ): AsyncIterator<{ value: any }>;
  createReadStream(range?: Range, opts?: any): Readable;
  createHistoryStream(opts?: any): Readable;
  createDiffStream(
    right: Hyperbee | number,
    range: Range,
    opts?: any
  ): Readable;
  get(
    key: string | Buffer,
    opts?: GetOptions
  ): Promise<{ value: any } | null>;
  getBySeq(
    seq: number,
    opts?: GetOptions
  ): Promise<{ value: any } | null>;
  put(key: string | Buffer, value: any, opts?: PutOptions): Promise<void>;
  batch(opts?: BatchOptions): Batch;
  del(key: Buffer, opts?: DelOptions): Promise<void>;
  watch(range: Range, opts?: WatchOptions): Watcher;
  getAndWatch(key: string | Buffer, opts?: GetOptions): Promise<EntryWatcher>;
  checkout(version: number, opts?: CheckoutOptions): Hyperbee;
  snapshot(opts?: CheckoutOptions): Hyperbee;
  sub(prefix: string | Buffer, opts?: SubOptions): Hyperbee;
  getHeader(opts?: any): Promise<{ protocol: string; metadata: any }>;
  static isHyperbee(core: Core, opts?: any): Promise<boolean>;
}

declare class Batch {
  constructor(
    tree: Hyperbee,
    core: Core,
    batchLock: Mutex | null,
    cache: boolean,
    options?: BatchOptions
  );
  get version(): number;
  getBySeq(
    seq: number,
    opts?: GetOptions
  ): Promise<{ key: string | Buffer; value: any } | null>;
  get(
    key: Buffer,
    opts?: GetOptions
  ): Promise<{ key: string | Buffer; value: any } | null>;
  put(key: string | Buffer, value: any, opts?: PutOptions): Promise<void>;
  del(key: string | Buffer, opts?: DelOptions): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
  destroy(): void; // Deprecated, use close() instead
  toBlocks(): Buffer[];
}

declare class EntryWatcher extends ReadyResource {
  constructor(bee: Hyperbee, key: Buffer, opts?: GetOptions);
  on(event: "update", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

declare class Watcher extends ReadyResource {
  constructor(bee: Hyperbee, range: Range, opts?: WatchOptions);
  [Symbol.asyncIterator](): AsyncIterator<[any, any]>;
  return(): Promise<{ done: true }>;
  close(): Promise<void>;
  destroy(): Promise<void>;
  on(event: "update", listener: () => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

declare module "hyperbee" {
  export default Hyperbee;
  export {
    Batch,
    EntryWatcher,
    Watcher,
    Range,
    GetOptions,
    PutOptions,
    DelOptions,
    BatchOptions,
    SubOptions,
    CheckoutOptions,
  };
}
