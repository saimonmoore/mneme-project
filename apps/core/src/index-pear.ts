// @ts-ignore
import process from 'process'  // Module for reading user input in terminal
// @ts-ignore
import readline from 'readline'  // Module for reading user input in terminal
// @ts-ignore
import tty from 'tty'            // Module to control terminal behavior

import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";
// import { MnemeServer } from "@/server";
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

  // @ts-ignore
  const args = Pear ? Pear.config.args.reduce((acc, curr, idx) => {
    if (idx % 2 === 0) {
      // @ts-ignore
      acc[curr.slice(1)] = Pear.config.args[idx + 1];
    }
    return acc;
  }, {}) : {};
  const bootstrapPrivateCorePublicKey = args.bootstrap;
  const storage = args.storage || "./data";

  console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

  mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);

  mneme.info();

  // const server = MnemeServer();

  await mneme.start();

  // @ts-ignore
  // server.start(mneme);

  const rl = readline.createInterface({
      input: new tty.ReadStream(0),
      output: new tty.WriteStream(1),
      prompt: 'mneme> ',
  });
  
  // @ts-ignore
  rl.input.setMode(tty.constants.MODE_RAW);
  rl.on('data', (line: string) => {
    switch (line.trim()) {
      case '?':
        console.log();
        console.log('Just type an expression and I will evaluate it for you.');
        console.log();
        console.log('Type ".exit" to exit.');
        break;
      case '.exit':
        console.log();
        console.log('Have a great day!');
        teardown(() => mneme.destroy())
        process.exit(0);
        break;
     default:
       // eslint-disable-next-line no-case-declarations
       console.log();
       // eslint-disable-next-line no-case-declarations
       let result;
       try {
        result = eval(line.trim())
       } catch (error) {
         console.log("Error: ", error);
       }
       console.log(result);
       break;
    }
    rl.prompt();
  }).on('close', () => {
    console.log();
    console.log('Have a great day!');
    teardown(() => mneme.destroy())
    process.exit(0);
  }); 
  rl.prompt();
}

export { Friend, Mneme, Record, User };

export { mneme };