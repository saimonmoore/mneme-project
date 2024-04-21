import { jest, expect, describe, beforeEach, it } from "@jest/globals";
import { User } from "@/modules/User/domain/entities/User.js";
import { UserInputDto } from "@/modules/User/domain/dtos/UserInputDto.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";

jest.mock("@/modules/Shared/infrastructure/helpers/hash.js", () => ({
  sha256: jest.fn(),
}));

describe("User", () => {
  let user: InstanceType<typeof User>;
  const mockHash = "mockHash";

  const userInput: UserInputDto = {
    email: "test@example.com",
    userName: "testuser",
    displayName: "Test User",
    avatarUrl: "http://example.com/avatar.png",
  };

  beforeEach(() => {
    (sha256 as jest.Mock).mockReturnValue(mockHash);

    user = new User(userInput);
  });

  describe("#toProperties", () => {
    it("returns correct properties", () => {
      const expectedProperties = {
        ...userInput,
      };

      expect(user.toProperties()).toEqual(expect.objectContaining(expectedProperties));
      expect(user.toProperties().createdAt).not.toBeUndefined();
      expect(user.toProperties().updatedAt).not.toBeUndefined();
    });
  });

  describe("#key", () => {
    it("should return correct key", () => {
      const expectedKey = User.USERS_KEY + mockHash;

      expect(user.key).toEqual(expectedKey);
    });
  });

  describe("#fromProperties", () => {
    it("should create user from properties correctly", () => {
      const userFromProperties = User.fromProperties(userInput);

      expect(userFromProperties.toProperties()).toEqual(user.toProperties());
    });
  });

  describe("#get/set writers", () => {
    it("adds unique writers", () => {
      const writers = ["writer1", "writer2", "writer1"];
      const expectedWriters = ["writer1", "writer2"];

      const userFromProperties = User.fromProperties(userInput);
      userFromProperties.writers = writers;

      expect(userFromProperties.writers).toEqual(expectedWriters);
    });
  });
});
