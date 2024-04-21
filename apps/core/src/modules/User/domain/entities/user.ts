import { sha256 } from "@/infrastructure/helpers/hash.js";
import { UserInputDto } from "@/modules/User/domain/dtos/UserInputDto.js";
import { UserDto } from "@/modules/User/domain/dtos/UserDto.js";
import { UserSchema } from "@/modules/User/domain/entities/UserSchema.js";

export class User {
  static USERS_KEY = "org.mneme.users!";
  static ACTIONS = {
    CREATE: "createUser",
    UPDATE: "updateUser",
  };

  email: string;
  userName?: string;
  encryptedPassword?: string;
  displayName?: string;
  avatarUrl?: string;
  _writers: Set<string>;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    email,
    userName,
    displayName,
    avatarUrl,
    password,
    encryptedPassword,
  }: UserInputDto) {
    this.email = email;
    this.userName = userName;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.encryptedPassword =
      encryptedPassword || (password && sha256(password));
    this._writers = new Set();
    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.validate();
  }

  static fromProperties(properties: UserInputDto) {
    return new User(properties);
  }

  get hash(): string {
    return sha256(this.email);
  }

  get key() {
    return User.USERS_KEY + this.hash;
  }

  set writers(writers: string | string[]) {
    Array(writers || [])
      .flat()
      .forEach((writer) => this._writers.add(writer));
  }

  get writers() {
    return Array.from(this._writers);
  }

  validate() {
    return UserSchema.parse(this.toProperties());
  }

  toProperties(): UserDto {
    return {
      email: this.email,
      userName: this.userName,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      encryptedPassword: this.encryptedPassword,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
