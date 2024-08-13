import { z } from "zod";
import {
  Record,
} from "@/modules/Record/domain/entities/Record.js";

import type { RecordType } from "@mneme/domain";

export const RecordSchema = z.object({
  url: z.string(),
  // type is an enum
  type: z
    .string().nullish(),
    // .refine((value) => Object.values(Record.getRecordTypeList()).includes(value as RecordType)),
  title: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  logo: z.string().nullish(),
  publisher: z.string().nullish(),
  language: z.string().nullish(),
  creatorId: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});
