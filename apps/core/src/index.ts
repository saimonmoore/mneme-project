import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";

async function initBareCLI() {
    console.log("Initializing bare CLI");
    const { Cli: MnemeCli } = await import("./bare-cli");
    const cli = new MnemeCli();
    cli.start();

    return cli;
}

async function initNodeCLI() {
    console.log("Initializing node CLI");
    const { Cli: MnemeCli } = await import("./node-cli");
    const cli = new MnemeCli();
    cli.start();

    return cli;
}

let cli;

// @ts-ignore
if (global.Pear) {
    cli = await initBareCLI();
} else {
    cli = await initNodeCLI();
}


export { Friend, Mneme, Record, User };
export { cli };