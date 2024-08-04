import minimist from 'minimist';

import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";

class Cli {
  mneme: Mneme;

  async start() {
    this.info();

    const args = this.mnemeArgs();
    const bootstrapPrivateCorePublicKey = args.bootstrap;
    const storage = args.storage || "./data";

    console.log("Starting Mneme with args", { storage, bootstrapPrivateCorePublicKey });

    this.mneme = new Mneme(bootstrapPrivateCorePublicKey, storage);
    this.mneme.info();

    await this.mneme.start();
  }

  // TODO: Implement args for node version
  private mnemeArgs() {
    return minimist(process.argv, {
      alias: {
        storage: 's',
        bootstrap: 'b',
      },
      default: {
        storage: './data',
      },
    });
  }

  private info() {
    console.log("======================");
    console.log("Starting Mneme cli...");
    console.log("======================");
  }
}

export { Cli, Friend, Mneme, Record, User };