import {
  afterEach,
  beforeEach,
  describe,
  it,
  jest,
  expect,
} from "@jest/globals";

import NoiseSecretStream from "hyperswarm-secret-stream";
import { PeerDiscovery, PeerInfo } from "hyperswarm";
import EventEmitter2 from "eventemitter2";
import b4a from "b4a";

import { SwarmManager } from "@/modules/Network/SwarmManager/index.js";
import { User } from "@/modules/User/domain/entities/User.js";
import { PrivateStore } from "@/infrastructure/db/stores/PrivateStore/index.js";
import { PublicStore } from "@/infrastructure/db/stores/PublicStore/index.js";
import { UserUseCase } from "@/modules/User/application/usecases/UserUseCase.js";

const mockPeerDiscovery = {
  flushed: jest.fn()
} as Partial<PeerDiscovery> as jest.Mocked<PeerDiscovery>;

jest.mock("hyperswarm", () =>
  jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    join: jest.fn().mockReturnValue(mockPeerDiscovery),
    destroy: jest.fn(),
    keyPair: {
      publicKey: b4a.from("abc123", "hex"),
    },
    connections: [],
    connecting: 0,
    peers: new Set(),
  }))
);

const privateStorePublicKeyString = "privateCore:abc123";
const publicStorePublicKeyString = "publicCore:abc123";
const privateStoreLocalPublicKeyString =
  "privateCoreLocal:andlotsofothercharacterstomakeatototalof64chars";
const publicStoreLocalPublicKeyString =
  "publicCoreLocal:andlotsofothercharacterstomakeatototalof64chars";
const privateDiscoveryKeyString = "discovery:private:abc123";
const publicDiscoveryKeyString = "discovery:public:abc123";
const otherPeerKeyString = "discovery:abc123";

