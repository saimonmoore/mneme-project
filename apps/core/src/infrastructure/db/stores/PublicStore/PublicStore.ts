import { AutobeeStore } from "@/infrastructure/db/AutobeeStore/AutobeeStore.js";
import { RecordIndexer } from "@/modules/Record/application/indices/RecordIndexer.js";

import type Corestore from "@/@types/corestore.js";

import type { Hash } from '@mneme/domain';

export class PublicStore extends AutobeeStore {
  static NAMESPACE = "public";

  constructor(corestore: Corestore, bootstrapPublicCorePublicKey: Hash) {
    super(PublicStore.NAMESPACE, corestore, bootstrapPublicCorePublicKey);

    this.indexers = [new RecordIndexer(this)];
  }
}
