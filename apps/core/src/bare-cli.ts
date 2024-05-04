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
import { config, teardown } from "@/pear-compat";

class Cli {
  mneme: Mneme;

  async start() {
    this.info();

    // @ts-ignore
    if (config.dev) {
      this.enableDevMode();
    }

    const args = this.mnemeArgs();
    const bootstrapPrivateCorePublicKey = args.b;
    const storage = args.s || "./data";

    console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

    this.mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);
    this.mneme.info();

    // const server = MnemeServer();

    await this.mneme.start();

    // @ts-ignore
    // server.start(mneme);

    await this.repl();
  }

  // TODO: Implement args for node version
  private mnemeArgs() {
    // @ts-ignore
    return global.Pear ? global.Pear.config.args.reduce((acc, curr, idx) => {
      if (idx % 2 === 0) {
        // @ts-ignore
        acc[curr.slice(1)] = global.Pear.config.args[idx + 1];
      }
      return acc;
    }, {}) : {};
  }

  private info() {
    console.log("======================");
    console.log("Starting Mneme cli...");
    console.log("======================");
  }

  private async enableDevMode() {
    console.log(`Starting pear in dev mode...`);
    // @ts-ignore
    const { Inspector } = await import("pear-inspect");
    const inspector = await new Inspector();
    const key = await inspector.enable();
    console.log(`Debug with pear://runtime/devtools/${key.toString("hex")}`);
  }

  private evalAsyncFn(fn: string) {
    console.log("Evaluating async function...", { fn });
     eval('(async () => { return await ' + fn + ' })()').then((result: string) => {
      console.log(result);
      console.log();
     }).catch((error: any) => {
      console.log("Error: ", error);
      console.log();
     });
  }

  private async repl() {

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
          teardown(() => this.mneme.destroy())
          process.exit(0);
          break;
        default:
          // eslint-disable-next-line no-case-declarations
          console.log();
          if (line.trim().startsWith('await')) {
            this.evalAsyncFn(line.trim());
            break;
          }
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
      console.log('...');
      rl.prompt();
    }).on('close', () => {
      console.log();
      console.log('Have a great day!');
      teardown(() => this.mneme.destroy())
      process.exit(0);
    });
    rl.prompt();
  }

}

export { Cli, Friend, Mneme, Record, User };