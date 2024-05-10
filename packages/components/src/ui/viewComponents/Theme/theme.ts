import { config as defaultConfig } from "@gluestack-ui/config";

export enum ColourMode {
  Light = "light",
  Dark = "dark",
}

export const theme = {
  ...defaultConfig,
  DEFAULT_COLOR_MODE: ColourMode.Light
};

// type MnemeTheme = typeof theme;
// declare module "@gluestack-ui/config" {
//   interface IConfig extends MnemeTheme {}
// }