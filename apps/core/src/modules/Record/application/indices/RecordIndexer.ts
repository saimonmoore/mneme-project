import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { AutobeeIndexer } from "@/infrastructure/db/AutobeeStore/index.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";
import { RecordInputDto } from "@/modules/Record/domain/dtos/RecordInputDto.js";

import { Logger } from '@/infrastructure/logging/logger.js';
import { EntityExistsError } from "@/infrastructure/errors/EntityExistsError.js";
import { EntityNotFoundError } from "@/infrastructure/errors/EntityNotFoundError.js";

import type { RecordCreateOperation, RecordUpdateOperation } from "@/modules/Record/application/usecases/RecordUseCase.js";
import type { Batch as HyperbeeBatch } from "@/@types/hyperbee.js";

const logger = Logger.getInstance();

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
    record.setCreator(user);

    const recordKey = Record.RECORD_BY_USER_KEY(user.hash as string, record.hash);

    logger.info('[Core][RecordIndexer#indexCreateRecord] Preparing record: ', {
      key: Record.RECORD_BY_USER_KEY(user.hash as string, record.hash),
      record,
      user,
      recordData,
      userData
    });

    const result = await this.privateStore.get(recordKey);

    logger.info('[Core][RecordIndexer#indexCreateRecord] Searched for existing record: ', {
      result
    });

    if (result && result.value?.user) {
      throw new EntityExistsError(record.constructor.name);
    }

    logger.info('[Core][RecordIndexer#indexCreateRecord] Persisting as: ', {
      key: recordKey,
      record: record.toProperties(),
    });

    // index by hashed url: index by value
    // /userHash/records/recordHash
    await batch.put(recordKey, {
      record: record.toProperties(),
    });

    await this.indexCreateKeywordsForRecord(batch, operation);
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
      keywords.map(async (keyword) => {
        const keywordsKey = Keyword.KEYWORDS_BY_USER_KEY(user.hash as string) + keyword.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash as string) + camelcase(keyword.label);

        const value = await this.privateStore.get(keywordsKey);

        let records = value?.value?.records;

        if (records) {
          records.push(record.hash);
        } else {
          records = [record.hash];
        }

        await batch.put(keywordsKey, {
          keyword,
          records,
        });

        await batch.put(myKeywordsByLabelKey, {
          keyword,
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