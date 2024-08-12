import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";

import type { RecordCommon } from '@mneme/domain';

export type RecordDto = RecordCommon & {
  keywords?: Keyword[];
};
