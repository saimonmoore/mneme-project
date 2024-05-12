import type { FriendCommon } from '@mneme/domain';

export type FriendInputDto = FriendCommon & {
  userKey: string;
};