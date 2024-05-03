import { jest, expect, describe, beforeEach, it } from "@jest/globals";

import { FriendUseCase } from "@/modules/Friend/application/usecases/FriendUseCase.js";
import { SessionUseCase } from "@/modules/Session/application/usecases/SessionUseCase/index.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { Friend } from "@/modules/Friend/domain/entities/Friend.js";
import { Logger } from "@/infrastructure/logging/logger.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";
import { SessionRequiredError } from "@/infrastructure/errors/SessionRequiredError.js";

const logger = Logger.getInstance();

describe("FriendUseCase", () => {
  let friendUseCase: FriendUseCase;
  let privateStore: PrivateStore;
  let sessionUseCase: SessionUseCase;

  const user = User.fromProperties({
    email: "foo@bar.com",
    password: "password",
  });

  const userKey = sha256(user.email);

  beforeEach(() => {
    privateStore = {
      createReadStream: jest.fn(),
      get: jest.fn(),
      appendOperation: jest.fn(),
    } as Partial<jest.Mocked<PrivateStore>> as jest.Mocked<PrivateStore>;

    sessionUseCase = {
      loggedInUser: jest.fn(),
    } as Partial<jest.Mocked<SessionUseCase>> as jest.Mocked<SessionUseCase>;

    friendUseCase = new FriendUseCase(privateStore, sessionUseCase);
  });

  describe("#friends", () => {
    describe("when user is not logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(undefined);
      });

      it("throws a SessionRequiredError", async () => {
        await expect(friendUseCase.friends).rejects.toThrowError(
          SessionRequiredError
        );
      });
    });

    describe("when user is logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(user);
      });

      describe("when query returns friends", () => {
        const friendEntry = {
          value: {
            friend: {
              userKey,
              userName: "enrico",
              displayName: "Enrico Stano",
            },
          },
        };
        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield friendEntry;
            },
          });
        });

        it("returns a generator of friends", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friends()) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gt: Friend.USER_FRIENDS_KEY(userKey),
            lt: `${Friend.USER_FRIENDS_KEY(userKey)}~`,
          });
          expect(friends).toEqual([new Friend(friendEntry.value.friend)]);
        });
      });

      describe("when query returns an empty set", () => {
        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield undefined;
            },
          });
          jest.spyOn(logger, "error");
        });

        it("logs an error if entry is undefined", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friends()) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gt: Friend.USER_FRIENDS_KEY(userKey),
            lt: `${Friend.USER_FRIENDS_KEY(userKey)}~`,
          });
          expect(logger.error).toHaveBeenCalledWith("entry is undefined");
          expect(friends).toEqual([]);
        });
      });
    });
  });

  describe("#friendsByName", () => {
    describe("when user is not logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(undefined);
      });

      it("throws a SessionRequiredError", async () => {
        await expect(friendUseCase.friendsByName).rejects.toThrowError(
          SessionRequiredError
        );
      });
    });

    describe("when user is logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(user);
      });
      describe("when query returns friends", () => {
        const friendEntry = {
          value: {
            friend: {
              userKey,
              userName: "john",
              displayName: "John Smith",
            },
          },
        };

        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield friendEntry;
            },
          });
        });

        it("returns a generator of friends filtered by name", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friendsByName("John")) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gte: Friend.USER_FRIENDS_BY_NAME_KEY(userKey) + "john",
            lt: Friend.USER_FRIENDS_BY_NAME_KEY(userKey) + "john~",
            limit: 10,
          });
          expect(friends).toEqual([new Friend(friendEntry.value.friend)]);
        });
      });

      describe("when query returns an empty set", () => {
        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield undefined;
            },
          });
          jest.spyOn(logger, "error");
        });

        it("logs an error if entry is undefined", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friendsByName("John")) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gt: Friend.USER_FRIENDS_BY_NAME_KEY(userKey),
            lt: `${Friend.USER_FRIENDS_BY_NAME_KEY(userKey)}~`,
          });
          expect(logger.error).toHaveBeenCalledWith("entry is undefined");
          expect(friends).toEqual([]);
        });
      });
    });
  });

  describe("#friendsByUserName", () => {
    describe("when user is not logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(undefined);
      });

      it("throws a SessionRequiredError", async () => {
        await expect(friendUseCase.friendsByUserName).rejects.toThrowError(
          SessionRequiredError
        );
      });
    });

    describe("when user is logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(user);
      });
      describe("when query returns friends", () => {
        const friendEntry = {
          value: {
            friend: {
              userKey,
              userName: "john",
              displayName: "John Smith",
            },
          },
        };

        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield friendEntry;
            },
          });
        });

        it("returns a generator of friends filtered by username", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friendsByUserName("john")) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gte: Friend.USER_FRIENDS_BY_USERNAME_KEY(userKey) + "john",
            lt: Friend.USER_FRIENDS_BY_USERNAME_KEY(userKey) + "john~",
            limit: 10,
          });
          expect(friends).toEqual([new Friend(friendEntry.value.friend)]);
        });
      });

      describe("when query returns an empty set", () => {
        beforeEach(() => {
          jest.spyOn(privateStore, "createReadStream").mockResolvedValueOnce({
            async *[Symbol.asyncIterator]() {
              yield undefined;
            },
          });
          jest.spyOn(logger, "error");
        });

        it("logs an error if entry is undefined", async () => {
          const friends = [];
          for await (const friend of friendUseCase.friendsByUserName("john")) {
            friends.push(friend);
          }

          expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
          expect(privateStore.createReadStream).toHaveBeenCalledWith({
            gt: Friend.USER_FRIENDS_BY_USERNAME_KEY(userKey),
            lt: `${Friend.USER_FRIENDS_BY_USERNAME_KEY(userKey)}~`,
          });
          expect(logger.error).toHaveBeenCalledWith("entry is undefined");
          expect(friends).toEqual([]);
        });
      });
    });
  });

  describe("#addFriend", () => {
    const friend = new Friend({
      userKey,
      userName: "jdoe",
      displayName: "John Doe",
    });

    describe("when user is not logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(undefined);
      });

      it("throws a SessionRequiredError", async () => {
        await expect(friendUseCase.addFriend(friend)).rejects.toThrowError(
          SessionRequiredError
        );
      });
    });

    describe("when user is logged in", () => {
      beforeEach(() => {
        jest.spyOn(sessionUseCase, "loggedInUser").mockReturnValue(user);
      });

      it("adds the friend and logs the action", async () => {
        await friendUseCase.addFriend(friend);

        expect(sessionUseCase.loggedInUser).toHaveBeenCalled();
        expect(privateStore.appendOperation).toHaveBeenCalledWith(
          JSON.stringify({
            type: Friend.ACTIONS.CREATE,
            friend: friend.toProperties(),
          })
        );
        expect(logger.info).toHaveBeenCalledWith(
          `Added user "${friend.userName}" as your friend.`
        );
      });
    });
  });
});
