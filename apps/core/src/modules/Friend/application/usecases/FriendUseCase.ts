import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { SessionUseCase } from '@/modules/Session/application/usecases/SessionUseCase/index.js';
import { sessionRequired } from '@/modules/Session/application/decorators/sessionRequired.js';
import { Friend } from '@/modules/Friend/domain/entities/Friend.js';
import { Logger } from '@/infrastructure/logging/logger.js';
import { PrivateStore } from '@/infrastructure/db/stores/PrivateStore/index.js';

import type { FriendInputDto } from '@/modules/Friend/domain/dtos/FriendInputDto.js';

const logger = Logger.getInstance();

export interface FriendCreateOperation {
  type: 'createFriend';
  friend: FriendInputDto;
}

export interface FriendUpdateOperation {
  type: 'updateFriend';
  friend: FriendInputDto;
}

export class FriendUseCase {
  privateStore: PrivateStore;
  session: SessionUseCase;

  constructor(privateStore: PrivateStore, session: SessionUseCase) {
    this.privateStore = privateStore;
    this.session = session;
  }

  // /userHash/friends/userHash

  @sessionRequired
  async *friends() {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of await this.privateStore.createReadStream({
      gt: Friend.USER_FRIENDS_KEY(currentUserHash as string),
      lt: `${Friend.USER_FRIENDS_KEY(currentUserHash as string)}~`,
    })) {
      const hash = data.value;
      const entry = await this.privateStore.get(Friend.USER_FRIENDS_KEY + hash);

      if (!entry) {
        logger.error('entry is undefined');
        continue;
      }

      yield Friend.fromProperties(entry.value.friend as FriendInputDto);
    }
  }

  // /userHash/friends/EnricoStano
  // /userHash/friends/Enr

  @sessionRequired
  async *friendsByName(text: string) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of await this.privateStore.createReadStream({
      gte: Friend.USER_FRIENDS_BY_NAME_KEY(currentUserHash as string) + camelcase(text),
      lt:
        Friend.USER_FRIENDS_BY_NAME_KEY(currentUserHash as string) + camelcase(text) + '~',
      limit: 10,
    })) {
      const hash = data.value;
      const entry = await this.privateStore.get(Friend.USER_FRIENDS_KEY(currentUserHash as string) + hash);

      if (!entry) {
        logger.error('entry is undefined');
        continue;
      }

      yield Friend.fromProperties(entry.value.user as FriendInputDto);
    }
  }

  // /userHash/friends/enricos
  // /userHash/friends/enr

  @sessionRequired
  async *friendsByUserName(text: string) {
    const currentUser = this.session.loggedInUser();
    const currentUserHash = currentUser?.hash;

    // @ts-ignore
    for await (const data of await this.privateStore.createReadStream({
      gte: Friend.USER_FRIENDS_BY_USERNAME_KEY(currentUserHash as string) + camelcase(text),
      lt:
        Friend.USER_FRIENDS_BY_USERNAME_KEY(currentUserHash as string) + camelcase(text) + '~',
      limit: 10,
    })) {
      const hash = data.value;
      const entry = await this.privateStore.get(Friend.USER_FRIENDS_KEY(currentUserHash as string) + hash);

      if (!entry) {
        logger.error('entry is undefined');
        continue;
      }

      yield Friend.fromProperties(entry.value.user as FriendInputDto);
    }
  }

  @sessionRequired
  async addFriend(friendData: FriendInputDto) {
    const friend = new Friend(friendData);

    await this.privateStore.appendOperation(
      JSON.stringify({
        type: Friend.ACTIONS.CREATE,
        friend: friend.toProperties(),
      })
    );

    logger.info(`Added user "${friend.userName}" as your friend.`);
  }
}