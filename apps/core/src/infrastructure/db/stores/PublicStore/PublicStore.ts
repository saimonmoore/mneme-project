import { AutobeeStore } from "@/infrastructure/db/AutobeeStore/AutobeeStore.js";
import { RecordIndexer } from "@/modules/Record/application/indices/RecordIndexer.js";

import type Corestore from "@/@types/corestore.js";

export class PublicStore extends AutobeeStore {
  static NAMESPACE = "public";

  constructor(corestore: Corestore, bootstrapPublicCorePublicKey: string) {
    super(PublicStore.NAMESPACE, corestore, bootstrapPublicCorePublicKey);

    this.indexers = [new RecordIndexer(this)];
  }
}
