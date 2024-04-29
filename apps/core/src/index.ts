import minimist from 'minimist';
import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
// import { MnemeServer } from "@/server";
// import { env, config } from "@/pear-compat";

const isTestRunning = process.env["NODE_ENV"] === "test";

let mneme;

if (!isTestRunning) {
  console.log("======================");
  console.log("Starting Mneme demo...");
  console.log("======================");

  const args = minimist(process.argv, {
    alias: {
      storage: 's',
      bootstrap: 'b',
    },
    default: {
    },
  });
  const bootstrapPrivateCorePublicKey = args.bootstrap;
  const storage = args.storage || "./data";

  // @ts-ignore
  if (global.Pear && Pear.config.dev) {
    console.log(`Starting pear in dev mode...`);
    // @ts-ignore
    const { Inspector } = await import("pear-inspect");
    const inspector = await new Inspector();
    const key = await inspector.enable();
    console.log(`Debug with pear://runtime/devtools/${key.toString("hex")}`);
  }

  console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

  mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);
  mneme.info();

  // const server = MnemeServer();

  await mneme.start();

  // @ts-ignore
  // server.start(mneme);
}

export { Mneme, User, Record };

// For hrepl
export { mneme };
