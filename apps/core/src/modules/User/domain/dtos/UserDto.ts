export type UserDto = {
  email: string;
  userName?: string;
  displayName?: string;
  avatarUrl?: string;
  encryptedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
};
