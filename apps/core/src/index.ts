import { Mneme } from "@/Mneme/Mneme.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";

import { Cli as MnemeCli } from "./cli";

const cli = new MnemeCli();
cli.start();

export { Friend, Mneme, Record, User };
export { cli };