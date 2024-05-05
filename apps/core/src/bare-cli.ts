import process from 'process'  // Module for reading user input in terminal
import readline from 'readline'  // Module for reading user input in terminal
import tty from 'tty'            // Module to control terminal behavior
import path from 'path';
import fs from 'fs';

import { Mneme } from "@/Mneme/Mneme.js";
import { MnemeRepl } from "@/MnemeRepl.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";
// import { MnemeServer } from "@/server";
import { config, teardown } from "@/pear-compat";

class Cli {
  mneme: Mneme;
  repl: any;
  historyFile: string;
  rl: readline.Interface;

  constructor() {
    // @ts-ignore
    this.historyFile = path.join(global.Pear.config.storage, 'history.txt');
    console.log("History file: ", this.historyFile);

    this.rl = readline.createInterface({
      input: new tty.ReadStream(0),
      output: new tty.WriteStream(1),
      prompt: 'mneme> ',
    });
    this.readHistory();
  }

  async start() {
    this.info();

    // @ts-ignore
    if (config.dev) {
      this.enableDevMode();
    }

    const args = this.mnemeArgs();
    const bootstrapPrivateCorePublicKey = args.b;
    const storagePrefix = args.s ? `-${args.s}` : '';
    // @ts-ignore
    const storage = path.join(Pear.config.storage,`./mneme-hyperdata${storagePrefix}`);

    console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

    this.mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);
    this.mneme.info();

    // const server = MnemeServer();

    await this.mneme.start();

    // @ts-ignore
    // server.start(mneme);

    // this.replRepl();
    this.readlineRepl();
  }

  private mnemeArgs() {
    // @ts-ignore
    return global.Pear.config.args.reduce((acc, curr, idx) => {
      if (idx % 2 === 0) {
        // @ts-ignore
        acc[curr.slice(1)] = global.Pear.config.args[idx + 1];
      }
      return acc;
    }, {});
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
    const command = '(async () => { return await ' + fn + ' }).bind(this.mneme)()';
    eval(command).then((result: string) => {
      console.log(result);
      console.log();
    }).catch((error: any) => {
      console.log("Error: ", error);
      console.log();
    });
  }

  private evalAsyncGenFn(fn: string) {
    const command = '(async () => { try { for await (const data of ' + fn + ') console.log(data) } catch { console.log(' + fn + ') }}).bind(this.mneme)()';

    eval(command).then((result: string) => {
      console.log(result);
      console.log();
    }).catch((error: any) => {
      console.log("Error: ", error);
      console.log();
    });
  }

  private replRepl() {
    this.repl = new MnemeRepl(this.mneme);
    this.repl.start();
  }

  private async readlineRepl() {

    // @ts-ignore
    this.rl.input.setMode(tty.constants.MODE_RAW);
    this.rl.on('data', (line: string) => {
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
          if (line.trim().startsWith('.log')) {
            this.evalAsyncGenFn(line.trim().split('.log')[1].trim());
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
      // @ts-ignore
      fs.writeFileSync(this.historyFile, this.rl._history.entries.join('\n') + '\n');
      this.rl.prompt();
    }).on('close', () => {
      console.log();
      console.log('Have a great day!');
      teardown(() => this.mneme.destroy())
      process.exit(0);
    });
    this.rl.prompt();
  }

  private readHistory() {
    try {
      const data = fs.readFileSync(this.historyFile, 'utf8');
      // @ts-ignore
      this.rl._history.entries = data.trim().split('\n');
    } catch (err) {
      fs.writeFileSync(this.historyFile, '');
    }
  }
}

export { Cli, Friend, Mneme, Record, User };