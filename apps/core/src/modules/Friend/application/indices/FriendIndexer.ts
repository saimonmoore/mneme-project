import { Friend } from "@/modules/Friend/domain/entities/Friend.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore";

import type { FriendCreateOperation, FriendUpdateOperation } from "@/modules/Friend/application/usecases/FriendUseCase.js";
import type { Batch as HyperbeeBatch } from "@/@types/hyperbee";
import { EntityExistsError } from "@/infrastructure/errors/EntityExistsError.js";
import { FriendInputDto } from "@/modules/Friend/domain/dtos/FriendInputDto.js";
import { EntityNotFoundError } from "@/infrastructure/errors/EntityNotFoundError.js";
import { AutobeeIndexer } from "@/infrastructure/db/AutobeeStore/index.js";

export type FriendOperation = {
  friend: FriendInputDto;
};

export type FriendOperationResult =
  | {
      value: FriendOperation;
    }
  | null
  | undefined;

export type FriendOperations = FriendCreateOperation | FriendUpdateOperation;

export class FriendIndexer implements AutobeeIndexer {
  privateStore: PrivateStore;

  constructor(privateStore: PrivateStore) {
    this.privateStore = privateStore;
  }

  async handleOperation(batch: HyperbeeBatch, operation: FriendOperations) {
    if (operation.type === Friend.ACTIONS.CREATE) {
      await this.indexCreateFriend(batch, operation);
    }

    if (operation.type === Friend.ACTIONS.UPDATE) {
      await this.indexUpdateFriend(batch, operation);
    }
  }

  async indexCreateFriend(batch: HyperbeeBatch, operation: FriendOperations) {
    const { friend: friendData } = operation;

    const friend = new Friend(friendData);
    // TODO: peerKeys

    const result = await this.privateStore.get(friend.key);

    if (result && result.value?.user) {
      throw new EntityExistsError(friend.constructor.name);
    }

    // index by hashed userName: index by value
    // /userHash/friends/friendHash
    await batch.put(friend.key, {
      friend: friend.toProperties(),
    });

    // index by displayName: index by reference
    // /userHash/friends/EnricoStano
    await batch.put(friend.byNameKey, friend.hash);

    // index by userName: index by reference
    // /userHash/friends/enricos
    await batch.put(friend.byUserNameKey, friend.hash);
  }

  async indexUpdateFriend(batch: HyperbeeBatch, operation: FriendOperations) {
    const { friend: friendData } = operation;

    const friend = new Friend(friendData);
    const result: FriendOperationResult = await this.privateStore.get(
      friend.key
    );

    if (!result || !result.value?.friend) {
      throw new EntityNotFoundError(friend.constructor.name);
    }

    const existingFriend = result.value?.friend;

    // index by userName: index by value
    await batch.put(friend.key, {
      friend: { ...existingFriend, ...friend.toProperties() },
    });
  }
}
