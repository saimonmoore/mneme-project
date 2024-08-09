import b4a from 'b4a'
//@ts-expect-error
import sodium from 'sodium-universal'

import type { Hash } from '@mneme/domain';

export function sha256(input: string): Hash {
  const inputBuffer = b4a.from(input)
  const outputBuffer = b4a.alloc(sodium.crypto_hash_sha256_BYTES)
  
  sodium.crypto_hash_sha256(outputBuffer, inputBuffer)
  
  return b4a.toString(outputBuffer, 'hex') as Hash;
}