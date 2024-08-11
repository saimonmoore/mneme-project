import Corestore from "corestore";
// import goodbye from "graceful-goodbye";
import { EventEmitter } from "events";

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
import { FriendInputDto } from "@/modules/Friend/domain/dtos";

import type { Hash } from "@mneme/domain";

type MnemeListener = {
  event: string;
  callback: (mneme: Mneme) => (...args: any[]) => void;
};

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

  constructor(
    bootstrapCorePublicKeys?: Hash,
    storage?: string | any,
    testingDHT?: any,
    dht?: any,
    listeners: MnemeListener[] = []
  ) {
    const [bootstrapPrivateCorePublicKey, bootstrapPublicCorePublicKey] =
      (bootstrapCorePublicKeys &&
        bootstrapCorePublicKeys.split(Mneme.OUT_OF_BAND_SYNC_KEY_DELIMITER)) ||
      [];

    // Setup an internal event emitter
    this.eventBus = new EventEmitter();
    this.setupEventBus(listeners);

    // Persistence
    this.corestore = new Corestore(storage || "./data");

    this.privateStore = new PrivateStore(
      this.corestore,
      bootstrapPrivateCorePublicKey as Hash
    );

    this.publicStore = new PublicStore(
      this.corestore,
      bootstrapPublicCorePublicKey as Hash
    );

    // Application
    this.sessionManager = new SessionUseCase(this.privateStore);
    this.userManager = new UserUseCase(this.privateStore, this.sessionManager);
    this.friendManager = new FriendUseCase(
      this.privateStore,
      this.sessionManager
    );
    this.privateRecordManager = new RecordUseCase(
      this.privateStore,
      this.sessionManager
    );
    this.publicRecordManager = new RecordUseCase(
      this.publicStore,
      this.sessionManager
    );

    // Networking
    this.swarmManager = new SwarmManager(
      { private: this.privateStore, public: this.publicStore },
      this.userManager,
      this.eventBus,
      testingDHT,
      dht
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

    // TODO: https://github.com/mafintosh/graceful-goodbye/pull/6
    // goodbye(async () => {
    //   await this.destroy();
    // });
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

  async logout() {
    await this.sessionManager.logout();
  }
  
  // TODO: ADMIN only
  async *users() {
    yield* this.userManager.users();
  }

  async *myFriends() {
    yield* this.friendManager.friends();
  }

  async *friendsByName(text: string) {
    yield* this.friendManager.friendsByName(text);
  }

  async *friendsByUserName(text: string) {
    yield* this.friendManager.friendsByUserName(text);
  }

  async addFriend(friend: FriendInputDto) {
    return await this.friendManager.addFriend(friend);
  }

  async addPrivateRecord(record: RecordInputDto) {
    return await this.privateRecordManager.addRecord(record);
  }

  async addPublicRecord(record: RecordInputDto) {
    return await this.publicRecordManager.addRecord(record);
  }

  async destroy() {
    await this.swarmManager.destroy();
    await this.privateStore.destroy();
    (await this.publicStore) && this.publicStore.destroy();
  }

  async *myKeywords() {
    yield* this.privateRecordManager.myKeywords();
  }

  async *myPublicKeywords() {
    yield* this.publicRecordManager.myKeywords();
  }

  async *myKeywordsByLabel(text: string) {
    yield* this.privateRecordManager.myKeywordsByLabel(text);
  }

  async *myPublicKeywordsByLabel(text: string) {
    yield* this.publicRecordManager.myKeywordsByLabel(text);
  }

  async *myRecordsForKeyword(keyword: string) {
    yield* this.privateRecordManager.myRecordsForKeyword(keyword);
  }

  async *myPublicRecordsForKeyword(keyword: string) {
    yield* this.publicRecordManager.myRecordsForKeyword(keyword);
  }

  async *myTags() {
    yield* this.privateRecordManager.myTags();
  }

  async *myPublicTags() {
    yield* this.publicRecordManager.myTags();
  }

  async *myTagsByLabel(text: string) {
    yield* this.privateRecordManager.myTagsByLabel(text);
  }

  async *myPublicTagsByLabel(text: string) {
    yield* this.publicRecordManager.myTagsByLabel(text);
  }

  async *myRecordsForTag(tag: string) {
    yield* this.privateRecordManager.myRecordsForTag(tag);
  }

  async *myPublicRecordsForTag(tag: string) {
    yield* this.publicRecordManager.myRecordsForTag(tag);
  }

  async *myRecords() {
    yield* this.privateRecordManager.myRecords();
  }

  async *myPublicRecords() {
    yield* this.publicRecordManager.myRecords();
  }
  
  async *myPrivateData() {
    console.log("WARN!: REMOVE ME!");
    yield* this.privateRecordManager.myData();
  }

  setupEventBus(listeners: MnemeListener[] = []) {
    listeners.forEach((listener: MnemeListener) => {
      this.eventBus.on(listener.event, listener.callback(this));
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
