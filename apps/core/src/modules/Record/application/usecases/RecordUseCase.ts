import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { AutobeeStore } from '@/infrastructure/db/AutobeeStore/index.js';
import { SessionUseCase } from '@/modules/Session/application/usecases/SessionUseCase/SessionUseCase.js';
import { AnalysisUseCase } from '@/modules/AI/application/usecases/AnalysisUseCase.js';
import { sessionRequired } from '@/modules/Session/application/decorators/sessionRequired.js';
import { Record } from '@/modules/Record/domain/entities/Record.js';
import { Keyword } from '@/modules/Record/domain/entities/Keyword.js';
import { User } from '@/modules/User/domain/entities/User.js';

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
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    console.log('[Core][RecordUseCase][*myRecords] =======> ', {
      currentUser,
      currentUserHash,
    });

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gt: Record.RECORDS_BY_USER_KEY(currentUserHash as string),
      lt: `${Record.RECORDS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      const record = Record.fromProperties(data.value.record as RecordInputDto);
      console.log('[Core][RecordUseCase][*myRecords] =======> iterating... ', {
        record,
      });

      await this.findAndSetCreator(record);

      yield record;
    }
  }

  @sessionRequired
  async *myKeywords() {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gt: Keyword.KEYWORDS_BY_USER_KEY(currentUserHash as string),
      lt: `${Keyword.KEYWORDS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      const keyword = Keyword.fromProperties({
        ...data.value.keyword,
      });

      keyword.records = data.value.records;
      yield keyword;
    }
  }

  @sessionRequired
  async *myKeywordsByLabel(text: string) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of await this.store.createReadStream({
      gte:
        Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text),
      lt:
        Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text) +
        '~',
      limit: 10,
    })) {
      const keyword = Keyword.fromProperties({
        ...data.value.keyword,
      });

      keyword.records = data.value.records;
      yield keyword;
    }
  }

  @sessionRequired
  async *myRecordsForKeyword(keyword: string) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;
    const keywordHash = sha256(keyword);

    const result = await this.store.get(
      `${Keyword.KEYWORDS_BY_USER_KEY(
        currentUserHash as string,
      )}${keywordHash}`,
    );

    if (!result) {
      logger.info('No records found for keyword: ' + keyword);
      return;
    }

    yield* this.findRecordsByKey(result.value.records);
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

    if (analysis?.keywords?.length) {
      record.keywords = analysis.keywords;
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

  private async findAndSetCreator(record: Record) {
    console.log('[Core][RecordUseCase][findAndSetCreator] =======> ', {
      record,
      key: User.USERS_KEY + record.creatorId,
    });
    const result = await this.store.get(User.USERS_KEY + record.creatorId);
    console.log('[Core][RecordUseCase][findAndSetCreator] =======> ', {
      result,
    });

    if (!result) {
      throw new Error(`No creator found for record: "${record.creatorId}".`);
    }

    const creator = User.fromProperties(result.value.user);
    console.log(
      '[Core][RecordUseCase][findAndSetCreator] =======> Got creator: ',
      { creator },
    );

    record.setCreator(creator);
  }

  private async *findRecordsByKey(records: string[]) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    for (const key of records) {
      const entry = await this.store.get(
        Record.RECORDS_BY_USER_KEY(currentUserHash as string) + key,
      );

      if (entry) {
        const record = Record.fromProperties(
          entry.value.record as RecordInputDto,
        );
        await this.findAndSetCreator(record);

        yield record;
      }
    }
  }
}
