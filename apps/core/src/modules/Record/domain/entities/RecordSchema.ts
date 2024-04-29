import { z } from "zod";
import {
  MnemeRecordType,
  Record,
} from "@/modules/Record/domain/entities/Record.js";

export const RecordSchema = z.object({
  url: z.string(),
  // type is an enum
  type: z
    .string()
    .refine((value) => Object.values(Record.getMnemeRecordTypeList()).includes(value as MnemeRecordType)),
  language: z.string().nullish(),
  creatorId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
