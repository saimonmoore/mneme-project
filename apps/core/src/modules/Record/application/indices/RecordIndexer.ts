import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { AutobeeIndexer } from "@/infrastructure/db/AutobeeStore/index.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Tag } from "@/modules/Record/domain/entities/Tag.js";
import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";
import { RecordInputDto } from "@/modules/Record/domain/dtos/RecordInputDto.js";

import { logger } from '@/infrastructure/logging/logger.js';
import { EntityExistsError } from "@/infrastructure/errors/EntityExistsError.js";
import { EntityNotFoundError } from "@/infrastructure/errors/EntityNotFoundError.js";

import type { RecordCreateOperation, RecordUpdateOperation } from "@/modules/Record/application/usecases/RecordUseCase.js";
import type { Batch as HyperbeeBatch } from "@/@types/hyperbee.js";

export type RecordOperation = {
  record: RecordInputDto;
  user: User;
};

export type RecordOperationResult =
  | {
      value: RecordOperation;
    }
  | null
  | undefined;

export type RecordOperations = RecordCreateOperation | RecordUpdateOperation;

export class RecordIndexer implements AutobeeIndexer {
  privateStore: PrivateStore;

  constructor(privateStore: PrivateStore) {
    this.privateStore = privateStore;
  }

  async handleOperation(batch: HyperbeeBatch, operation: RecordOperations) {
    if (operation.type === Record.ACTIONS.CREATE) {
      await this.indexCreateRecord(batch, operation);
    }

    if (operation.type === Record.ACTIONS.UPDATE) {
      await this.indexUpdateRecord(batch, operation);
    }
  }

  async indexCreateRecord(batch: HyperbeeBatch, operation: RecordOperations) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }

    const user = new User(userData);

    const record = new Record(recordData);
    const result = await this.privateStore.get(Record.RECORD_BY_USER_KEY(user.hash as string, record.hash));

    if (result && result.value?.user) {
      throw new EntityExistsError(record.constructor.name);
    }

    // index by hashed url: index by value
    // /userHash/records/recordHash
    await batch.put(Record.RECORD_BY_USER_KEY(user.hash as string, record.hash), {
      record: record.toProperties(),
    });

    await this.indexCreateTagsForRecord(batch, operation);
    await this.indexCreateKeywordsForRecord(batch, operation);
  }

  async indexCreateTagsForRecord(batch: HyperbeeBatch, operation: RecordOperations) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }

    const user = new User(userData);
    const record = new Record(recordData);

    const tags = Array.from(record.tags || new Set([]));

    await Promise.all(
      tags.map(async (tag) => {
        const tagsKey = Tag.TAGS_BY_USER_KEY(user.hash as string) + tag.hash;
        const myTagsByLabelKey =
          Tag.MY_TAGS_BY_LABEL_KEY(user.hash as string) + camelcase(tag.label);

        const value = await this.privateStore.get(tagsKey);

        let records = value?.value?.records;

        if (records) {
          records.push(record.hash);
        } else {
          records = [record.hash];
        }

        await batch.put(tagsKey, {
          tag,
          records,
        });

        await batch.put(myTagsByLabelKey, {
          tag,
          records,
        });
      })
    );
  }

  async indexCreateKeywordsForRecord(batch: HyperbeeBatch, operation: RecordOperations) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }
    const user = new User(userData);
    const record = new Record(recordData);

    const keywords = Array.from(record.keywords || new Set([]));

    await Promise.all(
      keywords.map(async (tag) => {
        const keywordsKey = Keyword.KEYWORDS_BY_USER_KEY(user.hash as string) + tag.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash as string) + camelcase(tag.label);

        const value = await this.privateStore.get(keywordsKey);

        let records = value?.value?.records;

        if (records) {
          records.push(record.hash);
        } else {
          records = [record.hash];
        }

        await batch.put(keywordsKey, {
          tag,
          records,
        });

        await batch.put(myKeywordsByLabelKey, {
          tag,
          records,
        });
      })
    );
  }

  async indexUpdateRecord(batch: HyperbeeBatch, operation: RecordOperations) {
    const { record: recordData } = operation;

    const record = new Record(recordData);
    const result: RecordOperationResult = await this.privateStore.get(
      record.key
    );

    if (!result || !result.value?.record) {
      throw new EntityNotFoundError(record.constructor.name);
    }

    // index by userName: index by value
    await batch.put(record.key, {
      record: record.toProperties(),
    });
  }
}