import { jest, expect } from "@jest/globals";

// import Corestore from "corestore";

jest.mock("corestore", () =>
  jest.fn().mockImplementation(() => ({
    namespace: jest.fn(),
  }))
);


jest.unstable_mockModule("../../stores/PrivateStore/PrivateStore.js", () => ({
  PrivateStore: jest.fn(() => ({
    start: jest.fn(),
    destroy: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../stores/PublicStore/PublicStore.js", () => ({
  PublicStore: jest.fn(() => ({
    start: jest.fn(),
    destroy: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../modules/Network/SwarmManager/SwarmManager.js", () => ({
  SwarmManager: jest.fn(() => ({
    start: jest.fn(),
    destroy: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../modules/User/application/UserUseCase/UserUseCase.js", () => ({
  UserUseCase: jest.fn(() => ({
    signup: jest.fn(),
    login: jest.fn(),
    loggedIn: jest.fn(),
    loggedInUser: jest.fn(),
  })),
}));

import { PrivateStore } from "../../infrastructure/db/stores/PrivateStore/PrivateStore.js";
//import { PrivateStore } from "../../infrastructure/db/stores/PublicStore/PublicStore.js";
import { SwarmManager } from "../../modules/Network/SwarmManager/SwarmManager.js";
import { Mneme } from "../index.js";
import { User } from "../../modules/User/domain/entities/User.js";

describe("Mneme", () => {
  const bootstrapPrivateCorePublicKey = "bootstrapPrivateKey";
  const storage = "./data";
  const testingDHT = "testingDHT";
  const user = new User({
    email: "test@example.com",
    userName: "testuser",
  });

  describe("when initial owner", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(undefined, storage, testingDHT);
    });

    it("instantiates the private store and swarm manager", async () => {
      expect(SwarmManager).toHaveBeenCalledWith(
        { private: mneme.privateStore, public: mneme.publicStore },
        mneme.userManager,
        mneme.eventBus,
        testingDHT
      );
      expect(PrivateStore).toHaveBeenCalledWith(expect.anything(), undefined);
    });
  });

  describe("when 2nd owner", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(bootstrapPrivateCorePublicKey, storage, testingDHT);
    });

    it("instantiates the private store and swarm manager", async () => {
      expect(SwarmManager).toHaveBeenCalledWith(
        { private: mneme.privateStore, public: mneme.publicStore },
        mneme.userManager,
        mneme.eventBus,
        testingDHT
      );
      expect(PrivateStore).toHaveBeenCalledWith(
        expect.anything(),
        bootstrapPrivateCorePublicKey
      );
    });
  });

  describe("start", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(bootstrapPrivateCorePublicKey, storage, testingDHT);
    });

    it("should start private store and swarm manager", async () => {
      await mneme.start();

      expect(mneme.privateStore.start).toHaveBeenCalled();
      expect(mneme.swarmManager.start).toHaveBeenCalled();
    });
  });

  describe("signup", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(undefined, storage, testingDHT);

      jest.spyOn(mneme.userManager, "signup");
    });

    describe("when user is already logged in", () => {
      beforeEach(() => {
        (mneme.userManager.loggedIn as jest.Mock).mockReturnValue(true);
      });

      it("throws an error", async () => {
        await expect(mneme.signup(user)).rejects.toThrow(
          "User is already logged in"
        );
      });
    });

    describe("when user is not already logged in", () => {
      beforeEach(() => {
        (mneme.userManager.loggedIn as jest.Mock).mockReturnValue(false);
      });

      it("delegates to the UserManager", async () => {
        expect(await mneme.signup(user)).toBeTruthy();

        expect(mneme.userManager.signup).toHaveBeenCalledWith(user);
      });

      it("emits a USER_LOGIN event", async () => {
        const eventSpy = jest.fn();
        mneme.eventBus.on(Mneme.EVENTS.USER_LOGIN, eventSpy);

        await mneme.signup(user);

        expect(eventSpy).toHaveBeenCalledWith(user);
      });
    });
  });

  describe("login", () => {
    let mneme: Mneme;

    const potentialUserDto = {
      email: "test@example.com",
      userName: "testuser",
      password: "password",
    };

    const potentialUser = new User(potentialUserDto);

    const actualUser = new User({
      email: "test@example.com",
      userName: "testuser",
      password: "password",
    });

    beforeEach(() => {
      mneme = new Mneme(undefined, storage, testingDHT);

      jest.spyOn(mneme.userManager, "login").mockResolvedValue(actualUser);
    });

    it("delegates to the UserManager", async () => {
      await mneme.login(potentialUserDto.email, potentialUserDto.password);

      expect(mneme.userManager.login).toHaveBeenCalledWith(potentialUser);
    });

    it("returns the actual user", async () => {
      const user = await mneme.login(potentialUserDto.email, potentialUserDto.password);

      expect(user).not.toBeFalsy();
      expect(user?.toProperties()).toStrictEqual(actualUser.toProperties());
    });

    it("emits a USER_LOGIN event", async () => {
      const eventSpy = jest.fn();
      mneme.eventBus.on(Mneme.EVENTS.USER_LOGIN, eventSpy);

      await mneme.login(potentialUserDto.email, potentialUserDto.password);

      expect(eventSpy).toHaveBeenCalledWith(potentialUser);
    });
  });

  describe("loggedIn", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(bootstrapPrivateCorePublicKey, storage, testingDHT);
      (mneme.userManager.loggedIn as jest.Mock).mockReturnValue(true);
    });

    it("should delegate to the userManager", async () => {
      expect(mneme.loggedIn()).toBeTruthy();
    });
  });

  describe("loggedInUser", () => {
    let mneme: Mneme;

    beforeEach(() => {
      mneme = new Mneme(bootstrapPrivateCorePublicKey, storage, testingDHT);
      (mneme.userManager.loggedInUser as jest.Mock).mockReturnValue(user);
    });

    it("should delegate to the userManager", async () => {
      expect(mneme.loggedInUser()).toBe(user);
    });
  });

  describe("destroy", () => {
    let mneme: Mneme;

    beforeEach(async () => {
      mneme = new Mneme(undefined, storage, testingDHT);
      await mneme.destroy();
    });

    it("should destroy p2p connections", async () => {
      expect(mneme.swarmManager.destroy).toHaveBeenCalled();
      expect(mneme.privateStore.destroy).toHaveBeenCalled();
    });
  });
});
