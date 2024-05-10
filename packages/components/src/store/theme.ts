import { StateCreator } from "zustand";
import { ColourMode } from "@mneme/components";

export interface ThemeState {
    currentColourMode?: ColourMode;
    setColourMode: (colourMode: ColourMode) => void
}

export const createSessionStore: StateCreator<
    ThemeState,
    [
        ["zustand/devtools", never],
        ["zustand/subscribeWithSelector", never],
        ["zustand/immer", never],
    ],
    [],
    ThemeState
> = (set) => ({
    currentColourMode: undefined,
    setColourMode: (colourMode: ColourMode) => {
        set(() => ({ currentColourMode: colourMode }));
    },
});