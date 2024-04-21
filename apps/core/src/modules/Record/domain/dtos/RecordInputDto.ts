import { MnemeRecordType } from "@/modules/Record/domain/entities/Record.js";
import { TagInputDto } from "@/modules/Record/domain/dtos/TagInputDto.js";
import { KeywordInputDto } from "@/modules/Record/domain/dtos/KeywordInputDto.js";

export type RecordInputDto = {
  url: string;
  language?: string;
  type: MnemeRecordType;
  keywords?: KeywordInputDto[];
  tags?: TagInputDto[];
  creatorId: string;
};
