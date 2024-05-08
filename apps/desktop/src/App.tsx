import "reflect-metadata";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@radix-ui/themes/styles.css";
import {
  Box,
  Button,
  Flex,
  Heading,
  Theme,
  ThemePanel,
} from "@radix-ui/themes";

import viteLogo from "/vite.svg";
import { Page } from "./ui/core/Page/Page";
import { LoginView } from "./view/Login/Login";
import { MnemeTheme } from "./ui/theme";
import { useMnemeStore } from "./store";

type MnemeTheme = "light" | "dark";

const MnemeThemeProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("=============> ", { MnemeTheme });
  return <ThemeProvider theme={MnemeTheme}>{children}</ThemeProvider>;
};

const LoggedOutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="column" align="center" gap="4">
      <Heading>Welcome to Mneme</Heading>
      {children}
    </Flex>
  );
};

const LoggedInLayout = ({ children }: { children: React.ReactNode }) => {
  const logout = useMnemeStore((state) => state.logout);

  return (
    <Flex direction="column" align="center">
      <Heading>Mneme</Heading>
      {children}
      <Box>
        <Button variant="soft" size="2" onClick={() => logout()}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

const Main = () => {
  const queryClient = new QueryClient();
  const currentUser = useMnemeStore((state) => state.currentUser);

  console.log("=============> ", { currentUser });
  return (
    <QueryClientProvider client={queryClient}>
      <Box>
        <img src={viteLogo} alt="Vite Logo" />
        {!currentUser && <LoggedOutLayout>{<LoginView />}</LoggedOutLayout>}
        {currentUser && <LoggedInLayout>Dashboard</LoggedInLayout>}
      </Box>
    </QueryClientProvider>
  );
};
function App() {
  const [currentTheme, setCurrentTheme] = useState<MnemeTheme>("light");

  return (
    <Theme appearance={currentTheme} accentColor="indigo">
      <ThemePanel />
      <MnemeThemeProvider>
        <Page>
          <Main />
          <Box>
            <Button
              variant="soft"
              size="2"
              onClick={() =>
                setCurrentTheme(currentTheme === "light" ? "dark" : "light")
              }
            >
              {currentTheme === "light" ? "dark" : "light"}
            </Button>
          </Box>
        </Page>
      </MnemeThemeProvider>
    </Theme>
  );
}

export default App;
