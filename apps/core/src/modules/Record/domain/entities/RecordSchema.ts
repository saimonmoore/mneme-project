import { z } from "zod";
import {
  Record,
} from "@/modules/Record/domain/entities/Record.js";

import type { RecordType } from "@mneme/domain";

export const RecordSchema = z.object({
  url: z.string(),
  // type is an enum
  type: z
    .string()
    .refine((value) => Object.values(Record.getRecordTypeList()).includes(value as RecordType)),
  language: z.string().nullish(),
  creatorId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
