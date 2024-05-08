import { StateCreator } from "zustand";
import { User } from "../domain/User/User";
import { Store } from ".";

export interface UserState {
    signup: (user?: User) => void
}

export const createUserStore: StateCreator<
    Store,
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