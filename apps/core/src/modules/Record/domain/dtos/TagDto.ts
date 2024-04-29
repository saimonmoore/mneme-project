import { Record } from "@/modules/Record/domain/entities/Record.js";

export type TagDto = {
  label: string;
  wikiLink?: string;
  records?: Record[];
};
