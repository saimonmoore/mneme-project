import { Record } from "@/modules/Record/domain/entities/Record.js";

export type KeywordDto = {
  label: string;
  wikiLink?: string;
  records?: Record[];
};
