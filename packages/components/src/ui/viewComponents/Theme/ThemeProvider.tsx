import { theme } from "@mneme/components";
import { ThemeProvider } from "styled-components";

export const MnemeThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("=============> ", { theme });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};