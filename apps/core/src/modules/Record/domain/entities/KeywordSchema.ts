import { z } from "zod";

export const KeywordSchema = z.object({
  label: z.string(),
  wikiLink: z.string().nullish(),
});