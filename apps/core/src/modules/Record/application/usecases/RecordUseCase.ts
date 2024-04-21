import camelcase from "camelcase";

import { SessionUseCase } from "@/modules/Session/application/usecases/SessionUseCase/SessionUseCase.js";
import { sessionRequired } from "@/modules/Session/application/decorators/sessionRequired.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { Record } from "@/modules/Record/domain/entities/Record.js";
import { Keyword } from "@/modules/Record/domain/entities/Keyword.js";
import { Tag } from "@/modules/Record/domain/entities/Tag.js";
import { User } from "@/modules/User/domain/entities/User.js";

import { logger } from "@/infrastructure/logging/logger.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";

import type { RecordInputDto } from "@/modules/Record/domain/dtos/RecordInputDto.js";

export interface RecordCreateOperation {
  type: "createRecord";
  record: RecordInputDto;
  user: User;
}

export interface RecordUpdateOperation {
  type: "updateRecord";
  record: RecordInputDto;
  user: User;
}

export interface RecordDeleteOperation {
  type: "deleteRecord";
  record: RecordInputDto;
  user: User;
}

export class RecordUseCase {
  privateStore: PrivateStore;
  session: SessionUseCase;

  constructor(privateStore: PrivateStore, session: SessionUseCase) {
    this.privateStore = privateStore;
    this.session = session;
  }

  // /userHash/record/recordHash

  @sessionRequired
  async *myRecords() {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of this.privateStore.createReadStream({
      gt: Record.RECORDS_BY_USER_KEY(currentUserHash as string),
      lt: `${Record.RECORDS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      const record = Record.fromProperties(data.value.record as RecordInputDto);

      await this.findAndSetCreator(record);

      yield record;
    }
  }

  @sessionRequired
  async *myKeywords() {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of this.privateStore.createReadStream({
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
    for await (const data of this.privateStore.createReadStream({
      gte:
        Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text),
      lt:
        Keyword.MY_KEYWORDS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text) +
        "~",
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

    const result = await this.privateStore.get(
      `${Keyword.KEYWORDS_BY_USER_KEY(currentUserHash as string)}${keywordHash}`
    );

    if (!result) {
      logger.info("No records found for keyword: " + keyword);
      return;
    }

    yield* this.findRecords(result.value.records);
  }

  @sessionRequired
  async *myTags() {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of this.bee.createReadStream({
      gt: Tag.TAGS_BY_USER_KEY(currentUserHash as string),
      lt: `${Tag.TAGS_BY_USER_KEY(currentUserHash as string)}~`,
    })) {
      const tag = Tag.fromProperties({
        ...data.value.keyword,
      });

      tag.records = data.value.records;
      yield tag;
    }
  }

  @sessionRequired
  async *myTagsByLabel(text: string) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of this.privateStore.createReadStream({
      gte:
        Tag.MY_TAGS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text),
      lt:
        Tag.MY_TAGS_BY_LABEL_KEY(currentUserHash as string) +
        camelcase(text) +
        "~",
      limit: 10,
    })) {
      yield Tag.fromProperties({
        ...data.value.tag,
        records: data.value.records,
      });
    }
  }

  @sessionRequired
  async *myRecordsForTag(tag: string) {
    const tagHash = sha256(tag);
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    const result = await this.privateStore.get(
      `${Tag.TAGS_BY_USER_KEY(currentUserHash as string)}${tagHash}`
    );

    if (!result) {
      logger.info("No records found for tag: " + tag);
      return;
    }

    yield* this.findRecords(result.value.records);
  }

  // /userHash/records/recordHash
  // /userHash/tags/tagHash
  // /userHash/keywords/keywordHash

  @sessionRequired
  async addRecord(data: RecordInputDto) {
    const currentUser = this.session.loggedInUser();

    const record = new Record(data);

    logger.info("Created record: " + data);

    return await this.privateStore.appendOperation(
      JSON.stringify({
        type: Record.ACTIONS.CREATE,
        record: record.toProperties(),
        user: currentUser,
      })
    );
  }

  private async findAndSetCreator(record: Record) {
    const result = await this.privateStore.get(
      User.USERS_KEY + record.creatorId
    );

    if (!result) {
      logger.info("No creator found for record: " + record.creatorId);
      return;
    }

    const creator = User.fromProperties(result.value.user);

    record.setCreator(creator);
  }

  private async *findRecords(records: Record[]) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    for (const key of records) {
      const entry = await this.privateStore.get(
        Record.RECORDS_BY_USER_KEY(currentUserHash as string) + key
      );

      if (entry) {
        const record = Record.fromProperties(
          entry.value.record as RecordInputDto
        );
        await this.findAndSetCreator(record);

        yield record;
      }
    }
  }
}
