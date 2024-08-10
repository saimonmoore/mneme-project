import { immerable } from "immer";
import { Expose, plainToInstance } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  Length,
  validate,
  ValidateIf,
} from "class-validator";
import { Match } from "@mneme/desktop/domain/validators/Match";

import { MINIMUM_PASSWORD_LENGTH, MINIMUM_HASH_LENGTH } from "@mneme/domain";

import type { Hash, UserCommon } from "@mneme/domain";

export type UserInputDto = UserCommon & {
  password?: string;
  passwordConfirmation?: string;
};

export type UserError = {
  email?: string[];
  password?: string[];
  passwordConfirmation?: string[];
  userName?: string[];
  displayName?: string[];
  avatarUrl?: string[];
};

export class User {
  [immerable] = true;

  @ValidateIf((u: User) => !!u.createdAt)
  @IsNotEmpty()
  @Length(MINIMUM_HASH_LENGTH)
  @Expose()
  hash: Hash;

  @IsNotEmpty()
  @Expose()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ValidateIf((u: User) => !u.createdAt)
  @Length(MINIMUM_PASSWORD_LENGTH)
  @Expose()
  password?: string;

  @ValidateIf((u: User) => !u.createdAt && !!u.password)
  @Match<User>('password')
  @Expose()
  passwordConfirmation?: string;

  @IsNotEmpty()
  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string;

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
  @Expose()
  updatedAt: Date;

  static create(userInput: UserInputDto) {
    return plainToInstance(User, {
      ...userInput,
    });
  }

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    return errors.reduce((obj, error) => {
      obj[error.property as keyof UserError] = Object.values(
        error.constraints ?? {}
      );
      return obj;
    }, {} as UserError);
  }
}
