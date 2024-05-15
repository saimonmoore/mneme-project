import { expect, describe, beforeEach, it } from "@jest/globals";
import { Friend } from "@/modules/Friend/domain/entities/Friend";
import { FriendInputDto } from "@/modules/Friend/domain/dtos/FriendInputDto";
import { sha256 } from "@/infrastructure/helpers";

describe("Friend", () => {
  let friend: InstanceType<typeof Friend>;

  const friendInput: FriendInputDto = {
    userName: "testuser",
    userKey: "testuserkey",
    displayName: "Test Friend",
    avatarUrl: "http://example.com/avatar.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    friend = new Friend(friendInput);
  });

  describe("#toProperties", () => {
    it("returns correct properties", () => {
      const expectedProperties = {
        ...friendInput,
      };

      expect(friend.toProperties()).toEqual(expect.objectContaining(expectedProperties));
      expect(friend.toProperties().createdAt).not.toBeUndefined();
      expect(friend.toProperties().updatedAt).not.toBeUndefined();
    });
  });

  describe("#key", () => {
    it("should return correct key", () => {
      const expectedKey = Friend.USER_FRIENDS_KEY(friend.userKey) + sha256(friend.userName);

      expect(friend.key).toEqual(expectedKey);
    });
  });

  describe("#fromProperties", () => {
    it("should create friend from properties correctly", () => {
      const friendFromProperties = Friend.fromProperties(friendInput);

      expect(friendFromProperties.toProperties()).toEqual(friend.toProperties());
    });
  });

  describe("#get/set peerKeys", () => {
    it("adds unique peerKeys", () => {
      const peerKeys = ["peer1", "peer2", "peer1"];
      const expectedPeerKeys = ["peer1", "peer2"];

      const friendFromProperties = Friend.fromProperties(friendInput);
      friendFromProperties.peerKeys = peerKeys;

      expect(friendFromProperties.peerKeys).toEqual(expectedPeerKeys);
    });
  });
});
