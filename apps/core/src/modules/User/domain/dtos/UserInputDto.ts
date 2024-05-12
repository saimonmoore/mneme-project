import type { UserCommon } from '@mneme/domain';

export type UserInputDto = UserCommon & {
  password?: string;
};