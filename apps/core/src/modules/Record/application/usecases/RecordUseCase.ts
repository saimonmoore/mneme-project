import type { Hash } from '@mneme/domain';
import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { AutobeeStore } from '@/infrastructure/db/AutobeeStore/index.js';
import { SessionUseCase } from '@/modules/Session/application/usecases/SessionUseCase/SessionUseCase.js';
import { AnalysisUseCase } from '@/modules/AI/application/usecases/AnalysisUseCase.js';
import { sessionRequired } from '@/modules/Session/application/decorators/sessionRequired.js';
import { Record } from '@/modules/Record/domain/entities/Record.js';
import { Keyword } from '@/modules/Record/domain/entities/Keyword.js';
import { User } from '@/modules/User/domain/entities/User.js';
import type { KeywordInputDto } from '@/modules/Record/domain/dtos/KeywordInputDto.js';

import { Logger } from '@/infrastructure/logging/logger.js';
import { sha256 } from '@/infrastructure/helpers/hash.js';

const logger = Logger.getInstance();

import type { RecordInputDto } from '@/modules/Record/domain/dtos/RecordInputDto.js';
import type { AddRecordDto } from '@/modules/Record/domain/dtos/AddRecordDto.js';

export interface RecordCreateOperation {
  type: 'createRecord';
  record: RecordInputDto;
  user: User;
}

export interface RecordUpdateOperation {
  type: 'updateRecord';
  record: RecordInputDto;
  user: User;
}

export interface RecordDeleteOperation {
  type: 'deleteRecord';
  record: RecordInputDto;
  user: User;
}

export class RecordUseCase {
  store: AutobeeStore;
  session: SessionUseCase;

  constructor(store: AutobeeStore, session: SessionUseCase) {
    this.store = store;
    this.session = session;
  }

  @sessionRequired
  async *myData() {
    // @ts-ignore
    for await (const data of await this.store.createReadStream()) {
      yield data;
    }
  }

  // /userHash/record/recordHash

