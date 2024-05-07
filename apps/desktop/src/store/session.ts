import { StateCreator } from "zustand";
import { User } from "../domain/User/User";

export interface SessionState {
    currentUser?: User;
    login: (user?: User) => void
    logout: () => void
}

export const createSessionStore: StateCreator<
    SessionState,
    [
        ["zustand/devtools", never],
        ["zustand/subscribeWithSelector", never],
        ["zustand/immer", never],
    ],
    [],
    SessionState
> = (set) => ({
    currentUser: undefined,
    login: (user?: User) => {
        // Perform some async operation to login
        set(() => ({ currentUser: user }));
    },
    logout: () => {
        // Perform some async operation to logout
        set(() => ({ currentUser: undefined }));
    },
});

// const unsub2 = createSessionStore.subscribe((state) => state.paw, console.log)