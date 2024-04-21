/// <reference types="node" />

import { Duplex, Writable } from 'streamx';
import { KeyPair, HandshakePattern } from './lib/handshake';
import { Bridge } from './lib/bridge';

interface NoiseSecretStreamOptions {
    publicKey?: Buffer;
    remotePublicKey?: Buffer;
    pattern?: HandshakePattern;
    keepAlive?: number;
    autoStart?: boolean;
    handshake?: {
        tx: Buffer;
        rx: Buffer;
        hash: Buffer;
        publicKey: Buffer;
        remotePublicKey: Buffer;
    };
    keyPair?: KeyPair | Promise<KeyPair>;
    data?: Buffer;
    ended?: boolean;
}

declare class NoiseSecretStream extends Duplex {
    constructor(isInitiator: boolean, rawStream: Writable | null, opts?: NoiseSecretStreamOptions);

    static keyPair(seed?: Buffer): KeyPair;
    static id(handshakeHash: Buffer, isInitiator: boolean, id?: Buffer): Buffer;

    publicKey: Buffer | null;
    remotePublicKey: Buffer | null;
    handshakeHash: Buffer | null;
    connected: boolean;
    userData: any;

    readonly noiseStream: NoiseSecretStream;
    readonly isInitiator: boolean;
    readonly rawStream: Writable | Bridge | null;

    setTimeout(ms: number): void;
    setKeepAlive(ms: number): void;
    start(rawStream?: Writable, opts?: NoiseSecretStreamOptions): void;
    flush(): Promise<boolean>;
    alloc(len: number): Buffer;
    toJSON(): {
        isInitiator: boolean;
        publicKey: string | null;
        remotePublicKey: string | null;
        connected: boolean;
        destroying: boolean;
        destroyed: boolean;
        rawStream: any;
    };

    write(data: string | Buffer, cb?: (err?: Error) => void): void;
    final(cb: (err?: Error) => void): void;
    read(cb: (err?: Error, bytesRead?: number) => void): void;

    on(event: 'handshake', listener: () => void): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
}

declare module 'hyperswarm-secret-stream' {
    export default NoiseSecretStream;
    export { Bridge };
}