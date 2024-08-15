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

    const recordKey = Record.RECORD_BY_USER_KEY(user.hash, record.hash);

    logger.info('[Core][RecordIndexer#indexCreateRecord] Preparing record: ', {
      recordKey,
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

    logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] keywords: ', {
      keywords,
    });

    await Promise.all(
      keywords.map(async (keyword) => {
        const keywordsKey = Keyword.KEYWORDS_BY_USER_KEY(user.hash) + keyword.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash) + camelcase(keyword.label);

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] keywordsKey: ', {
          keywordsKey,
          keyword,
        });

        const value = await this.privateStore.get(keywordsKey);

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] value: ', {
          value,
        });

        let records = value?.value?.records;

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] existing records: ', {
          keyword,
          records,
        });

        if (records) {
          logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] adding record to existing records: ', {
            keyword,
            hash: record.hash,
            records,
          });
          records.push(record.hash);
        } else {
          logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] creating new records: ', {
            keyword,
            hash: record.hash,
            records,
          });
          records = [record.hash];
        }

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] records: ', {
          keyword,
          records,
        });

        await batch.put(keywordsKey, {
          keyword,
          records,
        });

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] keywordsKey: ', {
          keyword,
          keywordsKey,
        });

        await batch.put(myKeywordsByLabelKey, {
          keyword,
          records,
        });

        logger.info('[Core][RecordIndexer#indexCreateKeywordsForRecord] myKeywordsByLabelKey: ', {
          keyword,
          myKeywordsByLabelKey,
        });
      })
    );
  }

  async indexUpdateRecord(batch: HyperbeeBatch, operation: RecordOperations) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }

    const user = new User(userData);

    const record = new Record(recordData);
    record.setCreator(user);

    logger.info('[Core][RecordIndexer#indexUpdateRecord] Updating record: ', {
      recordData, operation, record, user
    });

    const recordKey = Record.RECORD_BY_USER_KEY(user.hash, record.hash);

    logger.info('[Core][RecordIndexer#indexUpdateRecord] instantiated Record: ', {
      record,
      key: recordKey,
      hash: record.hash,
    });

    const result: RecordOperationResult = await this.privateStore.get(
      recordKey
    );

    logger.info('[Core][RecordIndexer#indexUpdateRecord] found record: ', {
      result
    });

    if (!result || !result.value?.record) {
      throw new EntityNotFoundError(record.constructor.name);
    }

    logger.info('[Core][RecordIndexer#indexUpdateRecord] Updating record: ', {
      record: record.toProperties(),
    });

    // index by userName: index by value
    await batch.put(recordKey, {
      record: record.toProperties(),
    });
  }
}