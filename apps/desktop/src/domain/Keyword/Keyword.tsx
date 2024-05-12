import {immerable} from "immer";
import { Expose, plainToInstance } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, validate } from "class-validator";
import { MINIMUM_HASH_LENGTH } from "@mneme/domain";

import type { Hash, KeywordCommon } from "@mneme/domain";

export type KeywordInputDto = KeywordCommon & {};

export type KeywordError = {
  label?: string[];
  wikiLink?: string[];
};

export class Keyword {
  [immerable] = true;

  @IsNotEmpty()
  @IsString()
  @Expose()
  label: string;

  @IsOptional()
  @IsUrl()
  @Expose()
  wikiLink: string;

  @IsNotEmpty()
  @Length(MINIMUM_HASH_LENGTH)
  @Expose()
  hash: Hash;

  static create(keywordInput: KeywordInputDto) {
    return plainToInstance(Keyword, {...keywordInput });
  }

  static createCollection(keywordInputs: KeywordInputDto[]) {
    return keywordInputs.map((keyword: KeywordInputDto) => Keyword.create(keyword));
  }

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    return errors.reduce((obj, error) => {
      obj[error.property as keyof KeywordError] = Object.values(
        error.constraints ?? {}
      );
      return obj;
    }, {} as KeywordError);
  }
}
