import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";
import { Tag } from "@/modules/Record/domain/entities/Tag.js";

import type { RecordCommon } from '@mneme/domain';

export type RecordDto = RecordCommon & {
  keywords?: Keyword[];
  tags?: Tag[];
};
