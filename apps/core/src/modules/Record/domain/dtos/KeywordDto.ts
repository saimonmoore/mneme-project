import { Record } from "@/modules/Record/domain/entities/Record.js";
import type { KeywordCommon } from '@mneme/domain';

export type KeywordDto = KeywordCommon & {
  records?: Record[];
};
