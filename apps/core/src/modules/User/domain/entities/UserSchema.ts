import { z } from "zod";

export const UserSchema = z
  .object({
    email: z.string(),
    password: z.string().nullish(),
    encryptedPassword: z.string().nullish(),
    userName: z.string().nullish(),
    displayName: z.string().nullish(),
    avatarUrl: z.string().nullish(),
    createdAt: z.date(),
    updatedAt: z.date(),
    _writers: z.set(z.string()).nullish(),
  })
  .refine(
    (data) => {
      return !!data.password || !!data.encryptedPassword;
    },
    {
      message:
        "At least one of `password` or `encryptedPassword` must be present",
      path: ["password", "encryptedPassword"],
    }
  );
