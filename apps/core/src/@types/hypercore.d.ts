import * as stream from 'stream';
import { EventEmitter } from 'events';
import { NoiseSecretStream } from '@hyperswarm/secret-stream';
import Protomux from 'protomux';
import Xache from 'xache';
import * as c from 'compact-encoding';
import { Readable, Writable } from 'stream';

declare interface HypercoreOptions {
  storage?: any;
  key?: Buffer;
  crypto?: any;
  compat?: boolean;
  version?: number;
  namespace?: string;
  keyPair?: { publicKey: Buffer; secretKey: Buffer };
  cache?: boolean | Xache;
  valueEncoding?: c.Codec;
  encodeBatch?: (blocks: any[]) => Buffer[];
  force?: boolean;
  createIfMissing?: boolean;
  readonly?: boolean;
  overwrite?: boolean;
  legacy?: boolean;
  manifest?: any;
  snapshot?: boolean;
  sparse?: boolean;
  writable?: boolean;
  active?: boolean;
  autoClose?: boolean;
  onwait?: (index: number, core: Hypercore) => void;
  wait?: boolean;
  timeout?: number;
  clone?: { from: Hypercore; signature: Buffer };
  encryptionKey?: Buffer;
  isBlockKey?: boolean;
  from?: Hypercore;
  unlocked?: boolean;
  lock?: string;
  poolSize?: number;
  rmdir?: boolean;
  preload?: () => Promise<{ from?: Hypercore; signature?: Buffer }>;
  userData?: { [key: string]: Buffer };
  class?: typeof Hypercore;
  notDownloadingLinger?: number;
  allowFork?: boolean;
  inflightRange?: number;
}

declare class Hypercore extends EventEmitter {
  constructor(storage?: any, key?: Buffer, opts?: HypercoreOptions);

  static MAX_SUGGESTED_BLOCK_SIZE: number;
  static key(manifest: Buffer | { version?: number; signers: { publicKey: Buffer; namespace?: string }[] }, opts?: { compat?: boolean; version?: number; namespace?: string }): Buffer;
  static discoveryKey(key: Buffer): Buffer;
  static getProtocolMuxer(stream: { noiseStream: NoiseSecretStream }): Protomux;
  static createProtocolStream(isInitiator: boolean | Protomux | stream.Duplex, opts?: { stream?: stream.Duplex; keepAlive?: boolean; ondiscoverykey?: (discoveryKey: Buffer) => void }): stream.Duplex;
  static defaultStorage(storage: string, opts?: { unlocked?: boolean; lock?: string; poolSize?: number; rmdir?: boolean; writable?: boolean }): (name: string) => any;

  snapshot(opts?: HypercoreOptions): Hypercore;
  session(opts?: HypercoreOptions): Hypercore;
  setEncryptionKey(encryptionKey: Buffer, opts?: { compat?: boolean; isBlockKey?: boolean }): Promise<void>;
  setKeyPair(keyPair: { publicKey: Buffer; secretKey: Buffer }): void;
  close(err?: Error): Promise<void>;
  clone(keyPair: { publicKey: Buffer; secretKey: Buffer }, storage?: any, opts?: HypercoreOptions): Hypercore;
  replicate(isInitiator: boolean | Protomux | stream.Duplex, opts?: { stream?: stream.Duplex; keepAlive?: boolean; ondiscoverykey?: (discoveryKey: Buffer) => void; session?: boolean }): stream.Duplex;
  readonly discoveryKey: Buffer | null;
  readonly manifest: any;
  readonly length: number;
  readonly indexedLength: number;
  readonly byteLength: number;
  readonly contiguousLength: number;
  readonly contiguousByteLength: number;
  readonly fork: number;
  readonly peers: any[];
  readonly encryptionKey: Buffer | null;
  readonly padding: number;
  ready(): Promise<void>;
  setUserData(key: string, value: Buffer, opts?: { flush?: boolean }): Promise<void>;
  getUserData(key: string): Promise<Buffer | null>;
  createTreeBatch(): any;
  findingPeers(): () => void;
  info(opts?: any): Promise<any>;
  update(opts?: { force?: boolean; activeRequests?: any[] }): Promise<boolean>;
  batch(opts?: { checkout?: number; autoClose?: boolean; session?: boolean; restore?: boolean; clear?: boolean }): any;
  seek(bytes: number, opts?: { tree?: any; timeout?: number; activeRequests?: any[] }): Promise<number | null>;
  has(start: number, end?: number): Promise<boolean>;
  get(index: number, opts?: { valueEncoding?: c.Codec; raw?: boolean; decrypt?: boolean; tree?: any; timeout?: number; onwait?: (index: number, core: Hypercore) => void; activeRequests?: any[] }): Promise<Buffer | null>;
  clear(start: number, end?: number, opts?: { diff?: boolean }): Promise<{ blocks: number } | null>;
  purge(): Promise<void>;
  createReadStream(opts?: any): Readable;
  createWriteStream(opts?: any): Writable;
  createByteStream(opts?: any): stream.Duplex;
  download(range?: { start: number; end: number; activeRequests?: any[] }): any;
  undownload(range: any): void;
  cancel(request: any): void;
  truncate(newLength?: number, opts?: number | { fork?: number; keyPair?: { publicKey: Buffer; secretKey: Buffer }; signature?: Buffer }): Promise<void>;
  append(blocks: Buffer | Buffer[], opts?: { keyPair?: { publicKey: Buffer; secretKey: Buffer }; signature?: Buffer }): Promise<void>;
  treeHash(length?: number): Promise<Buffer>;
  registerExtension(name: string, handlers?: { encoding?: c.Codec; onmessage?: (message: any, peer: any) => void }): any;

  on(event: 'ready', listener: () => void): this;
  on(event: 'close', listener: (isRoot: boolean) => void): this;
  on(event: 'truncate', listener: (start: number, fork: number) => void): this;
  on(event: 'append', listener: () => void): this;
  on(event: 'manifest', listener: () => void): this;
  on(event: 'peer-add', listener: (peer: any) => void): this;
  on(event: 'peer-remove', listener: (peer: any) => void): this;
  on(event: 'upload', listener: (index: number, byteLength: number, from: any) => void): this;
  on(event: 'download', listener: (index: number, byteLength: number, from: any) => void): this;
  on(event: 'verification-error', listener: (err: Error, req: any, res: any, from: any) => void): this;
  on(event: 'conflict', listener: (length: number, fork: number, proof: any) => void): this;
}

declare module 'hypercore' {
  export default Hypercore;
  export { HypercoreOptions };
}