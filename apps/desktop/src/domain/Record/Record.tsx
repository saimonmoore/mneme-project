import {immerable} from "immer";
import { Expose, plainToInstance } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsUrl, Length, validate, ValidateIf, ValidateNested } from "class-validator";

import { MINIMUM_HASH_LENGTH } from "@mneme/domain";
import { User } from "@mneme/desktop/domain/User/User";
import { Keyword } from "@mneme/desktop/domain/Keyword/Keyword";

import { RecordType, RecordLanguage } from "@mneme/domain";
import type { Hash, RecordCommon, RecordUrl } from "@mneme/domain";

export type RecordInputDto = { url: RecordUrl };

export type RecordError = {
  url?: string[];
  type?: string[];
  keywords?: string[];
  language?: string[];
  creatorHash?: string[];
};

export class Record {
  [immerable] = true;

  @IsNotEmpty()
  @IsUrl()
  @Expose()
  url: RecordUrl;

  @IsNotEmpty()
  @IsEnum(RecordType)
  @Expose()
  type: RecordType;

  @ValidateIf(r => !!r.createdAt)
  @IsNotEmpty()
  @Length(MINIMUM_HASH_LENGTH)
  @Expose()
  hash: Hash;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  image: string;

  @Expose()
  logo: string;

  @Expose()
  publisher: string;

  @IsNotEmpty()
  @IsEnum(RecordLanguage)
  @Expose()
  language: RecordLanguage;

  @ValidateNested()
  @Expose()
  keywords: Set<Keyword>;

  @IsNotEmpty()
  @Length(MINIMUM_HASH_LENGTH)
  @Expose()
  creatorHash: Hash;

  @ValidateIf(r => !!r.creatorHash)
  @ValidateNested()
  @Expose()
  creator: User;

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
  @Expose()
  updatedAt: Date;

  static create(recordInput: RecordInputDto) {
    return plainToInstance(Record, {...recordInput });
  }

  async validate() {
    const errors = await validate(this, { validationError: { target: false } });
    return errors.reduce((obj, error) => {
      obj[error.property as keyof RecordError] = Object.values(
        error.constraints ?? {}
      );
      return obj;
    }, {} as RecordError);
  }
}
