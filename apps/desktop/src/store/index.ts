import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createSessionStore, SessionState } from './session';

// With immer, we can modify nested objects without worrying about immutability
export const useMnemeStore = create<SessionState>()(devtools(subscribeWithSelector(immer((...a) => ({
    ...createSessionStore(...a),
})))));