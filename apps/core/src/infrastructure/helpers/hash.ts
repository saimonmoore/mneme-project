// @ts-ignore
import crypto from 'crypto';
import type { Hash } from '@mneme/domain';

export function sha256(input: string): Hash {
  return crypto.createHash('sha256').update(input).digest('hex') as Hash;
}
