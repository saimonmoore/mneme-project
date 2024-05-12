import { StateCreator } from "zustand";
import { User } from "@mneme/desktop/domain/User/User";

export interface UserState {
    signup: (user?: User) => void
}

export const createUserStore: StateCreator<
    UserState,
    [
        ["zustand/devtools", never],
        ["zustand/subscribeWithSelector", never],
        ["zustand/immer", never],
    ],
    [],
    UserState
> = (set) => ({
    signup: (user?: User) => {
        set(() => ({ currentUser: user }));
    },
});

// const unsub2 = createSessionStore.subscribe((state) => state.paw, console.log)