import { Mneme } from "./mneme.js";
import { logger } from "@/infrastructure/logging/index.js";
import { MnemeServer } from "./server/index.js";

// @ts-ignore
import Pear from "pear";

const useRAM = Pear.config.env["USE_RAM"] === "true";
const storage = Pear.config.storage;

const mneme = new Mneme(useRAM, storage, true);
const server = MnemeServer();

logger.info(`Starting Mneme with storage: ${storage}`);
await mneme.start();

server.start(mneme);

