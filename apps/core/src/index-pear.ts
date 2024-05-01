// @ts-ignore
import readline from 'bare-readline'  // Module for reading user input in terminal
// @ts-ignore
import tty from 'bare-tty'            // Module to control terminal behavior

import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
// // import { MnemeServer } from "@/server";
import { env, config, teardown } from "@/pear-compat";

// @ts-ignore
const isTestRunning = env["NODE_ENV"] === "test";

let mneme: Mneme;

if (!isTestRunning) {
  console.log("======================");
  console.log("Starting Mneme demo...");
  console.log("======================");

  // @ts-ignore
  if (config.dev) {
    console.log(`Starting pear in dev mode...`);
    // @ts-ignore
    const { Inspector } = await import("pear-inspect");
    const inspector = await new Inspector();
    const key = await inspector.enable();
    console.log(`Debug with pear://runtime/devtools/${key.toString("hex")}`);
  }

  const rl = readline.createInterface({
    input: new tty.ReadStream(0),
    output: new tty.WriteStream(1),
  });

  rl.prompt();

  // @ts-ignore
  const args = Pear.config.args.reduce((acc, curr, idx) => {
    if (idx % 2 === 0) {
      // @ts-ignore
      acc[curr.slice(1)] = Pear.config.args[idx + 1];
    }
    return acc;
  }, {});
  console.log(`Starting pear with args...`, { args});
  const bootstrapPrivateCorePublicKey = args.bootstrap;
  const storage = args.storage || "./data";

  console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

  mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);

  teardown(() => mneme.destroy())

  mneme.info();

  // const server = MnemeServer();

  await mneme.start();

  // @ts-ignore
  // server.start(mneme);

  rl.on('line', (line) => {
    try {
      eval(line.trim());
    } catch (err) {
      console.error(err);
    }
    rl.prompt();
  });
}

export { Mneme, User, Record };

export { mneme };
