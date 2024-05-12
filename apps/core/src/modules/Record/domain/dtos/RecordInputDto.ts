import { TagInputDto } from "@/modules/Record/domain/dtos/TagInputDto.js";
import { KeywordInputDto } from "@/modules/Record/domain/dtos/KeywordInputDto.js";

import type { Hash, RecordCommon } from '@mneme/domain';

export type RecordInputDto = RecordCommon & {
  keywords?: KeywordInputDto[];
  tags?: TagInputDto[];
  creatorId: Hash;
};
