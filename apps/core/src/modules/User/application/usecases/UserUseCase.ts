import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { SessionUseCase } from "@/modules/Session/application/usecases/SessionUseCase/index.js";
import { sessionRequired } from "@/modules/Session/application/decorators/sessionRequired.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { UserInputDto } from "@/modules/User/domain/dtos/UserInputDto.js";

import { logger } from "@/infrastructure/logging/logger.js";

export interface UserCreateOperation {
  type: "createUser";
  user: UserInputDto;
  writers: string[];
}

export interface UserUpdateOperation {
  type: "updateUser";
  user: UserInputDto;
  writers: string[];
}

export class UserUseCase {
  currentUser: User;
  privateStore: PrivateStore;
  session: SessionUseCase;

  constructor(privateStore: PrivateStore, session: SessionUseCase) {
    this.privateStore = privateStore;
    this.session = session;
  }

  loggedIn() {
    return this.session.isLoggedIn();
  }

  loggedInUser() {
    return this.session.loggedInUser();
  }

  // TODO: @adminRequired
  @sessionRequired
  async *users() {
    // @ts-ignore
    for await (const data of await this.privateStore.createReadStream({
      gt: User.USERS_KEY,
      lt: `${User.USERS_KEY}~`,
    })) {
      yield User.fromProperties(data.value.user as UserInputDto);
    }
  }

  async signup(user: User) {
    logger.info(`Signing up with: ${user.email}`);
    const writers = [this.privateStore.localPublicKeyString];

    await this.privateStore.appendOperation(
      JSON.stringify({
        type: User.ACTIONS.CREATE,
        user: user.toProperties(),
        writers,
      })
    );

    if (user) {
      user.writers = writers;
      this.currentUser = user;
    }

    this.session.directLogin(user);

    logger.info(`Created user for "${user.email}".`);

    return true;
  }

  async login(email: string, password: string) {
    return this.session.login(email, password);
  }

  async directLogin(userKey: string) {
    return this.session.directLoginByKey(userKey);
  }

  async updateWriter(writer: string) {
    const currentUser = this.session.loggedInUser();

    if (!currentUser) {
      throw new Error("No logged in user to update writer!");
    }

    const userData = await this.privateStore.get(currentUser.key);

    if (!userData) {
      throw new Error("No persisted user to update writer!");
    }

    currentUser.writers = writer;

    await this.privateStore.appendOperation(
      JSON.stringify({
        type: User.ACTIONS.UPDATE,
        user: currentUser.toProperties(),
        writers: currentUser.writers,
      })
    );
  }
}
