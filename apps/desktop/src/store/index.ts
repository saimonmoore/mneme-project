import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createSessionStore, SessionState } from './session';
import { createUserStore, UserState } from './user';

export type Store = SessionState & UserState;

// With immer, we can modify nested objects without worrying about immutability
export const useMnemeStore = create<Store>()(devtools(subscribeWithSelector(immer((...a) => ({
    ...createSessionStore(...a),
    ...createUserStore(...a),
})))));