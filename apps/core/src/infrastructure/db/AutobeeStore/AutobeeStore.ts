import b4a from "b4a";
import Autobee from "../Autobee/Autobee.js";

import type Corestore from "@/@types/corestore.js";
import type Hyperbee from "@/@types/hyperbee.js";
import type { GetOptions, Batch as HyperbeeBatch, PeekOpts, Range } from "@/@types/hyperbee.js";
import type Autobase from "@/@types/autobase.js";
import type { AutobaseBatch } from "@/@types/autobase.js";
import type NoiseSecretStream from "@/@types/hyperswarm-secret-stream.js";

export interface AutobeeIndexer {
  handleOperation: (batch: HyperbeeBatch, operation: any) => Promise<void>;
}

export class AutobeeStore {
  namespace: string;
  corestore: Corestore;
  core: Corestore;
  bootstrapPublicKey: string;
  autoBee: Autobee;
  indexers: AutobeeIndexer[];

  constructor(namespace: string, corestore: Corestore, bootstrapPublicKey: string) {
    this.namespace = namespace;
    this.corestore = corestore;
    this.core = this.corestore.namespace(namespace);
    this.bootstrapPublicKey = bootstrapPublicKey;
    this.autoBee = this.setupAutoBee();
    this.indexers = [];
  }

  get bootstrapped() {
    return !!this.bootstrapPublicKey;
  }

  get publicKey() {
    return this.autoBee.key;
  }

  get publicKeyString() {
    return b4a.toString(this.publicKey, "hex");
  }

  get localPublicKey() {
    return this.autoBee.local.key;
  }

  get localPublicKeyString() {
    return b4a.toString(this.localPublicKey, "hex");
  }

  get discoveryKey() {
    return this.autoBee.discoveryKey;
  }

  get discoveryKeyString() {
    return b4a.toString(this.discoveryKey, "hex");
  }

  async start() {
    await this.autoBee.update();
    this.autoBee.view.core.on("append", this.handleAppendEvents.bind(this));
  }

  async destroy() {
    await (this.autoBee as Autobase<Hyperbee>).close();
  }

  async handleApplyEvents(batch: Array<AutobaseBatch>, view: Hyperbee, base: Autobase<Hyperbee>) {
    const batchedBeeOperations = view.batch({ update: false });

    for (const { value } of batch) {
      const operation = JSON.parse(value);
      // console.log("[AutobeeStore#handleApplyEvents]", { value, operation });

      await Promise.all(
        this.indexers.map((indexer: AutobeeIndexer) => {
          return indexer.handleOperation(batchedBeeOperations, operation);
        })
      );
    }

    await batchedBeeOperations.flush();

    await Autobee.apply(batch, view, base);
  }

  // TODO: This is a temporary method to log the key/value pairs in the db
  async handleAppendEvents() {
    // Skip append event for hyperbee's header block
    if (this.autoBee.view.version === 1) return;

    for await (const node of await this.autoBee.createReadStream()) {
      console.log("[AutobeeStore#handleAppendEvents] ==========> entry: ", {
        key: node.key,
        value: node.value,
      });
      console.log();
    }
  }

  setupAutoBee() {
    const autobee = new Autobee(
      { store: this.core, coreName: this.namespace },
      this.bootstrapPublicKey,
      {
        apply: this.handleApplyEvents.bind(this),
      }
    ).on("error", console.error);

    return autobee;
  }

  async replicate(connection: NoiseSecretStream) {
    return this.corestore.replicate(connection);
  }

  // Delegate any other calls to autobee
  async appendOperation(operation: string) {
    return this.autoBee.appendOperation(operation);
  }

  async appendWriter(key: string) {
    return this.autoBee.appendWriter(key);
  }

  async get(key: string, opts?: GetOptions) {
    return this.autoBee.get(key, opts);
  }

  async peek(range: Range, opts?: PeekOpts) {
    return this.autoBee.peek(range, opts);
  }

  async createReadStream(range?: Range, opts?: GetOptions) {
    return this.autoBee.createReadStream(range, opts);
  }
}
