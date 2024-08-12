import { KeywordInputDto } from "@/modules/Record/domain/dtos/KeywordInputDto.js";

import type { RecordCommon } from '@mneme/domain';

export type RecordInputDto = RecordCommon & {
  keywords?: KeywordInputDto[];
};
