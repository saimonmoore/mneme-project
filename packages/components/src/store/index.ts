import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createSessionStore, ThemeState } from './theme';

// With immer, we can modify nested objects without worrying about immutability
export const useMnemeUIStore = create<ThemeState>()(devtools(subscribeWithSelector(immer((...a) => ({
    ...createSessionStore(...a),
})))));