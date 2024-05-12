import {immerable} from "immer";
import { Expose, plainToInstance } from "class-transformer";
import { IsEmail, IsNotEmpty, Length, validate } from "class-validator";

import { MINIMUM_PASSWORD_LENGTH } from "@mneme/domain";

export type LoginInputDto = {
  email: string;
  password: string;
};

export type LoginError = {
  email?: string[];
  password?: string[];
};

export class Login {
  [immerable] = true;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @Length(MINIMUM_PASSWORD_LENGTH)
  @Expose()
  password: string;

  static create(loginInput: LoginInputDto) {
    return plainToInstance(Login, loginInput);
  }

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    return errors.reduce((obj, error) => {
      obj[error.property as keyof LoginError] = Object.values(
        error.constraints ?? {}
      );
      return obj;
    }, {} as LoginError);
  }
}
