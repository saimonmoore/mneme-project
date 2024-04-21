import { jest, expect, describe, beforeEach, it } from "@jest/globals";

import { SessionUseCase } from "@/modules/Session/application/usecases/SessionUseCase/index.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { sha256 } from "@/infrastructure/helpers/hash.js";

describe("SessionUseCase", () => {
  let sessionUseCase: SessionUseCase;
  let privateStore: PrivateStore;

  const user = User.fromProperties({
    email: "foo@bar.com",
    password: "password",
  });

  const userKey = sha256(user.email);

  beforeEach(() => {
    privateStore = {
      get: jest.fn(),
    } as Partial<jest.Mocked<PrivateStore>> as jest.Mocked<PrivateStore>;

    sessionUseCase = new SessionUseCase(privateStore);
  });

  describe("#isLoggedIn", () => {
    it("returns true if a user is logged in", () => {
      sessionUseCase.currentUser = user;
      expect(sessionUseCase.isLoggedIn()).toBe(true);
    });

    it("returns false if no user is logged in", () => {
      sessionUseCase.currentUser = undefined;
      expect(sessionUseCase.isLoggedIn()).toBe(false);
    });
  });

  describe("#loggedInUser", () => {
    it("returns the logged in user", () => {
      sessionUseCase.currentUser = user;
      expect(sessionUseCase.loggedInUser()).toBe(user);
    });

    it("returns undefined if no user is logged in", () => {
      sessionUseCase.currentUser = undefined;
      expect(sessionUseCase.loggedInUser()).toBeUndefined();
    });
  });

  describe("#directLoginByKey", () => {
    describe("when user is found", () => {
      const record = {
        value: {
          user: {
            email: "test@example.com",
            encryptedPassword: userKey,
          },
          writers: ["writer1", "writer2"],
        },
      };

      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("logs in the user with the given key", async () => {
        const loggedInUser = new User(record.value.user);
        user.writers = record.value.writers;

        const result = await sessionUseCase.directLoginByKey(userKey);

        expect(privateStore.get).toHaveBeenCalledWith(userKey);
        expect(User.fromProperties).toHaveBeenCalledWith(record.value.user);
        expect(sessionUseCase.currentUser?.toProperties()).toBe(
          expect.objectContaining(loggedInUser.toProperties())
        );
        expect(result).toBe(user);
      });
    });

    describe("when user is NOT found", () => {
      const record = {
        value: undefined,
      };

      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("returns undefined if no user is found for the given key", async () => {
        const result = await sessionUseCase.directLoginByKey(userKey);

        expect(privateStore.get).toHaveBeenCalledWith(userKey);
        expect(sessionUseCase.currentUser).toBeUndefined();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("#directLogin", () => {
    describe("when the user is supplied", () => {
      it("logs in the given user", () => {
        const result = sessionUseCase.directLogin(user);

        expect(sessionUseCase.currentUser).toBe(user);
        expect(result).toBe(user);
      });
    });

    describe("when the user is not supplied", () => {
      it("returns undefined if no user is provided", () => {
        const result = sessionUseCase.directLogin(undefined);

        expect(sessionUseCase.currentUser).toBeUndefined();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("#login", () => {
    const email = "test@example.com";
    const password = "password";

    describe("when credentials are valid", () => {
      const record = {
        value: {
          user: {
            email,
            password: sha256(password),
          },
          writers: ["writer1", "writer2"],
        },
      };
      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("logs in the user with the given email and password", async () => {
        const partialUser = new User({ email, password });
        const user = User.fromProperties(record.value.user);
        user.writers = record.value.writers;

        const result = await sessionUseCase.login(email, password);

        expect(privateStore.get).toHaveBeenCalledWith(partialUser.key);
        expect(sessionUseCase.currentUser).toBe(user);
        expect(result).toBe(user);
      });
    });

    describe("when already logged in", () => {
      const record = {
        value: {
          user: {
            email,
            password: sha256(password),
          },
          writers: ["writer1", "writer2"],
        },
      };
      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("returns undefined", async () => {
        sessionUseCase.currentUser = user;
        const result = await sessionUseCase.login(email, password);

        expect(privateStore.get).not.toHaveBeenCalled();
        expect(sessionUseCase.currentUser).toBeDefined();
        expect(result).toBeUndefined();
      });
    });

    describe("when user not found for the given email", () => {
      const record = {
        value: undefined,
      };

      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("returns undefined", async () => {
        const partialUser = new User({ email, password });

        const result = await sessionUseCase.login(email, password);

        expect(privateStore.get).toHaveBeenCalledWith(partialUser.key);
        expect(sessionUseCase.currentUser).toBeUndefined();
        expect(result).toBeUndefined();
      });
    });

    describe("when credentials are invalid", () => {
      const record = {
        value: {
          user: {
            email,
            password: sha256("not a password"),
          },
          writers: ["writer1", "writer2"],
        },
      };
      beforeEach(() => {
        jest.spyOn(privateStore, "get").mockResolvedValueOnce(record);
      });

      it("returns undefined if the password is incorrect", async () => {
        const partialUser = new User({ email, password });
        const result = await sessionUseCase.login(email, password);

        expect(privateStore.get).toHaveBeenCalledWith(partialUser.key);
        expect(sessionUseCase.currentUser).toBeUndefined();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("#logout", () => {
    it("logs out the current user", async () => {
      sessionUseCase.currentUser = user;

      await sessionUseCase.logout();

      expect(sessionUseCase.currentUser).toBeUndefined();
    });
  });
});
