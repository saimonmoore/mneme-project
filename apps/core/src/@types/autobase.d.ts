import { CoreSource } from "hypercore";
import { ReadyResource } from "ready-resource";
import { Batch } from "compact-encoding";
import Corestore from "corestore";

declare interface AutobaseBatch {
  indexed: boolean;
  from: CoreSource;
  length: number;
  value: Batch;
  heads: Buffer[];
}

declare interface AutobaseHandlers {
  keyPair?: { publicKey: Buffer; secretKey: Buffer };
  valueEncoding?: string | Batch;
  encrypted?: boolean;
  encryptionKey?: Buffer;
  fastForward?: boolean | { key: Buffer; timeout?: number };
  ackInterval?: number;
  ackThreshold?: number;
  apply?: (
    batch: Array<AutobaseBatch>,
    view: Core,
    base: Autobase
  ) => Promise<void>;
  open?: (store: AutoStore, base: Autobase) => any;
  close?: (view: Core) => Promise<void>;
  wait?: () => Promise<void>;
  onindex?: (base: Autobase) => void;
}

declare class Autobase<Core> extends ReadyResource {

  constructor(
    store: Corestore,
    bootstrap?: string | Buffer | null,
    handlers?: AutobaseHandlers
  );

  get bootstraps(): Buffer[];
  get writable(): boolean;
  get key(): Buffer;
  get discoveryKey(): Buffer;
  get view(): Core;
  get local(): Core;

  close: () => Promise<void>;
  addWriter(key: Buffer, opts?: { indexer: boolean, isIndexer: boolean });
  append(value: string): Promise<void>;
  replicate(init: any, opts?: any): any;
  heads(): Array<{ key: Buffer; feed: number }>;
  hasPendingIndexers(): boolean;
  hasUnflushedIndexers(): boolean;
  hintWakeup(keys: Buffer | Buffer[]): void;
  update(): Promise<void>;
  ack(bg?: boolean): Promise<void>;
  forceResetViews(): Promise<void>;
  checkpoint(): Promise<{ key: Buffer; length: number } | null>;
  progress(): { processed: number; total: number };
  setUserData(key: string | Buffer, val: Buffer): Promise<void>;
  getUserData(key: string | Buffer): Promise<Buffer | null>;
  getNamespace(
    key: Buffer,
    core: CoreSource
  ): { namespace: Buffer; publicKey: Buffer } | null;

  on(event: "writable", listener: () => void): this;
  on(event: "update", listener: () => void): this;
  on(event: "reindexing", listener: () => void): this;
  on(event: "reindexed", listener: () => void): this;
  on(
    event: "fast-forward",
    listener: (length: number, from: number) => void
  ): this;
  on(
    event: "upgrade-available",
    listener: (upgrade: { version: number; length: number }) => void
  ): this;
  on(event: "warning", listener: (err: Error) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;

  [inspect](): string;
}

declare class AutoStore {
  get(
    opts: { name: string; exclusive?: boolean; cache?: boolean } | string,
    moreOpts?: { name: string; exclusive?: boolean; cache?: boolean }
  ): CoreSource;
  deriveKey(name: string, indexers: any[], prologue: any): Buffer;
  getSystemCore(): CoreSource;
  getBlockKey(name: string): Buffer | null;
  flush(): Promise<boolean>;
  // ... other methods
}

declare const DEFAULT_ACK_INTERVAL: number;
declare const DEFAULT_ACK_THRESHOLD: number;
declare const DEFAULT_FF_TIMEOUT: number;

declare module "autobase" {
  export default Autobase;
  export {
    AutoStore,
    DEFAULT_ACK_INTERVAL,
    DEFAULT_ACK_THRESHOLD,
    DEFAULT_FF_TIMEOUT,
  };
}
