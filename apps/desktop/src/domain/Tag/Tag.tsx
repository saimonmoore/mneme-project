import {immerable} from "immer";
import { Expose, plainToInstance } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, validate } from "class-validator";
import { MINIMUM_HASH_LENGTH } from "@mneme/domain";
import type { Hash, TagCommon } from "@mneme/domain";

export type TagInputDto = TagCommon & {};

export type TagError = {
  label?: string[];
  wikiLink?: string[];
};

export class Tag {
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

  static create(tagInput: TagInputDto) {
    return plainToInstance(Tag, {...tagInput });
  }

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    return errors.reduce((obj, error) => {
      obj[error.property as keyof TagError] = Object.values(
        error.constraints ?? {}
      );
      return obj;
    }, {} as TagError);
  }
}
