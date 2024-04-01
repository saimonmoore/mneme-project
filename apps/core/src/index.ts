import minimist from 'minimist';
import { Mneme } from './mneme.js';
import {
  RNClient,
  SessionCommandEvents,
  SessionResultEvents,
} from './RNClient.js';
import { logger } from '@/infrastructure/logging/index.js';

const args = minimist(process.argv, {
  alias: {
    storage: 's',
  },
  default: {
    swarm: true,
  },
  boolean: ['ram', 'swarm'],
});

export const mneme = new Mneme(args.ram, args.storage, args.swarm);

export { RNClient as Client, SessionCommandEvents, SessionResultEvents };

if (args.storage) {
  logger.info(`Starting Mneme with storage: ${args.storage}`);
  await mneme.start();
}
