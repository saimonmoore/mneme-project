import { z } from "zod";

export const FriendSchema = z.object({
  userName: z.string(),
  displayName: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});