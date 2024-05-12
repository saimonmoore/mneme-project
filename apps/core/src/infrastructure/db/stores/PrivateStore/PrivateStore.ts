import { AutobeeStore } from "@/infrastructure/db/AutobeeStore/AutobeeStore.js";
import { UserIndexer } from "@/modules/User/application/indices/UserIndexer/index.js";
import { RecordIndexer } from "@/modules/Record/application/indices/RecordIndexer.js";

import type Corestore from "@/@types/corestore.js";
import { FriendIndexer } from "@/modules/Friend/application/indices/FriendIndexer.js";

import type { Hash } from '@mneme/domain';

export class PrivateStore extends AutobeeStore {
  static NAMESPACE = "private";

  constructor(corestore: Corestore, bootstrapPrivateCorePublicKey: Hash) {
    super(PrivateStore.NAMESPACE, corestore, bootstrapPrivateCorePublicKey);

    this.indexers = [
      new UserIndexer(this),
      new FriendIndexer(this),
      new RecordIndexer(this),
    ];
  }
}
