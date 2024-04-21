// hyperswarm.d.ts

import { EventEmitter } from "events";
import DHT = require("hyperdht");
import NoiseSecretStream from "hyperswarm-secret-stream";
import { Socket } from "net";

declare interface PeerDiscoveryOptions {
  wait?: Promise<void>;
  suspended?: boolean;
  onpeer?: (
    peer: { publicKey: Buffer; relayAddresses: Buffer[] },
    data: any
  ) => void;
  onerror?: (err: Error) => void;
}

declare interface PeerDiscoverySessionOptions {
  server?: boolean;
  client?: boolean;
  onerror?: (err: Error) => void;
}

declare class PeerDiscoverySession {
  constructor(discovery: PeerDiscovery);

  swarm: Hyperswarm;
  topic: Buffer;
  isClient: boolean;
  isServer: boolean;
  destroyed: boolean;

  refresh(opts?: PeerDiscoverySessionOptions): Promise<void>;
  flushed(): Promise<boolean>;
  destroy(): Promise<void>;
}

declare class PeerDiscovery {
  constructor(swarm: Hyperswarm, topic: Buffer, opts: PeerDiscoveryOptions);

  swarm: Hyperswarm;
  topic: Buffer;
  isClient: boolean;
  isServer: boolean;
  destroyed: boolean;
  destroying: Promise<void> | null;
  suspended: boolean;

  session(opts?: PeerDiscoverySessionOptions): PeerDiscoverySession;
  refresh(): Promise<void>;
  flushed(): Promise<boolean>;
  destroy(): Promise<void>;
  suspend(): Promise<void>;
  resume(): void;

  private _refreshLater(eager: boolean): void;
  private _isActive(): boolean;
  private _refresh(): Promise<void>;
  private _destroyMaybe(): Promise<void>;
  private _abort(): Promise<void>;
  private _destroy(): Promise<void>;
}

declare interface PeerInfoOptions {
  publicKey: Buffer;
  relayAddresses?: Buffer[];
}

interface HyperswarmOpts {
  seed?: Buffer;
  relayThrough?: (force?: boolean) => Buffer | null;
  keyPair?: DHT.KeyPair;
  maxPeers?: number;
  maxClientConnections?: number;
  maxServerConnections?: number;
  maxParallel?: number;
  firewall?: (remotePublicKey: Buffer, payload: Buffer | null) => boolean;
  bootstrap?: Buffer[];
  debug?: boolean;
  backoffs?: number[];
  jitter?: number;
  dht?: DHT;
}

declare class Hyperswarm extends EventEmitter {
  constructor(opts?: HyperswarmOpts);

  keyPair: DHT.KeyPair;
  join(
    topic: Buffer,
    opts?: PeerDiscoverySessionOptions
  ): PeerDiscovery;
  leave(topic: Buffer): Promise<void>;
  joinPeer(publicKey: Buffer): void;
  leavePeer(publicKey: Buffer): void;
  flush(): Promise<boolean>;
  clear(): Promise<void>;
  destroy(opts?: { force?: boolean }): Promise<void>;
  suspend(): Promise<void>;
  resume(): Promise<void>;
  topics(): IterableIterator<{
    destroy: () => void;
    // add additional methods for the topic here
  }>;

  _enqueue(peerInfo: PeerInfo): void;
  _requeue(batch: PeerInfo[]): void;
  _flushMaybe(peerInfo: PeerInfo): void;
  _flushAllMaybe(): boolean;
  _shouldConnect(): boolean;
  _shouldRequeue(peerInfo: PeerInfo): boolean;
  _connect(peerInfo: PeerInfo): void;
  _connectDone(): void;
  _attemptClientConnections(): void;
  _handleFirewall(remotePublicKey: Buffer, payload: Buffer | null): boolean;
  _handleServerConnectionSwap(existing: Socket, conn: Socket): void;
  _handleServerConnection(conn: Socket): void;
  _upsertPeer(
    publicKey: Buffer,
    relayAddresses: Buffer[] | null
  ): PeerInfo | null;
  _maybeDeletePeer(peerInfo: PeerInfo): void;
  _handlePeer(
    peer: { publicKey: Buffer; relayAddresses: Buffer[] },
    topic: Buffer
  ): void;
  _handleNetworkChange(): Promise<void>;
  status(key: Buffer):
    | {
        /* add properties and methods for the status object */
      }
    | null;
  listen(): Promise</* add return type for listen */>;

  on(
    event: "connection",
    listener: (socket: NoiseSecretStream, peerInfo: PeerInfo) => void
  ): this;
  on(event: "update", listener: (socket: NoiseSecretStream, peerInfo: PeerInfo) => void): this;
}

declare class PeerInfo {
  constructor(opts: PeerInfoOptions);

  publicKey: Buffer;
  relayAddresses: Buffer[] | null;
}

declare module "hyperswarm" {
  export default Hyperswarm;
  export { PeerDiscovery, PeerDiscoverySession, PeerInfo, HyperswarmOpts };
}
