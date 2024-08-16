import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { AutobeeIndexer } from '@/infrastructure/db/AutobeeStore/index.js';
import { PrivateStore } from '@/infrastructure/db/stores/PrivateStore/index.js';
import { Record } from '@/modules/Record/domain/entities/Record.js';
import { User } from '@/modules/User/domain/entities/User.js';
import { Keyword } from '@/modules/Record/domain/entities/Keyword.js';
import { RecordInputDto } from '@/modules/Record/domain/dtos/RecordInputDto.js';

import { Logger } from '@/infrastructure/logging/logger.js';
import { EntityExistsError } from '@/infrastructure/errors/EntityExistsError.js';
import { EntityNotFoundError } from '@/infrastructure/errors/EntityNotFoundError.js';

import type {
  RecordCreateOperation,
  RecordUpdateOperation,
} from '@/modules/Record/application/usecases/RecordUseCase.js';
import type { Batch as HyperbeeBatch } from '@/@types/hyperbee.js';
import { UniquePairSet } from '@/infrastructure/core/UniquePairSet/UniquePairSet';

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
      userData,
    });

    const result = await this.privateStore.get(recordKey);

    logger.info(
      '[Core][RecordIndexer#indexCreateRecord] Searched for existing record: ',
      {
        result,
      },
    );

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

  async indexCreateKeywordsForRecord(
    batch: HyperbeeBatch,
    operation: RecordOperations,
  ) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }
    const user = new User(userData);
    const record = new Record(recordData);

    const keywords = Array.from(record.keywords || new Set([]));

    logger.info(
      '[Core][RecordIndexer#indexCreateKeywordsForRecord] keywords: ',
      {
        keywords,
      },
    );

    await Promise.all(
      keywords.map(async (keyword) => {
        const keywordsKey =
          Keyword.KEYWORDS_BY_USER_KEY(user.hash) + keyword.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash) +
          camelcase(keyword.label);

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] keywordsKey: ',
          {
            keywordsKey,
            keyword,
          },
        );

        const value = await this.privateStore.get(keywordsKey);

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] value: ',
          {
            value,
          },
        );

        let records = value?.value?.records;

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] existing records: ',
          {
            keyword,
            records,
          },
        );

        if (records) {
          logger.info(
            '[Core][RecordIndexer#indexCreateKeywordsForRecord] adding record to existing records: ',
            {
              keyword,
              hash: record.hash,
              records,
            },
          );
          records.push(record.hash);
        } else {
          logger.info(
            '[Core][RecordIndexer#indexCreateKeywordsForRecord] creating new records: ',
            {
              keyword,
              hash: record.hash,
              records,
            },
          );
          records = [record.hash];
        }

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] records: ',
          {
            keyword,
            records,
          },
        );

        await batch.put(keywordsKey, {
          keyword,
          records,
        });

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] keywordsKey: ',
          {
            keyword,
            keywordsKey,
          },
        );

        await batch.put(myKeywordsByLabelKey, {
          keyword,
          records,
        });

        logger.info(
          '[Core][RecordIndexer#indexCreateKeywordsForRecord] myKeywordsByLabelKey: ',
          {
            keyword,
            myKeywordsByLabelKey,
          },
        );
      }),
    );
  }

  async indexUpdateKeywordsForRecord(
    batch: HyperbeeBatch,
    operation: RecordOperations,
    existingKeywords: Keyword[],
  ) {
    const { record: recordData, user: userData } = operation;

    if (!userData) {
      logger.error('user is undefined');
      return;
    }
    const user = new User(userData);
    const record = new Record(recordData);

    const newKeywords = Array.from(record.keywords || new Set([]));

    logger.info(
      '[Core][RecordIndexer#indexUpdateKeywordsForRecord] keywords: ',
      {
        existingKeywords,
        newKeywords,
      },
    );

    const keywordsToRemove = UniquePairSet.difference(
      existingKeywords,
      newKeywords,
      Keyword.uniqueFields,
    );

    logger.info(
      '[Core][RecordIndexer#indexUpdateKeywordsForRecord] keywordsToRemove: ',
      {
        keywordsToRemove,
      },
    );

    // Remove the existing keywords from the index
    await Promise.all(
      keywordsToRemove.map(async (keyword) => {
        const keywordsKey =
          Keyword.KEYWORDS_BY_USER_KEY(user.hash) + keyword.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash) +
          camelcase(keyword.label);

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] keywordsKey: ',
          {
            keyword,
            keywordsKey,
            myKeywordsByLabelKey,
          },
        );

        await batch.del(keywordsKey);
        await batch.del(myKeywordsByLabelKey);

        logger.info(
          '[Core][RecordIndexer#indexUpdatKeywordsForRecord] removed old keywords from index: ',
          {
            keyword,
            keywordsKey,
            myKeywordsByLabelKey,
          },
        );
      }),
    );

    // Add the new keywords to the index
    await Promise.all(
      newKeywords.map(async (keyword) => {
        const keywordsKey =
          Keyword.KEYWORDS_BY_USER_KEY(user.hash) + keyword.hash;
        const myKeywordsByLabelKey =
          Keyword.MY_KEYWORDS_BY_LABEL_KEY(user.hash) +
          camelcase(keyword.label);

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] keywordsKey: ',
          {
            keywordsKey,
            keyword,
          },
        );

        const value = await this.privateStore.get(keywordsKey);

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] value: ',
          {
            value,
          },
        );

        let keywordRecordSet = new Set(value?.value?.records);

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] existing records: ',
          {
            keyword,
            keywordRecordSet,
          },
        );

        if (keywordRecordSet.size > 0) {
          logger.info(
            '[Core][RecordIndexer#indexUpdateKeywordsForRecord] adding record to existing records: ',
            {
              keyword,
              hash: record.hash,
              keywordRecordSet,
            },
          );
          keywordRecordSet.add(record.hash);
        } else {
          logger.info(
            '[Core][RecordIndexer#indexUpdateKeywordsForRecord] creating new records: ',
            {
              keyword,
              hash: record.hash,
              keywordRecordSet,
            },
          );
          keywordRecordSet = new Set([record.hash]);
        }

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] records: ',
          {
            keyword,
            keywordRecordSet,
          },
        );

        await batch.put(keywordsKey, {
          keyword,
          records: Array.from(keywordRecordSet),
        });

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] keywordsKey: ',
          {
            keyword,
            keywordsKey,
          },
        );

        await batch.put(myKeywordsByLabelKey, {
          keyword,
          records: Array.from(keywordRecordSet),
        });

        logger.info(
          '[Core][RecordIndexer#indexUpdateKeywordsForRecord] myKeywordsByLabelKey: ',
          {
            keyword,
            myKeywordsByLabelKey,
          },
        );
      }),
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
      recordData,
      operation,
      record,
      user,
    });

    const recordKey = Record.RECORD_BY_USER_KEY(user.hash, record.hash);

    logger.info(
      '[Core][RecordIndexer#indexUpdateRecord] instantiated Record: ',
      {
        record,
        key: recordKey,
        hash: record.hash,
      },
    );

    const result: RecordOperationResult = await this.privateStore.get(
      recordKey,
    );

    logger.info('[Core][RecordIndexer#indexUpdateRecord] found record: ', {
      result,
    });

    if (!result || !result.value?.record) {
      throw new EntityNotFoundError(record.constructor.name);
    }

    const oldRecord = new Record(result.value.record);
    const existingKeywords = Array.from(oldRecord.keywords || new Set([]));

    logger.info('[Core][RecordIndexer#indexUpdateRecord] Updating record: ', {
      record: record.toProperties(),
    });

    // index by userName: index by value
    await batch.put(recordKey, {
      record: record.toProperties(),
    });

    logger.info('[Core][RecordIndexer#indexUpdateRecord] Updating keywords: ', {
      existingKeywords,
    });
    await this.indexUpdateKeywordsForRecord(batch, operation, existingKeywords);
  }
}
