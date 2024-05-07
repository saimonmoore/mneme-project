import { Expose, plainToInstance } from "class-transformer";
import { IsEmail, IsNotEmpty, Length, validate } from "class-validator";

import { MINIMUM_PASSWORD_LENGTH } from "../../config/constants";

export type UserInputDto = {
  userName: string;
  email: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
};

export type UserError = {
  email?: string[];
  password?: string[];
  userName?: string[];
  displayName?: string[];
  avatarUrl?: string[];
};

export class User {

  @IsNotEmpty()
  @Expose()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @Length(MINIMUM_PASSWORD_LENGTH)
  @Expose()
  encyptedPassword: string;

  @IsNotEmpty()
  @Expose()
  displayName: string;

  @Expose()
  avatarUrl: string;

  static create(userInput: UserInputDto) {
    // TODO: encrypt password
    return plainToInstance(User, {...userInput, encyptedPassword: userInput.password});
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
