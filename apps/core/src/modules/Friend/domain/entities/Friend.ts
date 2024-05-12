import { camelcase } from '@/infrastructure/helpers/camelcase.js';

import { sha256 } from "@/infrastructure/helpers/hash.js";
import { FriendInputDto } from "@/modules/Friend/domain/dtos/FriendInputDto.js";
import { FriendDto } from "@/modules/Friend/domain/dtos/FriendDto.js";
import { User } from "@/modules/User/domain/entities/User.js";

import type { Hash } from '@mneme/domain';

export class Friend {
  static USER_FRIENDS_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!org.mneme.friends!`;
  static USER_FRIENDS_BY_NAME_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!org.mneme.friendsByName!`;
  static USER_FRIENDS_BY_USERNAME_KEY = (userKey: string) =>
    `${User.USERS_KEY}${userKey}!org.mneme.friendsByUserName!`;

  static ACTIONS = {
    CREATE: "createFriend",
    UPDATE: "updateFriend",
  };

  userKey: string;
  userName: string;
  displayName: string;
  avatarUrl?: string;
  _peerKeys: Set<string>;
  createdAt: Date;
  updatedAt: Date;

  constructor({ userKey, userName, displayName, avatarUrl }: FriendInputDto) {
    this.userKey = userKey;
    this.userName = userName;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this._peerKeys = new Set();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static fromProperties(properties: FriendInputDto) {
    return new Friend(properties);
  }

  get hash(): Hash {
    return sha256(this.userName);
  }

  // /userHash/friends/friendHash
  get key() {
    return Friend.USER_FRIENDS_KEY(this.userKey) + this.hash;
  }

  // /userHash/friends/EnricoStano
  get byNameKey() {
    return (
      Friend.USER_FRIENDS_BY_NAME_KEY(this.userKey) +
      camelcase(this.displayName as string)
    );
  }

  // /userHash/friends/enricos
  get byUserNameKey() {
    return (
      Friend.USER_FRIENDS_BY_USERNAME_KEY(this.userKey) +
      camelcase(this.userName as string)
    );
  }

  set peerKeys(peerKeys: string | string[]) {
    Array(peerKeys || [])
      .flat()
      .forEach((peerKey) => this._peerKeys.add(peerKey));
  }

  get peerKeys() {
    return Array.from(this._peerKeys);
  }

  toProperties(): FriendDto {
    return {
      userName: this.userName,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