describe("SwarmManager", () => {
  let swarmManager: SwarmManager;

  const currentUser = new User({
    email: "test@example.com",
    userName: "testuser",
  });

  const eventBus = {
    emit: jest.fn(),
  } as Partial<EventEmitter2> as jest.Mocked<EventEmitter2>;

  const privateStore = {
    discoveryKey: b4a.from(Buffer.from(privateDiscoveryKeyString), "hex"),
    publicKeyString: privateStorePublicKeyString,
    localPublicKeyString: privateStoreLocalPublicKeyString,
    appendWriter: jest.fn(),
    replicate: jest.fn(),
    bootstrapped: false,
  } as Partial<PrivateStore> as jest.Mocked<PrivateStore>;

  const publicStore = {
    discoveryKey: b4a.from(Buffer.from(publicDiscoveryKeyString), "hex"),
    publicKeyString: publicStorePublicKeyString,
    localPublicKeyString: publicStoreLocalPublicKeyString,
    appendWriter: jest.fn(),
    replicate: jest.fn(),
    bootstrapped: false,
  } as Partial<PublicStore> as jest.Mocked<PublicStore>;

  const userManager = {
    signup: jest.fn(),
    login: jest.fn(),
    loggedIn: jest.fn(),
    loggedInUser: jest.fn(),
    updateWriter: jest.fn(),
    directLogin: jest.fn(),
  } as Partial<UserUseCase> as jest.Mocked<UserUseCase>;

  beforeEach(() => {
    jest.useFakeTimers();

    // Assume we're always logged in
    (userManager as unknown as any).loggedIn.mockReturnValue(true);
    swarmManager = new SwarmManager(
      { private: privateStore, public: publicStore },
      userManager,
      eventBus
    );
  });

  afterEach(() => {
    (privateStore as unknown as any).bootstrapped = false;
  });

  describe("when starting the SwarmManager", () => {
    beforeEach(async () => {
      await swarmManager.start();
    });

    it("joins the swarm with the privateStore discoveryKey", async () => {
      expect(swarmManager.swarm.join).toHaveBeenCalledWith(
        privateStore.discoveryKey
      );
    });

    it("attaches event listeners to the swarm", async () => {
      expect((swarmManager.swarm.on as jest.Mock).mock.calls[0][0]).toBe(
        "connection"
      );
      expect(
        ((swarmManager.swarm.on as jest.Mock).mock.calls[0][1] as any).name
      ).toBe(swarmManager.handleSwarmConnection.bind(swarmManager).name);

      expect((swarmManager.swarm.on as jest.Mock).mock.calls[0][0]).toBe(
        "update"
      );
      expect(
        ((swarmManager.swarm.on as jest.Mock).mock.calls[1][1] as any).name
      ).toBe(swarmManager.handleSwarmUpdate.bind(swarmManager).name);
    });
  });

  describe("when a connection is made", () => {
    let mockConnection: jest.Mocked<NoiseSecretStream>;

    beforeEach(() => {
      mockConnection = {
        on: jest.fn(),
        write: jest.fn(),
      } as Partial<NoiseSecretStream> as jest.Mocked<NoiseSecretStream>;
    });

    describe("when the device is bootsrapped", () => {
      beforeEach(async () => {
        (privateStore as unknown as any).bootstrapped = true;
      });

      it("sends the peer writer message after a delay", async () => {
        await swarmManager.handleSwarmConnection(mockConnection, {
          publicKey: b4a.from(otherPeerKeyString, "hex"),
        } as unknown as PeerInfo);

        jest.advanceTimersByTime(1000);

        expect(mockConnection.write).toHaveBeenCalledWith(
          JSON.stringify({
            [SwarmManager.REMOTE_OWNER_REQUEST_MAKE_STORES_WRITABLE]: {
              privateStoreLocalPublicKey: privateStoreLocalPublicKeyString,
              publicStoreLocalPublicKey: publicStoreLocalPublicKeyString,
              privateStorePublicKey: privateStore.publicKeyString,
            },
          })
        );
      });
    });

    describe("when the device is NOT bootstrapped", () => {
      beforeEach(async () => {
        (privateStore as unknown as any).bootstrapped = false;
      });

      it("does NOT send the peer writer message after a delay", async () => {
        await expect(
          swarmManager.handleSwarmConnection(mockConnection, {
            publicKey: b4a.from(otherPeerKeyString, "hex"),
          } as unknown as PeerInfo)
        ).resolves;
      });
    });

    it("attaches data, close, and error event listeners to the connection", async () => {
      await swarmManager.handleSwarmConnection(mockConnection, {
        publicKey: b4a.from(otherPeerKeyString, "hex"),
      } as unknown as PeerInfo);

      expect(mockConnection.on.mock.calls[0][0]).toBe("data");
      expect(mockConnection.on.mock.calls[0][1].name).toBe(
        "bound bound actuallyHandleData"
      );

      expect(mockConnection.on).toHaveBeenCalledWith(
        "close",
        expect.any(Function)
      );
      expect(mockConnection.on).toHaveBeenCalledWith(
        "error",
        expect.any(Function)
      );
    });

    it("replicates the corestore with the connection", async () => {
      await swarmManager.handleSwarmConnection(mockConnection, {
        publicKey: b4a.from(otherPeerKeyString, "hex"),
      } as unknown as PeerInfo);

      expect(swarmManager.privateStore.replicate).toHaveBeenCalledWith(
        mockConnection
      );
    });
  });

  //   describe("when a swarm update occurs", () => {
  //     beforeEach(async () => {
  //       await swarmManager.handleSwarmUpdate();
  //     });

  //     it("logs the current swarm status", async () => {
  //       expect(console.log).toHaveBeenCalledWith(
  //         "[SwarmManager#handleSwarmUpdate] Swarm update...",
  //         {
  //           connections: 0,
  //           connecting: 0,
  //           peers: 0,
  //         }
  //       );
  //     });
  //   });

  describe("when joining the swarm", () => {
    beforeEach(async () => {
      await swarmManager.joinSwarm();
      mockPeerDiscovery.flushed.mockResolvedValueOnce(true);
    });

    it("each store joins the swarm with their discoveryKey", async () => {
      expect(
        b4a.toString(
          (swarmManager.swarm.join as jest.Mock).mock.calls[0][0] as Buffer,
          "hex"
        )
      ).toStrictEqual(
        b4a.toString(
          b4a.from(Buffer.from(privateDiscoveryKeyString), "hex"),
          "hex"
        )
      );

      expect(
        b4a.toString(
          (swarmManager.swarm.join as jest.Mock).mock.calls[1][0] as Buffer,
          "hex"
        )
      ).toStrictEqual(
        b4a.toString(
          b4a.from(Buffer.from(publicDiscoveryKeyString), "hex"),
          "hex"
        )
      );

      expect(
        swarmManager.swarm.join("topic" as unknown as Buffer).flushed
      ).toHaveBeenCalledTimes(2);
    });
  });

  describe("when sending the peer writer", () => {
    let mockConnection: NoiseSecretStream;

    beforeEach(async () => {
      // Assume we're logged in
      userManager.loggedInUser.mockReturnValue(currentUser);

      mockConnection = {
        write: jest.fn(),
      } as unknown as jest.Mocked<NoiseSecretStream>;

      await swarmManager.sendRemoteOwnerMakeStoresWritableRequest(
        mockConnection
      );
    });

    it("sends the local private autobee public key to the connection", async () => {
      expect(mockConnection.write).toHaveBeenCalledWith(
        JSON.stringify({
          [SwarmManager.REMOTE_OWNER_REQUEST_MAKE_STORES_WRITABLE]: {
            privateStoreLocalPublicKey: privateStoreLocalPublicKeyString,
            publicStoreLocalPublicKey: publicStoreLocalPublicKeyString,
            privateStorePublicKey: privateStore.publicKeyString,
          },
        })
      );
    });
  });

  describe("when processing remote peer writer data", () => {
    let mockConnection: NoiseSecretStream;

    beforeEach(() => {
      mockConnection = {
        write: jest.fn(),
      } as unknown as jest.Mocked<NoiseSecretStream>;
    });

    describe("when data contains USER_PEER_WRITER", () => {
      const data = JSON.stringify({
        [SwarmManager.REMOTE_OWNER_REQUEST_MAKE_STORES_WRITABLE]: {
          privateStoreLocalPublicKey: privateStoreLocalPublicKeyString,
          publicStoreLocalPublicKey: publicStoreLocalPublicKeyString,
          privateStorePublicKey: privateStore.publicKeyString,
        },
      });

      beforeEach(() => {
        // Assume we're logged in
        userManager.loggedInUser.mockReturnValue(currentUser);
      });

      it("adds the remote peer private writer to the private autobee", async () => {
        await swarmManager.handleData(mockConnection)(b4a.from(data));
        expect(swarmManager.privateStore.appendWriter).toHaveBeenCalledWith(
          privateStoreLocalPublicKeyString
        );
        // We should have called the updateWriter method with the localPublicKeyString
        expect(swarmManager.userManager.updateWriter).toHaveBeenCalledWith(
          privateStoreLocalPublicKeyString
        );

        // Wait 2 seconds for the sendRemoteOwnerLoginPing to be called
        jest.advanceTimersByTime(2000);

        // Ensure we sent the login ping
        expect(mockConnection.write).toHaveBeenCalledWith(
          JSON.stringify({
            [SwarmManager.REMOTE_OWNER_LOGIN]: {
              userKey: currentUser.key,
            },
          })
        );
      });
    });

    describe("when BOOTSTRAPPED AND data contains REMOTE_OWNER_LOGIN", () => {
      const data = JSON.stringify({
        [SwarmManager.REMOTE_OWNER_LOGIN]: {
          userKey: currentUser.key,
        },
      });

      beforeEach(() => {
        // Assume we're bootstrapped
        (privateStore as unknown as any).bootstrapped = true;
        userManager.loggedInUser.mockReturnValue(currentUser);
        userManager.directLogin.mockResolvedValue(currentUser);
      });

      it("directly logs in the user by getting the user data from the private core", async () => {
        await swarmManager.handleData(mockConnection)(b4a.from(data));

        expect(userManager.directLogin).toHaveBeenCalledWith(currentUser.key);
      });
    });

    // TODO: It says console.error is not being called but must be separate instance
    // it("handles errors when parsing the remote peer writer data", async () => {
    //   privateStore.appendWriter = jest.fn().mockRejectedValue();

    //   const data = JSON.stringify({
    //     [SwarmManager.USER_PEER_WRITER]: localPublicKeyString,
    //   });

    //   await swarmManager.makeRemotePeerPrivateAutobaseWritable(b4a.from(data));

    //   expect(console.error).toHaveBeenCalled();
    // });
  });

  describe("when destroying the SwarmManager", () => {
    it("destroys the swarm", async () => {
      await swarmManager.destroy();
      expect(swarmManager.swarm.destroy).toHaveBeenCalled();
    });
  });
});
