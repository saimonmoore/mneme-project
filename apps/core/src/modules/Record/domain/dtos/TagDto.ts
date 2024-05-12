import { Record } from "@/modules/Record/domain/entities/Record.js";
import type { TagCommon } from '@mneme/domain';

export type TagDto = TagCommon & {
  records?: Record[];
};
