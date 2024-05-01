declare module 'b4a' {
    export function isBuffer(value: any): value is Buffer;
    export function isEncoding(encoding: string): boolean;
    export function alloc(size: number, fill?: string | Buffer | number, encoding?: string): Buffer;
    export function allocUnsafe(size: number): Buffer;
    export function allocUnsafeSlow(size: number): Buffer;
    export function byteLength(string: string, encoding?: BufferEncoding): number;
    export function compare(a: Buffer, b: Buffer): number;
    export function concat(buffers: ReadonlyArray<Buffer | Uint8Array>, totalLength?: number): Buffer;
    export function copy(source: Buffer | Uint8Array, target: Buffer, targetStart?: number, start?: number, end?: number): number;
    export function equals(a: Buffer, b: Buffer): boolean;
    export function fill(buffer: Buffer, value: string | Buffer | number, offset?: number, end?: number, encoding?: BufferEncoding): Buffer;
    export function from(value: string | ArrayBuffer | SharedArrayBuffer | ArrayBufferView, offsetOrEncoding?: BufferEncoding | number, length?: number): Buffer;
    export function includes(buffer: Buffer, value: string | Buffer | number, byteOffset?: number, encoding?: BufferEncoding): boolean;
    export function indexOf(buffer: Buffer, value: string | Buffer | number, byteOffset?: number, encoding?: BufferEncoding): number;
    export function lastIndexOf(buffer: Buffer, value: string | Buffer | number, byteOffset?: number, encoding?: BufferEncoding): number;
    export function swap16(buffer: Buffer): Buffer;
    export function swap32(buffer: Buffer): Buffer;
    export function swap64(buffer: Buffer): Buffer;
    export function toBuffer(buffer: Buffer | ArrayBufferView): Buffer;
    export function toString(buffer: Buffer, encoding?: BufferEncoding, start?: number, end?: number): string;
    export function write(buffer: Buffer, string: string, offset?: number, length?: number, encoding?: BufferEncoding): number;
    export function writeDoubleLE(buffer: Buffer, value: number, offset: number): number;
    export function writeFloatLE(buffer: Buffer, value: number, offset: number): number;
    export function writeUInt32LE(buffer: Buffer, value: number, offset: number): number;
    export function writeInt32LE(buffer: Buffer, value: number, offset: number): number;
    export function readDoubleLE(buffer: Buffer, offset: number): number;
    export function readFloatLE(buffer: Buffer, offset: number): number;
    export function readUInt32LE(buffer: Buffer, offset: number): number;
    export function readInt32LE(buffer: Buffer, offset: number): number;
    export function writeDoubleBE(buffer: Buffer, value: number, offset: number): number;
    export function writeFloatBE(buffer: Buffer, value: number, offset: number): number;
    export function writeUInt32BE(buffer: Buffer, value: number, offset: number): number;
    export function writeInt32BE(buffer: Buffer, value: number, offset: number): number;
    export function readDoubleBE(buffer: Buffer, offset: number): number;
    export function readFloatBE(buffer: Buffer, offset: number): number;
    export function readUInt32BE(buffer: Buffer, offset: number): number;
    export function readInt32BE(buffer: Buffer, offset: number): number;
  }