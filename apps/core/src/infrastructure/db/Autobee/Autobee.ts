import Autobase from "autobase";
import b4a from "b4a";
import Hyperbee from "hyperbee";

import type { AutobaseBatch, AutoStore } from "@/@types/autobase.js";
import type { GetOptions, PeekOpts, Range } from "@/@types/hyperbee.js";

export interface AutobeeOptions {
  valueEncoding?: string;
  extension?: boolean;
  apply?: (
    batch: Array<AutobaseBatch>,
    view: Hyperbee,
    base: Autobase<Hyperbee>
  ) => Promise<void>;
}

export interface AutobeeStore {
  store: any;
  coreName?: string;
}

export type AutobeeBootstrap = string | Buffer | null | undefined;

export default class Autobee extends Autobase<Hyperbee> {
  constructor(
    storeObject: AutobeeStore,
    bootstrap: AutobeeBootstrap,
    options: AutobeeOptions = {}
  ) {
    if (
      bootstrap &&
      typeof bootstrap !== "string" &&
      !b4a.isBuffer(bootstrap)
    ) {
      options = bootstrap;
      bootstrap = null;
    }

    const { store, coreName = "autobee" } = storeObject;
    const autobeeOptions = {
      valueEncoding: "json",
      extension: false,
      ...options,
    };

    const open = (viewStore: AutoStore) => {
      const core = viewStore.get(coreName);

      return new Hyperbee(core, {
        keyEncoding: "utf-8",
        ...autobeeOptions,
      });
    };

    const apply =
      "apply" in autobeeOptions ? autobeeOptions.apply : Autobee.apply;

    super(store, bootstrap, {
      ...autobeeOptions,
      open,
      apply,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      close: async (_view: Hyperbee) => {},
      ackInterval: 1000, // enable auto acking with the interval
    });
  }

  static async apply(
    batch: Array<AutobaseBatch>,
    view: Hyperbee,
    base: Autobase<Hyperbee>
  ) {
    for (const node of batch) {
      const operation = JSON.parse(node.value);

      // console.log("[Autobee#apply] ", { operation, value: node.value });

      if (operation.type === "addWriter") {
        await base.addWriter(b4a.from(operation.key, "hex"));
        continue;
      }
    }
  }

  appendOperation(operation: string) {
    return this.append(operation);
  }

  appendWriter(key: string) {
    return this.appendOperation(
      JSON.stringify({
        type: "addWriter",
        key,
      })
    );
  }

  get(key: string, opts?: GetOptions) {
    return this.view.get(key, opts);
  }

  peek(range: Range, opts?: PeekOpts) {
    return this.view.peek(range, opts);
  }

  createReadStream(range?: Range, opts?: GetOptions) {
    return this.view.createReadStream(range, opts);
  }
}
