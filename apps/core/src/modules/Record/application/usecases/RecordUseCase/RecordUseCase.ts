import Autobase from 'autobase';
import Hyperbee from 'hyperbee';
import camelcase from 'camelcase';
import { Validator } from 'jsonschema';

import { sha256 } from '@/modules/Shared/infrastructure/helpers/hash.js';
import { OPERATIONS } from '@/config/constants.js';
import {
  RECORDS_BY_USER_KEY,
  TAGS_BY_USER_KEY,
  KEYWORDS_BY_USER_KEY,
  MY_TAGS_BY_LABEL_KEY,
  MY_KEYWORDS_BY_LABEL_KEY,
} from '@/modules/Record/application/indices/Records/records.index.js';
import { RecordEntity } from '@/modules/Record/domain/entities/record.js';
import { KeywordEntity } from '@/modules/Record/domain/entities/keyword.js';
import { TagEntity } from '@/modules/Record/domain/entities/tag.js';
import { logger } from '@/infrastructure/logging/index.js';
import schema from '@/modules/Record/domain/entities/record.schema.json' assert { type: 'json' };

import type { MnemeRecord } from '@/modules/Record/domain/entities/record.js';
import { SessionUseCase } from '@/modules/Session/application/usecases/SessionUseCase/SessionUseCase.js';
import { sessionRequired } from '@/modules/Session/application/decorators/sessionRequired.js';
import { USERS_KEY } from '@/modules/User/application/indices/Users/users.index.js';

function validateRecord(record: MnemeRecord) {
  const validator = new Validator();

  return validator.validate(record, schema as any);
}

// /userHash/records/recordHash
// /userHash/tags/tagHash
// /userHash/keywords/keywordHash

class RecordUseCase {
  bee: Hyperbee;
  autobase: Autobase;
  session: SessionUseCase;

  constructor(bee: Hyperbee, autobase: Autobase, session: SessionUseCase) {
    this.bee = bee;
    this.autobase = autobase;
    this.session = session;
  }

  @sessionRequired
  async *myRecords() {
    const currentUserHash = this.session.currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gt: RECORDS_BY_USER_KEY(currentUserHash as string),
      lt: `${RECORDS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      const record = RecordEntity.create(data.value.record as MnemeRecord);

      await this.findAndSetCreator(record);

      yield record;
    }
  }

  @sessionRequired
  async *myKeywords() {
    const currentUserHash = this.session.currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gt: KEYWORDS_BY_USER_KEY(currentUserHash as string),
      lt: `${KEYWORDS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      yield KeywordEntity.create({
        ...data.value.keyword,
        records: data.value.records,
      });
    }
  }

  @sessionRequired
  async *myKeywordsByLabel(text: string) {
    const currentUserHash = this.session.currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gte:
        MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) + camelcase(text),
      lt:
        MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text) +
        '~',
      limit: 10,
    })) {
      yield KeywordEntity.create({
        ...data.value.keyword,
        records: data.value.records,
      });
    }
  }

  @sessionRequired
  async *myRecordsForKeyword(keyword: string) {
    const keywordHash = sha256(keyword);
    const currentUserHash = this.session.currentUser?.hash;

    const result = await this.bee.get(
      `${KEYWORDS_BY_USER_KEY(currentUserHash as string)}${keywordHash}`,
      { update: false }
    );

    if (!result) {
      logger.info('No records found for keyword: ' + keyword);
      return;
    }

    yield* this.findRecords(result.value.records);
  }

  @sessionRequired
  async *myTags() {
    const currentUserHash = this.session.currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gt: TAGS_BY_USER_KEY(currentUserHash as string),
      lt: `${TAGS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      yield TagEntity.create({
        ...data.value.tag,
        records: data.value.records,
      });
    }
  }

  @sessionRequired
  async *myTagsByLabel(text: string) {
    const currentUserHash = this.session.currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gte: MY_TAGS_BY_LABEL_KEY(currentUserHash as string) + camelcase(text),
      lt:
        MY_TAGS_BY_LABEL_KEY(currentUserHash as string) + camelcase(text) + '~',
      limit: 10,
    })) {
      yield TagEntity.create({
        ...data.value.tag,
        records: data.value.records,
      });
    }
  }

  @sessionRequired
  async *myRecordsForTag(tag: string) {
    const tagHash = sha256(tag);
    const currentUserHash = this.session.currentUser?.hash;

    const result = await this.bee.get(
      `${TAGS_BY_USER_KEY(currentUserHash as string)}${tagHash}`,
      { update: false }
    );

    if (!result) {
      logger.info('No records found for tag: ' + tag);
      return;
    }

    yield* this.findRecords(result.value.records);
  }

  @sessionRequired
  async addRecord(data: MnemeRecord) {
    const validation = validateRecord(data);

    if (!validation.valid) {
      logger.error('Unable to create! Invalid record');
      return { error: validation.errors };
    }

    if (!this.session.currentUser) {
      logger.error('Unable to create! No user logged in');
      return { error: 'No user logged in' };
    }

    logger.info('Created record: ' + data);

    return await this.autobase.append(
      JSON.stringify({
        type: OPERATIONS.RECORD,
        record: data,
        user: this.session.currentUser,
      })
    );
  }

  private async findAndSetCreator(record: RecordEntity) {
    const result = await this.bee.get(USERS_KEY + record.creatorHash, {
      update: false,
    });

    if (!result) {
      logger.info('No creator found for record: ' + record.creatorHash);
      return;
    }

    record.setCreator(result.value.user);
  }

  private async *findRecords(records: MnemeRecord[]) {
    const currentUserHash = this.session.currentUser?.hash;

    for (const hash of records) {
      const entry = await this.bee.get(
        RECORDS_BY_USER_KEY(currentUserHash as string) + hash,
        { update: false }
      );

      const record = RecordEntity.create(entry.value.record);
      await this.findAndSetCreator(record);

      yield record;
    }
  }
}

export { RecordUseCase };
