import { User } from "@/modules/User/domain/entities/User.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";

import { logger } from "@/infrastructure/logging/logger.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";

class SessionUseCase {
  privateStore: PrivateStore;
  currentUser?: User;

  constructor(privateStore: PrivateStore) {
    this.privateStore = privateStore;
    this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  loggedInUser(): User | undefined {
    return this.currentUser;
  }

  async directLoginByKey(userKey: string): Promise<User | undefined> {
    const record = await this.privateStore.get(userKey);

    if (!record) {
      logger.info(`Please sign up! No user found for "${userKey}".`);
      return;
    }

    const user = record && User.fromProperties(record.value.user);
    user.writers = record.value.writers;

    this.currentUser = user;

    return user;
  }

  directLogin(user?: User): User | undefined {
    if (!user) {
      logger.info(`No user to directly login!`);

      return;
    }

    this.currentUser = user;

    return user;
  }

  async login(email: string, password: string): Promise<User | undefined> {
    const partialUser = new User({ email, password });
    logger.info('Logging in as "' + email + '"');

    if (this.isLoggedIn()) {
      logger.info(`Already logged in as ${email}`);
      return;
    }

    const record = await this.privateStore.get(partialUser.key);

    if (!record) {
      logger.info(`Please sign up! No user found for "${email}".`);
      return;
    }

    const user = User.fromProperties(record.value.user);
    user.writers = record.value.writers;

    if (user.encryptedPassword !== sha256(password)) {
      logger.info(`Incorrect password for "${email}".`);
      return;
    }

    // TODO: Add session token
    this.currentUser = user;

    logger.info('Logged in as "' + this.currentUser?.email + '"');

    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = undefined;
    logger.info("Logged out");
  }
}

export { SessionUseCase };
