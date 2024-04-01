import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";
import { Mneme } from "@/mneme.js";
// @ts-ignore
import Pear from "pear";

const LoginSchema = {
  email: z
    .string()
    .min(1, { message: "`email` is required" })
    .email("This is not a valid email."),
  // password: z.string().min(1, { message: "`password` is required" }),
};

const SignupSchema = {
  displayName: z.string().min(1, { message: "`displayName` is required" }),
  email: z
    .string()
    .min(1, { message: "`email` is required" })
    .email("This is not a valid email."),
  avatarUrl: z.string().min(1, { message: "`avatarUrl` is required" }),
  hash: z.string(),
  //password: z.string().min(1, { message: "`password` is required" }),
};

let mneme: Mneme;

const mnemeRouter = router({
  session: {
    login: publicProcedure.input(z.object(LoginSchema)).query(async (opts) => {
      await mneme.login(opts.input.email);
      return { ok: true };
    }),
    signup: publicProcedure
      .input(z.object(SignupSchema))
      .mutation(async (opts) => {
        await mneme.signup(opts.input);
        return { ok: true };
      }),
  },
});

// Export type router type signature, this is used by the client.
export type MnemeServerRouter = typeof mnemeRouter;

export const MnemeServer = () => ({
  start: (mnemeInstance: Mneme) => {
    mneme = mnemeInstance;

    const server = createHTTPServer({
      router: mnemeRouter,
    });

    const port = parseInt(Pear.config.env["PORT"] || "3737", 10);
    server.listen(port);
  },
});
