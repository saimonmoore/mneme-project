export interface UserCommon {
  email: string;
  userName?: string;
  encryptedPassword?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
