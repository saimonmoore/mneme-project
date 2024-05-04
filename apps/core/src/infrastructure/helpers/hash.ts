// @ts-ignore
import crypto from 'crypto';

export type Hash = string & { readonly length: 64 };

export function sha256(input: string): Hash {
  return crypto.createHash('sha256').update(input).digest('hex') as Hash;
}
