import Corestore from "corestore";
import goodbye from "graceful-goodbye";
import EventEmitter from "eventemitter2";

import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { PublicStore } from "@/infrastructure/db/stores/PublicStore/index.js";
import { SwarmManager } from "@/modules/Network/SwarmManager/index.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { UserUseCase } from "@/modules/User/application/usecases/UserUseCase.js";
import { FriendUseCase } from "@/modules/Friend/application/usecases/FriendUseCase.js";
import { RecordUseCase } from "@/modules/Record/application/usecases/RecordUseCase.js";
import { UserInputDto } from "@/modules/User/domain/dtos/UserInputDto.js";
import { RecordInputDto } from "@/modules/Record/domain/dtos/RecordInputDto.js";
import { SessionUseCase } from "@/modules/Session/application/usecases/SessionUseCase/index.js";

export class Mneme {
  static OUT_OF_BAND_SYNC_KEY_DELIMITER = ":";
  static EVENTS = {
    USER_LOGIN: "user:login",
    MNEME_READY: "mneme:ready",
  };
  eventBus: EventEmitter;
  corestore: Corestore;
  privateStore: PrivateStore;
  publicStore: PublicStore;
  userManager: UserUseCase;
  privateRecordManager: RecordUseCase;
  publicRecordManager: RecordUseCase;
  swarmManager: SwarmManager;
  sessionManager: SessionUseCase;
  friendManager: FriendUseCase;

  constructor(bootstrapCorePublicKeys?: string, storage?: string, testingDHT?: any) {
    const [bootstrapPrivateCorePublicKey, bootstrapPublicCorePublicKey] =
      (bootstrapCorePublicKeys &&
        bootstrapCorePublicKeys.split(Mneme.OUT_OF_BAND_SYNC_KEY_DELIMITER)) ||
      [];

    // Setup an internal event emitter
    this.eventBus = new EventEmitter();
    this.setupEventBus();

    // Persistence
    this.corestore = new Corestore(storage || "./data");

    this.privateStore = new PrivateStore(
      this.corestore,
      bootstrapPrivateCorePublicKey
    );

    this.publicStore = new PublicStore(
      this.corestore,
      bootstrapPublicCorePublicKey
    );

    // Application
    this.sessionManager = new SessionUseCase(this.privateStore);
    this.userManager = new UserUseCase(this.privateStore, this.sessionManager);
    this.friendManager = new FriendUseCase(this.privateStore, this.sessionManager);
    this.privateRecordManager = new RecordUseCase(this.privateStore, this.sessionManager);
    this.publicRecordManager = new RecordUseCase(this.publicStore, this.sessionManager);

    // Networking
    this.swarmManager = new SwarmManager(
      { private: this.privateStore, public: this.publicStore },
      this.userManager,
      this.eventBus,
      testingDHT
    );
  }

  // Is formed from both the public and private store public keys
  get outOfBandSyncKey() {
    return `${this.privateStore.publicKeyString}${Mneme.OUT_OF_BAND_SYNC_KEY_DELIMITER}${this.publicStore.publicKeyString}`;
  }

  loggedIn() {
    return this.userManager.loggedIn();
  }

  loggedInUser() {
    return this.userManager.loggedInUser();
  }

  async start() {
    await this.privateStore.start();
    (await this.publicStore) && this.publicStore.start();

    await this.swarmManager.start();

    goodbye(async () => {
      await this.destroy();
    });
  }

  async signup(potentialUserData: UserInputDto) {
    if (this.userManager.loggedIn()) {
      throw new Error("User is already logged in");
    }

    const potentialUser = new User(potentialUserData);

    await this.userManager.signup(potentialUser);

    if (potentialUser) {
      this.eventBus.emit(Mneme.EVENTS.USER_LOGIN, potentialUser);
    }

    return potentialUser;
  }

  async login(email: string, password: string) {
    const user = await this.userManager.login(email, password);

    if (user) {
      this.eventBus.emit(Mneme.EVENTS.USER_LOGIN, user);
    }

    return user;
  }

  async addPrivateRecord(record: RecordInputDto) {
    await this.privateRecordManager.addRecord(record);
  }

  async addPublicRecord(record: RecordInputDto) {
    await this.publicRecordManager.addRecord(record);
  }

  async destroy() {
    await this.swarmManager.destroy();
    await this.privateStore.destroy();
    (await this.publicStore) && this.publicStore.destroy();
  }

  setupEventBus() {
    this.eventBus.on(Mneme.EVENTS.USER_LOGIN, (user: User) => {
      console.log("info: You are now logged in...", { user: user.email });
      console.log();
      console.log("info: Use the following key to synchronise Mneme to your other devices: ", this.outOfBandSyncKey);
    });

    this.eventBus.on(Mneme.EVENTS.MNEME_READY, () => {
      console.log("info: Mneme is ready for business!");
    });
  }

  info() {
    console.log("Usage:");
    console.log();
    console.log("On first node:");
    console.log();
    console.log("`hrepl index.js`");
    console.log();
    console.log("On other nodes:");
    console.log();
    console.log('hrepl index.js "privateCorePublicKeyFromFirstNode" "./data2"');
  }
}
