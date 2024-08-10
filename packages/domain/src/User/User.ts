import { Hash } from "@mneme/domain"

export interface UserCommon {
  hash?: Hash;
  email: string;
  userName?: string;
  encryptedPassword?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
