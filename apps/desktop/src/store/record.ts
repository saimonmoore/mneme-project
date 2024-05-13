import { StateCreator } from "zustand";
import { Record } from "@mneme/desktop/domain/Record/Record";

export interface RecordState {
    records?: Record[];
    addRecord: (record: Record) => void
}

export const createRecordStore: StateCreator<
    RecordState,
    [
        ["zustand/devtools", never],
        ["zustand/subscribeWithSelector", never],
        ["zustand/immer", never],
    ],
    [],
    RecordState
> = (set) => ({
    records: undefined,
    addRecord: (record: Record) => {
        // Perform some async operation to login
        set((state) => ({ records: [record, ...state.records ?? []] }));
    },
});

// const unsub2 = createSessionStore.subscribe((state) => state.paw, console.log)