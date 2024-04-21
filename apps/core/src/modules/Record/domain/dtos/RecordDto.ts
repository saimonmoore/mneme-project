import { MnemeRecordType } from "@/modules/Record/domain/entities/Record.js";
import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";
import { Tag } from "@/modules/Record/domain/entities/Tag.js";

export type RecordDto = {
  url: string;
  language?: string;
  type: MnemeRecordType;
  keywords?: Keyword[];
  tags?: Tag[];
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};
