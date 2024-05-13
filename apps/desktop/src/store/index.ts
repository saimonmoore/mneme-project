import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createSessionStore, SessionState } from './session';
import { createUserStore, UserState } from './user';
import { createRecordStore, RecordState } from './record';

// With immer, we can modify nested objects without worrying about immutability
export const useMnemeStore = create<SessionState & UserState & RecordState>()(devtools(subscribeWithSelector(immer((...a) => ({
    ...createSessionStore(...a),
    ...createUserStore(...a),
    ...createRecordStore(...a),
})))));