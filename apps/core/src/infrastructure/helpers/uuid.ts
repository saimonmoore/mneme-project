import { v4 as uuidv4 } from 'uuid';
import { sha256 } from '@/infrastructure/helpers/hash.js';

import type { Hash } from '@mneme/domain';

export function uuid(): Hash {
  return sha256(uuidv4());
}