import ReadyResource from 'ready-resource';
import { Writable, Readable } from 'stream';
import type Hypercore from "@/@types/hypercore";
import type NoiseSecretStream from "@/@types/hyperswarm-secret-stream";

declare interface CorestoreOptions {
  _root?: Corestore;
  primaryKey?: Buffer;
  passive?: boolean;
  manifestVersion?: number;
  compat?: boolean;
  inflightRange?: number[];
  cache?: boolean | Cache;
  overwrite?: boolean;
  writable?: boolean;
  _attached?: Corestore | null;
  notDownloadingLinger?: number;
  [key: string]: any;
}

declare interface GetOptions {
  key?: Buffer;
  keyPair?: KeyPair;
  name?: string;
  secretKey?: Buffer;
  publicKey?: Buffer;
  manifest?: Manifest;
  cache?: boolean | Cache;
  exclusive?: boolean;
  writable?: boolean;
  encryptionKey?: Buffer;
  isBlockKey?: boolean;
  createIfMissing?: boolean;
  compat?: boolean;
  preload?: () => Promise<GetOptions>;
  _discoveryKey?: Buffer;
  [key: string]: any;
}

declare interface ReplicateOptions {
  stream?: Readable;
  ondiscoverykey?: (discoveryKey: Buffer) => Promise<void>;
  [key: string]: any;
}

declare interface NamespaceOptions {
  detach?: boolean;
  [key: string]: any;
}

declare interface SessionOptions {
  namespace?: Buffer;
  [key: string]: any;
}

declare interface KeyPair {
  publicKey: Buffer;
  secretKey: Buffer;
}
declare interface Manifest {
  version: number;
  signers: { publicKey: Buffer }[];
}

declare interface Cache {
  set(key: string, value: any): void;
  get(key: string): any;
  delete(key: string): void;
  // ... other Cache methods
}

declare class Corestore extends ReadyResource {
  constructor(storage: string | Storage, opts?: CorestoreOptions);

  static isCorestore(obj: any): obj is Corestore;
  static from(storage: string | Storage, opts?: CorestoreOptions): Corestore;

  suspend(): Promise<void>;
  resume(): Promise<void>;
  findingPeers(): () => void;
  createKeyPair(name: string, namespace?: Buffer): Promise<KeyPair>;
  get(index: string, opts?: GetOptions): Promise<Hypercore>;
  replicate(isInitiator: NoiseSecretStream | Readable, opts?: ReplicateOptions): Writable;
  namespace(name: string | Hypercore, opts?: NamespaceOptions): Corestore;
  session(opts?: SessionOptions): Corestore;
  close(): Promise<void>;

  on(event: 'core-open', listener: (core: Hypercore) => void): this;
  on(event: 'core-close', listener: (core: Hypercore) => void): this;
  on(event: 'conflict', listener: (core: Hypercore, len: number, fork: Buffer, proof: Buffer) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
}

declare module 'corestore' {
  export default Corestore;
  export { CorestoreOptions, GetOptions, ReplicateOptions, NamespaceOptions, KeyPair, Manifest, Cache };
}