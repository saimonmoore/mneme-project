import { AutobeeIndexer } from "@/infrastructure/db/AutobeeStore/index.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { UserInputDto } from "@/modules/User/domain/dtos/UserInputDto.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";

import { EntityExistsError } from "@/infrastructure/errors/EntityExistsError.js";
import { EntityNotFoundError } from "@/infrastructure/errors/EntityNotFoundError.js";

import type {
  UserCreateOperation,
  UserUpdateOperation,
} from "@/modules/User/application/usecases/UserUseCase.js";
import type { Batch as HyperbeeBatch } from "@/@types/hyperbee.js";

export type UserOperation = {
  user: UserInputDto;
  writers: string[];
};

export type UserOperationResult =
  | {
      value: UserOperation;
    }
  | null
  | undefined;

export type UserOperations = UserCreateOperation | UserUpdateOperation;

export class UserIndexer implements AutobeeIndexer {
  privateStore: PrivateStore;

  constructor(privateStore: PrivateStore) {
    this.privateStore = privateStore;
  }

  async handleOperation(batch: HyperbeeBatch, operation: UserOperations) {
    if (operation.type === User.ACTIONS.CREATE) {
      await this.indexCreateUser(batch, operation);
    }

    if (operation.type === User.ACTIONS.UPDATE) {
      await this.indexUpdateUser(batch, operation);
    }
  }

  async indexCreateUser(batch: HyperbeeBatch, operation: UserOperations) {
    const { user: userData } = operation;
    const writers = operation.writers || [];

    const user = new User(userData);
    user.writers = writers;

    const result: UserOperationResult = await this.privateStore.get(user.key);

    if (result && result.value?.user) {
      throw new EntityExistsError(user.constructor.name);
    }

    await batch.put(user.key, {
      user: user.toProperties(),
      writers: user.writers,
    });
  }

  async indexUpdateUser(batch: HyperbeeBatch, operation: UserOperations) {
    const { user: userData } = operation;
    const writers = operation.writers || [];

    const user = new User(userData);
    const result: UserOperationResult = await this.privateStore.get(user.key);

    if (!result || !result.value?.user) {
      throw new EntityNotFoundError(user.constructor.name);
    }

    await batch.put(user.key, {
      user: userData,
      writers,
    });
  }
}