  @sessionRequired
  async *myRecords() {
    const currentUserHash = this.getCurrentUserHash();

    logger.info('[Core][RecordUseCase][*myRecords] =======> ', {
      currentUserHash,
    });

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gt: Record.RECORDS_BY_USER_KEY(currentUserHash),
      lt: `${Record.RECORDS_BY_USER_KEY(currentUserHash)}~`,
    })) {
      const record = Record.fromProperties(data.value.record as RecordInputDto);
      logger.info('[Core][RecordUseCase][*myRecords] =======> iterating... ', {
        record,
      });

      await this.findAndSetCreator(record);

      yield record.toProperties();
    }
  }

  @sessionRequired
  async *myKeywords() {
    const currentUserHash = this.getCurrentUserHash();

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gt: Keyword.KEYWORDS_BY_USER_KEY(currentUserHash),
      lt: `${Keyword.KEYWORDS_BY_USER_KEY(currentUserHash)}~`,
    })) {
      const keyword = Keyword.fromProperties({
        ...data.value.keyword,
      });

      keyword.records = data.value.records;
      yield keyword.toProperties();
    }
  }

  @sessionRequired
  async *myKeywordsByLabel(text: string) {
    const currentUserHash = this.getCurrentUserHash();

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gte: Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash) + camelcase(text),
      lt:
        Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash) +
        camelcase(text) +
        '~',
      limit: 10,
    })) {
      const keyword = Keyword.fromProperties({
        ...data.value.keyword,
      });

      keyword.records = data.value.records;
      yield keyword.toProperties();
    }
  }

  @sessionRequired
  async *myRecordsForKeyword(keyword: Keyword) {
    const currentUserHash = this.getCurrentUserHash();

    const keywordHash = `${Keyword.KEYWORDS_BY_USER_KEY(currentUserHash)}${keyword.hash}`;

    logger.info('[Core][RecordUseCase][*myRecordsForKeyword] =======> ', {
      keyword,
      keywordHash,
    });

    const result = await this.store.get(keywordHash);

    logger.info('[Core][RecordUseCase][*myRecordsForKeyword] =======> ', {
      result,
    });

    if (!result) {
      logger.info('[Core][RecordUseCase][*myRecordsForKeyword] No records found for keyword: ' + keyword);
      return;
    }

    yield* this.findRecordsByKey(result.value.records);
  }

  @sessionRequired
  async findKeywordByLabel(label: string) {
    const currentUserHash = this.getCurrentUserHash();

    const searchKey =
      Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash) + camelcase(label);
    const result = await this.store.get(searchKey);

    if (!result) {
      return null;
    }

    const keyword = Keyword.fromProperties({
      ...result.value.keyword,
    });

    keyword.records = result.value.records;

    return keyword.toProperties();
  }

  // /userHash/records/recordHash
  // /userHash/keywords/keywordHash

  @sessionRequired
  async addRecord(data: AddRecordDto) {
    const currentUser = this.session.loggedInUser();

    // @ts-expect-error
    const record = new Record(data);
    record.setCreator(currentUser as User);

    const analysis = await AnalysisUseCase.analyse(data.url);
    logger.info('[Core][RecordUseCase#addRecord] Analysis: ', {
      analysis,
    });

    if (analysis?.keywords?.length) {
      record.keywords = analysis.keywords;

      logger.info('[Core][RecordUseCase#addRecord] Analysis keywords: ', {
        keywords: analysis.keywords,
        record,
      });
    }

    if (analysis?.categorization?.title) {
      record.title = analysis?.categorization?.title;
    }

    if (analysis?.categorization?.description) {
      record.description = analysis?.categorization?.description;
    }

    if (analysis?.categorization?.image) {
      record.image = analysis?.categorization?.image;
    }

    if (analysis?.categorization?.logo) {
      record.logo = analysis?.categorization?.logo;
    }

    if (analysis?.categorization?.publisher) {
      record.publisher = analysis?.categorization?.publisher;
    }

    if (analysis?.categorization?.language) {
      record.language = analysis?.categorization?.language || 'en';
    }

    record.validate();

    // TODO: Get the text from the analysis for full-text search indexing

    logger.info('[Core][RecordUseCase#addRecord] Created record: ', {
      data,
      record,
      currentUser,
    });

    const recordToPersist = JSON.stringify({
      type: Record.ACTIONS.CREATE,
      record: record.toProperties(),
      user: currentUser,
    });

    logger.info('[Core][RecordUseCase#addRecord] Appending record: ', {
      recordToPersist,
    });

    await this.store.appendOperation(recordToPersist);
    // TODO: Get the record from the store

    return record;
  }

  @sessionRequired
  async updatePrivateRecord(
    hash: Hash,
    updatedKeywords: KeywordInputDto | KeywordInputDto[],
  ): Promise<void> {
    logger.info('[Core][RecordUseCase#updatePrivateRecord] Updating record: ', {
      hash,
      updatedKeywords,
    });
    const currentUser = this.session.loggedInUser();
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const record = await this.findRecordByHash(hash);
    logger.info(
      '[Core][RecordUseCase#updatePrivateRecord] findRecordByHash result: ',
      { record, hash },
    );
    if (!record) {
      throw new Error('Record not found');
    }

    logger.info('[Core][RecordUseCase#updatePrivateRecord] Found record: ', {
      record,
      hash,
    });

    if (record.creatorId !== currentUser.hash) {
      throw new Error('Unauthorized to update this record');
    }

    const keywordsToAdd = [updatedKeywords]
      .flat()
      .filter((keyword) => !keyword.hash);

    const keywordsToDelete = record.keywords.filter(
      (keyword) =>
        ![updatedKeywords]
          .flat()
          .map((k) => k.hash)
          .includes(keyword.hash),
    );

    const keywordsToUpdate = [updatedKeywords]
      .flat()
      .filter((keyword) => keyword.hash);

    logger.info(
      '[Core][RecordUseCase#updatePrivateRecord] filtered keywords: ',
      {
        keywordsToAdd,
        keywordsToDelete,
        keywordsToUpdate,
      },
    );

    record.addKeywords(keywordsToAdd);

    logger.info('[Core][RecordUseCase#updatePrivateRecord] Added keywords: ', {
      keywordsToAdd,
      record,
    });

    record.deleteKeywords(keywordsToDelete);

    logger.info(
      '[Core][RecordUseCase#updatePrivateRecord] Deleted keywords: ',
      {
        keywordsToDelete,
        record,
      },
    );

    record.updateKeywords(keywordsToUpdate);

    logger.info(
      '[Core][RecordUseCase#updatePrivateRecord] Updated keywords: ',
      {
        keywordsToUpdate,
        record,
      },
    );

    const updateOperation = JSON.stringify({
      type: Record.ACTIONS.UPDATE,
      record: record.toProperties(),
      user: currentUser,
    });

    logger.info(
      '[Core][RecordUseCase#updatePrivateRecord] Appending updateOperation: ',
      { updateOperation },
    );

    await this.store.appendOperation(updateOperation);
  }

  private async findRecordByHash(hash: Hash): Promise<Record | null> {
    const currentUserHash = this.getCurrentUserHash();

    logger.info('[Core][RecordUseCase#findRecordByHash] Finding record: ', {
      hash,
      key: Record.RECORD_BY_USER_KEY(currentUserHash, hash),
    });

    const result = await this.store.get(
      Record.RECORD_BY_USER_KEY(currentUserHash, hash),
    );

    logger.info('[Core][RecordUseCase#findRecordByHash] Found record: ', {
      result,
    });

    if (!result) {
      throw new Error(
        `[Core][RecordUseCase#findRecordByHash] No record found for hash: "${hash}".`,
      );
    }

    const record = Record.fromProperties(result.value.record as RecordInputDto);
    await this.findAndSetCreator(record);

    logger.info('[Core][RecordUseCase#findRecordByHash] Found record: ', {
      record,
      hash,
    });

    return record;
  }

  private async findAndSetCreator(record: Record) {
    logger.info('[Core][RecordUseCase][findAndSetCreator] =======> ', {
      record,
      key: User.USERS_KEY + record.creatorId,
    });
    const result = await this.store.get(User.USERS_KEY + record.creatorId);
    logger.info('[Core][RecordUseCase][findAndSetCreator] =======> ', {
      result,
    });

    if (!result) {
      throw new Error(`No creator found for record: "${record.creatorId}".`);
    }

    const creator = User.fromProperties(result.value.user);
    logger.info(
      '[Core][RecordUseCase][findAndSetCreator] =======> Got creator: ',
      { creator },
    );

    record.setCreator(creator);
  }

  private async *findRecordsByKey(records: string[]) {
    const currentUserHash = this.getCurrentUserHash();

    logger.info('[Core][RecordUseCase][findRecordsByKey] =======> ', {
      records,
    });

    for (const hash of records) {
      const entry = await this.store.get(
        Record.RECORDS_BY_USER_KEY(currentUserHash) + hash,
      );

      logger.info('[Core][RecordUseCase][findRecordsByKey] =======> ', {
        entry,
      });

      if (entry) {
        const record = Record.fromProperties(
          entry.value.record as RecordInputDto,
        );
        await this.findAndSetCreator(record);

        logger.info('[Core][RecordUseCase][findRecordsByKey] =======> ', {
          record,
        });

        yield record;
      }
    }
  }

  private getCurrentUserHash(): Hash {
    const currentUser = this.session.loggedInUser();

    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const currentUserHash = currentUser.hash;

    if (!currentUserHash) {
      throw new Error('Logged in User has no hash');
    }

    return currentUserHash;
  }
}
